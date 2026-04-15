using System.Security.Claims;

namespace TriPowersLLC.Auth;

public static class AuthPolicies
{
    public const string Applicant = "Applicant";
    public const string Admin = "Admin";
    public const string ApplicantOrAdmin = "ApplicantOrAdmin";

    public static bool HasRole(ClaimsPrincipal user, params string[] allowedRoles)
    {
        if (user?.Identity?.IsAuthenticated != true)
        {
            return false;
        }

        var roles = user.FindAll(ClaimTypes.Role)
            .Select(claim => claim.Value)
            .Concat(user.FindAll("role").Select(claim => claim.Value))
            .Where(value => !string.IsNullOrWhiteSpace(value));

        return roles.Any(role =>
            allowedRoles.Any(allowed =>
                string.Equals(role.Trim(), allowed, StringComparison.OrdinalIgnoreCase)));
    }

    public static int? GetUserId(ClaimsPrincipal user)
    {
        var claimValue =
            user.FindFirstValue(ClaimTypes.NameIdentifier) ??
            user.FindFirstValue("nameid") ??
            user.FindFirstValue("sub");

        return int.TryParse(claimValue, out var parsed) ? parsed : null;
    }

    public static string NormalizeRole(string? role, string fallback = "applicant")
    {
        return string.IsNullOrWhiteSpace(role)
            ? fallback
            : role.Trim().ToLowerInvariant();
    }
}
