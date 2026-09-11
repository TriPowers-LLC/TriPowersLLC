using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TriPowersLLC.Controllers;
using TriPowersLLC.Models;
using Xunit;

namespace TriPowersLLC.Tests;

public class ExternalAuthIdentityTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public ExternalAuthIdentityTests(CustomWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task GoogleIdentityDoesNotLinkToLocalAccountWithMatchingEmail()
    {
        var email = $"victim-{Guid.NewGuid():N}@example.com";
        const string subject = "google-subject-123";

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<JobDBContext>();
        using var hmac = new HMACSHA512();
        var localUser = new User
        {
            Username = email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Attacker-password-123!")),
            PasswordSalt = hmac.Key
        };
        db.Users.Add(localUser);
        await db.SaveChangesAsync();

        var controller = CreateController(scope.ServiceProvider, db);
        var googleUser = await controller.FindOrCreateGoogleUserAsync(subject, email);

        Assert.NotEqual(localUser.Id, googleUser.Id);
        Assert.False(string.Equals(email, googleUser.Username, StringComparison.OrdinalIgnoreCase));
        Assert.Null(localUser.ExternalProvider);
        Assert.Null(localUser.ExternalSubject);
        Assert.Equal(ExternalAuthController.GoogleProvider, googleUser.ExternalProvider);
        Assert.Equal(subject, googleUser.ExternalSubject);
    }

    [Fact]
    public async Task ReturningGoogleIdentityIsMatchedByProviderSubject()
    {
        var originalEmail = $"google-{Guid.NewGuid():N}@example.com";
        var changedEmail = $"changed-{Guid.NewGuid():N}@example.com";
        var subject = $"subject-{Guid.NewGuid():N}";

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<JobDBContext>();
        var controller = CreateController(scope.ServiceProvider, db);

        var firstLogin = await controller.FindOrCreateGoogleUserAsync(subject, originalEmail);
        var secondLogin = await controller.FindOrCreateGoogleUserAsync(subject, changedEmail);

        Assert.Equal(firstLogin.Id, secondLogin.Id);
        Assert.Equal(originalEmail, secondLogin.Username);
        Assert.Equal(1, await db.Users.CountAsync(user =>
            user.ExternalProvider == ExternalAuthController.GoogleProvider &&
            user.ExternalSubject == subject));
    }

    private static ExternalAuthController CreateController(IServiceProvider services, JobDBContext db) =>
        new(
            db,
            services.GetRequiredService<IConfiguration>(),
            services.GetRequiredService<IAuthenticationSchemeProvider>(),
            services.GetRequiredService<ILogger<ExternalAuthController>>());
}
