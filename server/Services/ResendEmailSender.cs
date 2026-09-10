using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace TriPowersLLC.Services;

public sealed class ResendEmailSender : ITransactionalEmailSender
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ResendEmailSender> _logger;

    public ResendEmailSender(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<ResendEmailSender> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendPasswordResetAsync(
        string recipient,
        string resetUrl,
        DateTimeOffset expiresAt,
        CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Resend:ApiKey"] ?? _configuration["RESEND_API_KEY"];
        var from = _configuration["Resend:From"] ?? _configuration["RESEND_FROM"];

        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(from))
        {
            _logger.LogError("Password reset email is not configured. RESEND_API_KEY and RESEND_FROM are required.");
            return false;
        }

        var safeUrl = WebUtility.HtmlEncode(resetUrl);
        var expiryText = expiresAt.ToUniversalTime().ToString("u");
        var payload = new
        {
            from,
            to = new[] { recipient },
            subject = "Reset your TriPowers LLC password",
            text = $"Use this link to reset your TriPowers LLC password: {resetUrl}\n\nThis link expires at {expiryText} UTC. If you did not request this, you can ignore this email.",
            html = $"""
                <h2>Reset your TriPowers LLC password</h2>
                <p>We received a request to reset your password.</p>
                <p><a href="{safeUrl}">Reset password</a></p>
                <p>This link expires at {WebUtility.HtmlEncode(expiryText)} UTC.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                """
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        request.Headers.TryAddWithoutValidation("Idempotency-Key", $"password-reset/{Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes(resetUrl)))}");
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        try
        {
            using var response = await _httpClientFactory.CreateClient().SendAsync(request, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError(
                "Resend password reset email failed with status {StatusCode}: {ResponseBody}",
                (int)response.StatusCode,
                responseBody);
            return false;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Resend password reset request failed.");
            return false;
        }
    }
}
