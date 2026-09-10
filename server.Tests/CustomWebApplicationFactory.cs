using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using TriPowersLLC.Models;
using TriPowersLLC.Services;

namespace TriPowersLLC.Tests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private const string SigningKey = "TestSigningKey-AtLeast-32-Bytes-Long-For-HS256";
    private readonly string _databaseName = $"TestDb-{Guid.NewGuid()}";
    public RecordingEmailSender EmailSender { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureLogging(logging => logging.ClearProviders());
        builder.ConfigureAppConfiguration((_, config) =>
        {
            var overrides = new Dictionary<string, string?>
            {
                ["Jwt:Key"] = SigningKey,
                ["ConnectionStrings:DefaultConnection"] = "Data Source=:memory:"
            };
            config.AddInMemoryCollection(overrides);
        });

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<JobDBContext>));
            services.RemoveAll(typeof(IDbContextOptionsConfiguration<JobDBContext>));
            services.RemoveAll(typeof(DbContextOptions));
            services.RemoveAll(typeof(IDatabaseProvider));
            services.RemoveAll(typeof(JobDBContext));
            services.AddDbContext<JobDBContext>(options =>
                options.UseInMemoryDatabase(_databaseName));
            services.RemoveAll(typeof(ITransactionalEmailSender));
            services.AddSingleton<ITransactionalEmailSender>(EmailSender);

            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey))
                };
            });

            using var scope = services.BuildServiceProvider().CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<JobDBContext>();
            db.Database.EnsureCreated();
        });
    }

    public HttpClient CreateAdminClient() => CreateAuthenticatedClient("Admin");

    public HttpClient CreateUserClient() => CreateAuthenticatedClient("User");

    private HttpClient CreateAuthenticatedClient(string role)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerateToken(role));
        return client;
    }

    private static string GenerateToken(string role)
    {
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "123"),
                new Claim(ClaimTypes.Name, $"{role}User"),
                new Claim(ClaimTypes.Role, role)
            },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public sealed class RecordingEmailSender : ITransactionalEmailSender
{
    public string? Recipient { get; private set; }
    public string? ResetUrl { get; private set; }

    public Task<bool> SendPasswordResetAsync(
        string recipient,
        string resetUrl,
        DateTimeOffset expiresAt,
        CancellationToken cancellationToken = default)
    {
        Recipient = recipient;
        ResetUrl = resetUrl;
        return Task.FromResult(true);
    }
}
