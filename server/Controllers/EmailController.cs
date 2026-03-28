using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/send-email")]
    public class EmailController : ControllerBase
    {
        private readonly IHttpClientFactory _http;
        private readonly IConfiguration _config;
        private readonly ILogger<EmailController> _logger;

        public EmailController(
            IHttpClientFactory http,
            IConfiguration config,
            ILogger<EmailController> logger)
        {
            _http = http;
            _config = config;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Send([FromBody] ContactDto dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { success = false, message = "Missing fields" });
            }

            if (!new EmailAddressAttribute().IsValid(dto.Email))
            {
                return BadRequest(new { success = false, message = "Invalid email address" });
            }

            var resendApiKey = _config["Resend:ApiKey"]
                               ?? Environment.GetEnvironmentVariable("RESEND_API_KEY");

            var resendTo = _config["Resend:To"]
                           ?? Environment.GetEnvironmentVariable("RESEND_TO")
                           ?? "kimberlyjenkins@tripowersllc.com";

            var resendFrom = _config["Resend:From"]
                             ?? Environment.GetEnvironmentVariable("RESEND_FROM")
                             ?? "onboarding@resend.dev";

            if (string.IsNullOrWhiteSpace(resendApiKey))
            {
                return Problem(
                    title: "Email service is not configured",
                    detail: "Missing RESEND_API_KEY.",
                    statusCode: 500);
            }

            var subject = $"Contact form: {dto.Name}";
            var safeName = WebUtility.HtmlEncode(dto.Name);
            var safeEmail = WebUtility.HtmlEncode(dto.Email);
            var safePhone = WebUtility.HtmlEncode(string.IsNullOrWhiteSpace(dto.Phone) ? "N/A" : dto.Phone);
            var safeMessage = WebUtility.HtmlEncode(dto.Message).Replace("\n", "<br />");

            var text = $"Name: {dto.Name}\nEmail: {dto.Email}\nPhone: {dto.Phone ?? "N/A"}\n\nMessage:\n{dto.Message}";
            var html = $@"
<h2>New contact form message</h2>
<p><strong>Name:</strong> {safeName}</p>
<p><strong>Email:</strong> {safeEmail}</p>
<p><strong>Phone:</strong> {safePhone}</p>
<p><strong>Message:</strong></p>
<p>{safeMessage}</p>";

            var payload = new
            {
                from = resendFrom,
                to = new[] { resendTo },
                reply_to = dto.Email,
                subject,
                text,
                html
            };

            var client = _http.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", resendApiKey);

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            try
            {
                using var resp = await client.PostAsync("https://api.resend.com/emails", content);
                var responseText = await resp.Content.ReadAsStringAsync();

                if (resp.IsSuccessStatusCode)
                {
                    return StatusCode(202, new { success = true, message = "Email sent" });
                }

                _logger.LogError("Resend send failed. Status: {StatusCode}, Response: {Response}",
                    (int)resp.StatusCode, responseText);

                return StatusCode((int)resp.StatusCode, new
                {
                    success = false,
                    message = string.IsNullOrWhiteSpace(responseText) ? "Failed to send email" : responseText
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Resend request failed");
                return Problem(title: "Resend request failed", detail: ex.Message);
            }
        }
    }

    public class ContactDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}