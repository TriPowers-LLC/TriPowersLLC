using Amazon;
using Amazon.S3;
using Amazon.Runtime;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using System.Security.Claims;
using TriPowersLLC.Auth;
using TriPowersLLC.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Configuration.AddEnvironmentVariables();

// JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? builder.Configuration["Jwt__Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("Missing Jwt:Key in configuration.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),

            // 🔥 THIS IS THE FIX
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.Name
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicies.Applicant, policy =>
        policy.RequireAuthenticatedUser()
              .RequireAssertion(context => AuthPolicies.HasRole(context.User, "applicant")));

    options.AddPolicy(AuthPolicies.Admin, policy =>
        policy.RequireAuthenticatedUser()
              .RequireAssertion(context => AuthPolicies.HasRole(context.User, "admin")));

    options.AddPolicy(AuthPolicies.ApplicantOrAdmin, policy =>
        policy.RequireAuthenticatedUser()
              .RequireAssertion(context => AuthPolicies.HasRole(context.User, "applicant", "admin")));
});

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection.");
}

var npgsqlBuilder = new NpgsqlConnectionStringBuilder(connectionString);

builder.Services.AddDbContext<JobDBContext>(options =>
    options.UseNpgsql(npgsqlBuilder.ConnectionString));

// OpenAI client
builder.Services.AddHttpClient("openai", client =>
{
    client.BaseAddress = new Uri("https://api.openai.com");

    var openAiKey =
        builder.Configuration["OpenAI:ApiKey"] ??
        builder.Configuration["OPENAI_API_KEY"];

    if (!string.IsNullOrWhiteSpace(openAiKey))
    {
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", openAiKey);
    }
});

// AWS S3
var awsAccessKey = builder.Configuration["AWS_ACCESS_KEY_ID"];
var awsSecretKey = builder.Configuration["AWS_SECRET_ACCESS_KEY"];
var awsRegion = builder.Configuration["AWS_REGION"] ?? "us-east-1";

builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var region = RegionEndpoint.GetBySystemName(awsRegion);

    if (!string.IsNullOrWhiteSpace(awsAccessKey) && !string.IsNullOrWhiteSpace(awsSecretKey))
    {
        var credentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
        return new AmazonS3Client(credentials, region);
    }

    // Fall back to the default AWS credential chain so Elastic Beanstalk/EC2
    // instance profiles work without explicit environment variables.
    return new AmazonS3Client(region);
});

// CORS
var allowedOrigins = new[]
{
    "http://localhost:5173",
    "http://localhost:3000",
    "https://api.tripowersllc.com",
    "https://www.tripowersllc.com",
    "https://tripowersllc.com",
    "https://tri-powers-llc.vercel.app"
};

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// MVC / Swagger
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

var app = builder.Build();

// Middleware
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
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Health check
app.MapGet("/api/health", () =>
    Results.Ok(new { ok = true, time = DateTimeOffset.UtcNow }))
   .AllowAnonymous();

// Optional DB check
app.MapGet("/api/dbcheck", async (IConfiguration config) =>
{
    var cs = config.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(cs))
    {
        return Results.Problem("Missing database connection string.");
    }

    try
    {
        await using var con = new NpgsqlConnection(cs);
        await con.OpenAsync();
        return Results.Ok(new { ok = true, serverVersion = con.ServerVersion });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
}).AllowAnonymous();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

public partial class Program { }
