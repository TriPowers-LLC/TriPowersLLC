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

        public EmailController(IHttpClientFactory http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        // Send contact form email via Resend directly from the API host (AWS)
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Send([FromBody] ContactDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.name) || string.IsNullOrWhiteSpace(dto.email) || string.IsNullOrWhiteSpace(dto.message))
                return BadRequest("Missing fields");

            var resendApiKey = _config["Resend:ApiKey"]
                               ?? Environment.GetEnvironmentVariable("RESEND_API_KEY");
            var resendTo = _config["Resend:To"]
                           ?? Environment.GetEnvironmentVariable("RESEND_TO")
                           ?? "kimberlyjenkins@tripowersllc.com";
            var resendFrom = _config["Resend:From"]
                             ?? Environment.GetEnvironmentVariable("RESEND_FROM")
                             ?? "onboarding@resend.dev";

            if (string.IsNullOrWhiteSpace(resendApiKey))
                return Problem(title: "Email service is not configured", detail: "Missing RESEND_API_KEY.", statusCode: 500);

            var subject = $"Contact form: {dto.name}";
            var safeName = WebUtility.HtmlEncode(dto.name);
            var safeEmail = WebUtility.HtmlEncode(dto.email);
            var safePhone = WebUtility.HtmlEncode(string.IsNullOrWhiteSpace(dto.phone) ? "N/A" : dto.phone);
            var safeMessage = WebUtility.HtmlEncode(dto.message).Replace("\n", "<br />");

            var text = $"Name: {dto.name}\nEmail: {dto.email}\nPhone: {dto.phone ?? "N/A"}\n\nMessage:\n{dto.message}";
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
                reply_to = dto.email,
                subject,
                text,
                html
            };

            var client = _http.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", resendApiKey);

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            try
            {
                using var resp = await client.PostAsync("https://api.resend.com/emails", content);
                var responseText = await resp.Content.ReadAsStringAsync();

                if (resp.IsSuccessStatusCode)
                {
                    return StatusCode(202, "Email sent");
                }

                return StatusCode((int)resp.StatusCode, string.IsNullOrWhiteSpace(responseText) ? "Failed to send email" : responseText);
            }
            catch (Exception ex)
            {
                return Problem(title: "Resend request failed", detail: ex.Message);
            }
        }
    }

    public class ContactDto
    {
        public string name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string? phone { get; set; }
        public string message { get; set; } = string.Empty;
    }
}
