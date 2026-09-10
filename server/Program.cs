using Amazon;
using Amazon.S3;
using Amazon.Runtime;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using System.Security.Claims;
using System.Threading.RateLimiting;
using TriPowersLLC.Auth;
using TriPowersLLC.Controllers;
using TriPowersLLC.Models;
using TriPowersLLC.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Configuration.AddEnvironmentVariables();

// JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? builder.Configuration["Jwt__Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("Missing Jwt:Key in configuration.");
}
if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException("Jwt:Key must be at least 32 bytes when encoded as UTF-8.");
}

var authentication = builder.Services
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
    })
    .AddCookie(ExternalAuthController.ExternalCookieScheme, options =>
    {
        options.Cookie.Name = "tripowers.external";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
    });

var googleClientId = builder.Configuration["Authentication:Google:ClientId"]
    ?? builder.Configuration["Google:ClientId"]
    ?? builder.Configuration["GOOGLE_CLIENT_ID"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]
    ?? builder.Configuration["Google:ClientSecret"]
    ?? builder.Configuration["GOOGLE_CLIENT_SECRET"];

if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
{
    authentication.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
    {
        options.ClientId = googleClientId;
        options.ClientSecret = googleClientSecret;
        options.SignInScheme = ExternalAuthController.ExternalCookieScheme;
        options.CallbackPath = "/signin-google";
        options.Scope.Add("email");
        options.Scope.Add("profile");
    });
}

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
builder.Services.AddScoped<ITransactionalEmailSender, ResendEmailSender>();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("password-reset", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(15),
                QueueLimit = 0,
                AutoReplenishment = true
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

// Middleware
app.UseForwardedHeaders();
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
app.UseRateLimiter();
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
