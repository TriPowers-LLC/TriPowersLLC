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

DotNetEnv.Env.Load();
if (File.Exists("../.env")) DotNetEnv.Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);

// 0. JWT Authentication
var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? builder.Configuration["Jwt__Key"];

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
var   connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DEFAULT")
    ?? Environment.GetEnvironmentVariable("DEFAULT_CONNECTION");
if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("Missing connection string 'DefaultConnection'.");

builder.Services.AddDbContext<JobDBContext>(opts =>
    opts.UseSqlServer(connectionString));

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

var allowedOrigins = new[]
{
    "http://localhost:5173",
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
        "Microsoft.EntityFrameworkCore.SqlServer"
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
        var asm = typeof(Microsoft.Data.SqlClient.SqlConnection).Assembly.GetName();
        return (asm.Name!, asm.Version!.ToString());
    });

    var ef = TryGet(() => {
        var asm = typeof(Microsoft.EntityFrameworkCore.SqlServerDbContextOptionsExtensions).Assembly.GetName();
        return (asm.Name!, asm.Version!.ToString());
    });

    var loaded = AppDomain.CurrentDomain
        .GetAssemblies()
        .Select(a => a.GetName())
        .Where(n => n.Name!.Contains("SqlClient", StringComparison.OrdinalIgnoreCase)
                 || n.Name!.Contains("EntityFrameworkCore.SqlServer", StringComparison.OrdinalIgnoreCase))
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
        using var con = new Microsoft.Data.SqlClient.SqlConnection(cs);
        await con.OpenAsync();
        return Results.Ok(new { ok = true, serverVersion = con.ServerVersion });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.ToString());
    }
}).AllowAnonymous();

// Let all preflights succeed
app.MapMethods("/api/{*path}", new[] { "OPTIONS" }, () => Results.NoContent())
   .AllowAnonymous();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);

app.Run();
