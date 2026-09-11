using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TriPowersLLC.Auth;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers;

[ApiController]
[Route("api/auth")]
public class ExternalAuthController : ControllerBase
{
    public const string ExternalCookieScheme = "ExternalCookie";
    internal const string GoogleProvider = "google";

    private readonly JobDBContext _db;
    private readonly IConfiguration _configuration;
    private readonly IAuthenticationSchemeProvider _schemeProvider;
    private readonly ILogger<ExternalAuthController> _logger;

    public ExternalAuthController(
        JobDBContext db,
        IConfiguration configuration,
        IAuthenticationSchemeProvider schemeProvider,
        ILogger<ExternalAuthController> logger)
    {
        _db = db;
        _configuration = configuration;
        _schemeProvider = schemeProvider;
        _logger = logger;
    }

    [AllowAnonymous]
    [HttpGet("google")]
    public async Task<IActionResult> Google()
    {
        if (await _schemeProvider.GetSchemeAsync(GoogleDefaults.AuthenticationScheme) is null)
        {
            return Problem(
                title: "Google authentication is unavailable",
                detail: "The Google client ID or client secret is not configured on the API.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var callbackUrl = Url.ActionLink(nameof(GoogleCallback), values: null)
            ?? throw new InvalidOperationException("Unable to generate the Google callback URL.");
        var properties = new AuthenticationProperties { RedirectUri = callbackUrl };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [AllowAnonymous]
    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var authentication = await HttpContext.AuthenticateAsync(ExternalCookieScheme);
        if (!authentication.Succeeded || authentication.Principal is null)
        {
            _logger.LogWarning("Google authentication callback did not contain a valid external identity.");
            return RedirectToFrontendError("Google authentication failed. Please try again.");
        }

        var email = authentication.Principal.FindFirstValue(ClaimTypes.Email)?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email))
        {
            await HttpContext.SignOutAsync(ExternalCookieScheme);
            return RedirectToFrontendError("Google did not provide an email address.");
        }

        var subject = authentication.Principal.FindFirstValue(ClaimTypes.NameIdentifier)?.Trim();
        if (string.IsNullOrWhiteSpace(subject))
        {
            await HttpContext.SignOutAsync(ExternalCookieScheme);
            return RedirectToFrontendError("Google did not provide a stable account identifier.");
        }

        var user = await FindOrCreateGoogleUserAsync(subject, email);
        var token = GenerateJwtToken(user);
        await HttpContext.SignOutAsync(ExternalCookieScheme);

        var fragment = string.Join('&', new[]
        {
            $"token={Uri.EscapeDataString(token)}",
            $"id={user.Id}",
            $"username={Uri.EscapeDataString(user.Username)}",
            $"role={Uri.EscapeDataString(AuthPolicies.NormalizeRole(user.Role))}"
        });
        return Redirect($"{GetFrontendBaseUrl()}/auth/callback#{fragment}");
    }

    internal async Task<User> FindOrCreateGoogleUserAsync(string subject, string email)
    {
        var user = await _db.Users.SingleOrDefaultAsync(candidate =>
            candidate.ExternalProvider == GoogleProvider && candidate.ExternalSubject == subject);
        if (user is not null)
        {
            return user;
        }

        // An email-shaped local username is not evidence that Google owns that
        // account. Keep the identities separate when the preferred name is taken.
        var username = email;
        if (await _db.Users.AnyAsync(candidate => candidate.Username.ToLower() == email))
        {
            username = await CreateAvailableGoogleUsernameAsync(email, subject);
        }

        using var hmac = new HMACSHA512();
        user = new User
        {
            Username = username,
            Role = "applicant",
            PasswordHash = hmac.ComputeHash(RandomNumberGenerator.GetBytes(64)),
            PasswordSalt = hmac.Key,
            ExternalProvider = GoogleProvider,
            ExternalSubject = subject
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    private async Task<string> CreateAvailableGoogleUsernameAsync(string email, string subject)
    {
        var at = email.LastIndexOf('@');
        var localPart = at > 0 ? email[..at] : email;
        var domainPart = at > 0 ? email[at..] : string.Empty;
        var subjectTag = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(subject)))[..12]
            .ToLowerInvariant();
        var candidate = $"{localPart}+google-{subjectTag}{domainPart}";
        var discriminator = 1;

        while (await _db.Users.AnyAsync(user => user.Username.ToLower() == candidate.ToLower()))
        {
            candidate = $"{localPart}+google-{subjectTag}-{discriminator++}{domainPart}";
        }

        return candidate;
    }

    private IActionResult RedirectToFrontendError(string message) =>
        Redirect($"{GetFrontendBaseUrl()}/auth/callback#error={Uri.EscapeDataString(message)}");

    private string GetFrontendBaseUrl()
    {
        var configured = _configuration["Frontend:BaseUrl"] ?? _configuration["FRONTEND_BASE_URL"];
        return (string.IsNullOrWhiteSpace(configured) ? "https://www.tripowersllc.com" : configured).TrimEnd('/');
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? _configuration["Jwt__Key"]
            ?? throw new InvalidOperationException("JWT signing key is not configured.");
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, AuthPolicies.NormalizeRole(user.Role))
        };
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(12),
            signingCredentials: credentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
