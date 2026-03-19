using System.Net.Http;
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

        // Proxy to Azure Function to avoid CORS and 405 on the site host
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Send([FromBody] ContactDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.name) || string.IsNullOrWhiteSpace(dto.email) || string.IsNullOrWhiteSpace(dto.message))
                return BadRequest("Missing fields");

            var functionsBase = _config["Functions:BaseUrl"]
                               ?? Environment.GetEnvironmentVariable("FUNCTIONS_BASE_URL")
                               ?? "https://api.tripowersllc.com/api";

            if (!functionsBase.EndsWith("/")) functionsBase += "/";
            var endpoint = new Uri(new Uri(functionsBase), "send-email");

            var client = _http.CreateClient();
            var payload = JsonSerializer.Serialize(dto);
            var content = new StringContent(payload, Encoding.UTF8, "application/json");

            try
            {
                using var resp = await client.PostAsync(endpoint, content);
                var text = await resp.Content.ReadAsStringAsync();
                if (resp.IsSuccessStatusCode)
                {
                    // Mirror success from the function (202 or 200)
                    return StatusCode((int)resp.StatusCode, string.IsNullOrWhiteSpace(text) ? "Email sent" : text);
                }
                return StatusCode((int)resp.StatusCode, string.IsNullOrWhiteSpace(text) ? "Failed to send email" : text);
            }
            catch (Exception ex)
            {
                return Problem(title: "Proxy to email function failed", detail: ex.Message);
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

