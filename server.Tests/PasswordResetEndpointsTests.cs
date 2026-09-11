using System;
using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TriPowersLLC.Models;
using Xunit;

namespace TriPowersLLC.Tests;

public class PasswordResetEndpointsTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public PasswordResetEndpointsTests(CustomWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task PasswordCannotBeResetWithoutValidToken()
    {
        var username = await CreateUser();
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/users/password-reset/confirm", new
        {
            username,
            token = "not-a-valid-token",
            newPassword = "A-new-password-123!"
        });

        Assert.True(
            response.StatusCode == HttpStatusCode.BadRequest,
            $"Expected BadRequest, received {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
    }

    [Fact]
    public async Task ValidTokenResetsPasswordAndCanOnlyBeUsedOnce()
    {
        var username = await CreateUser();
        var client = _factory.CreateClient();
        var request = await client.PostAsJsonAsync("/api/users/password-reset/request", new { username });
        Assert.True(
            request.StatusCode == HttpStatusCode.OK,
            $"Expected OK, received {request.StatusCode}: {await request.Content.ReadAsStringAsync()}");
        var body = await request.Content.ReadFromJsonAsync<ResetResponse>();
        Assert.False(string.IsNullOrWhiteSpace(body?.ResetToken));
        Assert.Equal(username, _factory.EmailSender.Recipient);
        Assert.Contains("/reset-password#username=", _factory.EmailSender.ResetUrl);
        Assert.Contains("&token=", _factory.EmailSender.ResetUrl);

        var payload = new
        {
            username,
            token = body!.ResetToken,
            newPassword = "A-new-password-123!"
        };
        var reset = await client.PostAsJsonAsync("/api/users/password-reset/confirm", payload);
        var reuse = await client.PostAsJsonAsync("/api/users/password-reset/confirm", payload);

        Assert.Equal(HttpStatusCode.OK, reset.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, reuse.StatusCode);
        var login = await client.PostAsJsonAsync("/api/users/login", new
        {
            username,
            password = payload.newPassword
        });
        Assert.True(
            login.StatusCode == HttpStatusCode.OK,
            $"Expected OK, received {login.StatusCode}: {await login.Content.ReadAsStringAsync()}");
    }

    private async Task<string> CreateUser()
    {
        var username = $"reset-{Guid.NewGuid():N}@example.com";
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<JobDBContext>();
        using var hmac = new HMACSHA512();
        db.Users.Add(new User
        {
            Username = username,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Original-password-123!")),
            PasswordSalt = hmac.Key
        });
        await db.SaveChangesAsync();
        return username;
    }

    private sealed record ResetResponse(string Message, string? ResetToken);

    [Fact]
    public async Task GoogleLoginReturnsServiceUnavailableWhenCredentialsAreMissing()
    {
        var response = await _factory.CreateClient(new() { AllowAutoRedirect = false })
            .GetAsync("/api/auth/google");

        Assert.True(
            response.StatusCode == HttpStatusCode.ServiceUnavailable,
            $"Expected ServiceUnavailable, received {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
    }

    [Fact]
    public async Task UntrustedForwardedAddressCannotReplaceRateLimitAddress()
    {
        await using var factory = new CustomWebApplicationFactory();
        _ = factory.CreateClient();
        var originalAddress = IPAddress.Parse("198.51.100.10");
        IPAddress? rateLimitAddress = null;
        var middleware = new ForwardedHeadersMiddleware(
            context =>
            {
                rateLimitAddress = context.Connection.RemoteIpAddress;
                return Task.CompletedTask;
            },
            factory.Services.GetRequiredService<ILoggerFactory>(),
            factory.Services.GetRequiredService<IOptions<ForwardedHeadersOptions>>());
        var context = new DefaultHttpContext();
        context.Connection.RemoteIpAddress = originalAddress;
        context.Request.Headers["X-Forwarded-For"] = "203.0.113.42";

        await middleware.Invoke(context);

        Assert.Equal(originalAddress, rateLimitAddress);
        Assert.Equal("203.0.113.42", context.Request.Headers["X-Forwarded-For"]);
    }

}
