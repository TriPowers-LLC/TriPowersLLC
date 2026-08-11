using System;
using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ValidTokenResetsPasswordAndCanOnlyBeUsedOnce()
    {
        var username = await CreateUser();
        var client = _factory.CreateClient();
        var request = await client.PostAsJsonAsync("/api/users/password-reset/request", new { username });
        var body = await request.Content.ReadFromJsonAsync<ResetResponse>();
        Assert.False(string.IsNullOrWhiteSpace(body?.ResetToken));

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
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
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
}
