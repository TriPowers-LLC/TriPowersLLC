using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Patterns;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using TriPowersLLC.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using Amazon.S3;
using Amazon;

using Bogus;
using System.Security.Cryptography;

DotNetEnv.Env.Load();
if (File.Exists("../.env")) DotNetEnv.Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine($"builder env: {builder.Environment.EnvironmentName}");
// 0. JWT Authentication
var jwtKey =
    builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(jwtKey))
    throw new InvalidOperationException("Missing Jwt:Key in configuration");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = false,
            ValidateAudience         = false,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// 1. EF Core
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DEFAULT_CONNECTION")
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("Missing connection string 'DefaultConnection'.");

builder.Services.AddDbContext<JobDBContext>(opts =>
    opts.UseNpgsql(connectionString));

// 2. Named OpenAI HttpClient

builder.Services.AddHttpClient("openai", client =>
{
    client.BaseAddress = new Uri("https://api.openai.com");
    var key = builder.Configuration["OpenAI:ApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");
    if (!string.IsNullOrWhiteSpace(key))
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);
});


// 3. Controllers
builder.Services.AddControllersWithViews();

// 4. Swagger / CORS / etc.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();

var allowedOrigins = new[]
{
    "http://localhost:5173",
    "http://localhost:3000",
    "https://api.tripowersllc.com",
    "https://www.tripowersllc.com",
    "https://tripowersllc.com",
    "https://tri-powers-llc.vercel.app",
};

builder.Services.AddCors(o =>
{
    // Default policy used globally
    o.AddDefaultPolicy(p => p
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod());

    // Keep the named policy too (if you ever want endpoint-level use)
    o.AddPolicy("AllowWeb", p => p
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var region = builder.Configuration["AWS_REGION"] ?? "us-east-1";
builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var config = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
    };
    return new AmazonS3Client(config);
});


var baseUrl = builder.Configuration["Some:BaseUrl"];
if (!Uri.TryCreate(baseUrl, UriKind.Absolute, out var serviceUri))
{
    serviceUri = new Uri("https://api.tripowersllc.com/");
}


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

if (!app.Environment.IsDevelopment())
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
    app.Urls.Add($"http://0.0.0.0:{port}");
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// *** CORS middleware MUST run here ***
app.UseCors();  // <- default policy

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/_routes", (IEnumerable<EndpointDataSource> sources) =>
{
    var lines = new List<string>();
    foreach (var src in sources)
        foreach (var ep in src.Endpoints.OfType<RouteEndpoint>())
            lines.Add($"HTTP: {string.Join(",", ep.Metadata.OfType<HttpMethodMetadata>().FirstOrDefault()?.HttpMethods ?? new[] { "*" })}  {ep.RoutePattern.RawText}");
    return Results.Text(string.Join(Environment.NewLine, lines), "text/plain");
}).AllowAnonymous();

app.MapGet("/api/health", () => Results.Ok(new { ok = true, time = DateTimeOffset.UtcNow }))
   .AllowAnonymous();

app.MapGet("/__ef", () =>
{
    var names = new[] {
        "Microsoft.EntityFrameworkCore",
        "Microsoft.EntityFrameworkCore.Relational",
        "Npgsql.EntityFrameworkCore.PostgreSQL"
    };
    var list = AppDomain.CurrentDomain.GetAssemblies()
        .Where(a => names.Contains(a.GetName().Name))
        .Select(a => new { a.GetName().Name, Version = a.GetName().Version!.ToString() });
    return Results.Json(list);
}).AllowAnonymous();

app.MapGet("/_assemblies", () =>
{
    object TryGet(Func<(string name, string ver)> f)
    {
        try
        {
            var (name, ver) = f();
            return new { name, version = ver, ok = true };
        }
        catch (Exception ex)
        {
            return new { ok = false, error = ex.GetType().Name, message = ex.Message };
        }
    }

    var sql = TryGet(() => {
        var asm = typeof(Npgsql.NpgsqlConnection).Assembly.GetName();
        return (asm.Name!, asm.Version!.ToString());
    });

    var ef = TryGet(() => {
        var asm = AppDomain.CurrentDomain.GetAssemblies().First(a => a.GetName().Name!.Contains("Npgsql.EntityFrameworkCore.PostgreSQL"));
        var name = asm.GetName();
        return (name.Name!, name.Version!.ToString());
    });

    var loaded = AppDomain.CurrentDomain
        .GetAssemblies()
        .Select(a => a.GetName())
        .Where(n => n.Name!.Contains("Npgsql", StringComparison.OrdinalIgnoreCase)
                 || n.Name!.Contains("EntityFrameworkCore.PostgreSQL", StringComparison.OrdinalIgnoreCase))
        .Select(n => new { n.Name, Version = n.Version?.ToString() })
        .ToArray();

    return Results.Json(new { sql, ef, loaded }, statusCode: 200);
}).AllowAnonymous();

app.MapGet("/api/dbcheck", async (IConfiguration cfg) =>
{
    var cs = cfg.GetConnectionString("DefaultConnection")
             ?? cfg["DEFAULT_CONNECTION"]
             ?? Environment.GetEnvironmentVariable("DEFAULT_CONNECTION");

    try
    {
        using var con = new Npgsql.NpgsqlConnection(cs);
        await con.OpenAsync();
        return Results.Ok(new { ok = true, serverVersion = con.ServerVersion });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.ToString());
    }
}).AllowAnonymous();

// Let all preflights succeed
app.MapMethods("/api/{*path}", new[] { "OPTIONS" }, (HttpContext context) =>
{
    context.Response.Headers["Access-Control-Allow-Origin"] = context.Request.Headers["Origin"];
    context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
    context.Response.Headers["Access-Control-Allow-Headers"] = "Authorization,Content-Type";

    return Results.NoContent();
}).AllowAnonymous();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);
Console.WriteLine($"app env: {app.Environment.EnvironmentName}");
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<JobDBContext>();

    db.Database.EnsureCreated();

    if (!db.Jobs.Any())
    {
        var jobFaker = new Faker<Job>()
            .RuleFor(j => j.Title, f => f.Name.JobTitle())
            .RuleFor(j => j.Description, f => f.Lorem.Paragraphs(2))
            .RuleFor(j => j.Requirements, f => f.Lorem.Paragraph())
            .RuleFor(j => j.Responsibilities, f => f.Lorem.Paragraph())
            .RuleFor(j => j.Location, f => f.Address.City())
            .RuleFor(j => j.EmploymentType, "Full-Time")
            .RuleFor(j => j.VendorName, "TriPowers LLC")
            .RuleFor(j => j.SalaryRangeMin, 70000)
            .RuleFor(j => j.SalaryRangeMax, 120000)
            .RuleFor(j => j.Benefits, "Health, PTO, 401k")
            .RuleFor(j => j.PostedAt, DateTime.UtcNow)
            .RuleFor(j => j.CreatedAt, DateTime.UtcNow)
            .RuleFor(j => j.UpdatedAt, DateTime.UtcNow)
            .RuleFor(j => j.IsActive, true)
            .RuleFor(j => j.Views, 0)
            .RuleFor(j => j.ApplicantsCount, 0);

        var jobs = jobFaker.Generate(10);
        db.Jobs.AddRange(jobs);
        db.SaveChanges();

        var savedJobs = db.Jobs.ToList();

        var applicantFaker = new Faker<Applicants>()
            .RuleFor(a => a.FirstName, f => f.Name.FirstName())
            .RuleFor(a => a.LastName, f => f.Name.LastName())
            .RuleFor(a => a.FullName, (f, a) => $"{a.FirstName} {a.LastName}")
            .RuleFor(a => a.Email, f => f.Internet.Email())
            .RuleFor(a => a.Phone, f => f.Phone.PhoneNumber())
            .RuleFor(a => a.City, f => f.Address.City())
            .RuleFor(a => a.State, f => f.Address.StateAbbr())
            .RuleFor(a => a.Country, "USA")
            .RuleFor(a => a.ZipCode, f => f.Address.ZipCode())
            .RuleFor(a => a.StreetAddress, f => f.Address.StreetAddress())
            .RuleFor(a => a.ResumeUrl, "https://example.com/resume.pdf")
            .RuleFor(a => a.CoverLetter, f => f.Lorem.Paragraph())
            .RuleFor(a => a.AppliedAt, f => DateTime.UtcNow.AddDays(-f.Random.Int(1, 30)))
            .RuleFor(a => a.JobId, f => f.PickRandom(savedJobs).Id);

        db.Applicants.AddRange(applicantFaker.Generate(25));
        db.SaveChanges();
    }

    // 🔥 THIS IS THE IMPORTANT PART
    var existingAdmin = db.Users.SingleOrDefault(u => u.Username == "admin");
    if (existingAdmin != null)
    {
        db.Users.Remove(existingAdmin);
        db.SaveChanges();
    }

    using var hmac = new HMACSHA512();

    db.Users.Add(new User
    {
        Username = "admin",
        Role = "admin",
        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Password123!")),
        PasswordSalt = hmac.Key
    });

    db.SaveChanges();

    Console.WriteLine("✅ Admin user seeded: admin / Password123!");
    Console.WriteLine($"Users in DB: {db.Users.Count()}");
}

app.Run();

public partial class Program { }
