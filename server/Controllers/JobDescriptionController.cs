// server/Controllers/JobDescriptionController.cs
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;            // ← for IConfiguration
using TriPowersLLC.Models; // ← for JobDescriptionRequest

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/jobdescription")]
    public class JobDescriptionController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<JobDescriptionController> _logger;

        public JobDescriptionController(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<JobDescriptionController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Generate([FromBody] JobDescriptionRequest input)
        {
            if (string.IsNullOrWhiteSpace(input?.Prompt))
                return BadRequest(new { error = "Prompt is required." });

            // If OpenAI key is present, call the API; otherwise return a fallback.
            var apiKey = _configuration["OpenAI:ApiKey"] ?? System.Environment.GetEnvironmentVariable("OPENAI_API_KEY");

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                var fallback = $"Job Description for: {input.Prompt}\n\n" +
                               $"Summary:\n- …\n\nResponsibilities:\n- …\n\nRequirements:\n- …\n\nPreferred Qualifications:\n- …";
                return Ok(new { choices = new[] { new { message = new { content = fallback } } } });
            }

            var client = _httpClientFactory.CreateClient("openai"); // registered in Program.cs below

            var payload = new
            {
                model = "gpt-4o-mini",
                messages = new object[]
                {
                    new { role = "system", content = "You are an HR assistant that writes clear, concise job descriptions. Respond in polished plain text." },
                    new { role = "user",   content = input.Prompt }
                }
            };

            using var req = new HttpRequestMessage(HttpMethod.Post, "/v1/chat/completions")
            {
                Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
            };

            // If the named client isn't preconfigured with the header, set it here as a safety net:
            if (!client.DefaultRequestHeaders.Contains("Authorization"))
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var resp = await client.SendAsync(req);
            var body = await resp.Content.ReadAsStringAsync();

            if (!resp.IsSuccessStatusCode)
            {
                _logger.LogError("OpenAI error {Status}: {Body}", resp.StatusCode, body);
                var fallback = $"Job Description for: {input.Prompt}\n\n" +
                               $"Summary:\n- …\n\nResponsibilities:\n- …\n\nRequirements:\n- …\n\nPreferred Qualifications:\n- …";
                return Ok(new { choices = new[] { new { message = new { content = fallback } } } });
            }

            // Minimal extraction of choices[0].message.content
            using var doc = JsonDocument.Parse(body);
            var content = doc.RootElement
                             .GetProperty("choices")[0]
                             .GetProperty("message")
                             .GetProperty("content")
                             .GetString();

            if (string.IsNullOrWhiteSpace(content))
                content = "No description generated.";

            return Ok(new { choices = new[] { new { message = new { content } } } });
        }
    }
}