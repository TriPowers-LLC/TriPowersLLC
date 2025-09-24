// server/Controllers/JobDescriptionController.cs
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
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
                return Ok(BuildFallbackPayload(input.Prompt));
            }

            var client = _httpClientFactory.CreateClient("openai"); // registered in Program.cs below

            var payload = new
            {
                model = "gpt-4o-mini",
                messages = new object[]
                {
                    new { role = "system", content = "You are an HR assistant that writes clear, concise job descriptions and always answers with valid JSON." },
                    new
                    {
                        role = "user",
                        content = "Generate a job description for the following request:\n\n",
                                   input.Prompt + "\n\n",
                                   "Respond with valid JSON only, matching this schema exactly:\n",
                                   "{\n",
                                   "  \"description\": string,                     // concise summary paragraph\n",
                                   "  \"responsibilities\": string[],              // bullet-ready statements\n",
                                   "  \"requirements\": string[],                  // bullet-ready statements\n",
                                   "  \"salaryMin\": number,                       // annual salary lower bound in USD\n",
                                   "  \"salaryMax\": number                        // annual salary upper bound in USD\n",
                                   "}\n\n",
                                   "Do not wrap the JSON in code fences or include any additional commentary.\n"
                    }
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

            using var doc = JsonDocument.Parse(body);
            var content = doc.RootElement
                             .GetProperty("choices")[0]
                             .GetProperty("message")
                             .GetProperty("content")
                             .GetString();

            if (string.IsNullOrWhiteSpace(content))
                {
                _logger.LogWarning("OpenAI returned an empty content block for prompt: {Prompt}", input.Prompt);
                return Ok(BuildFallbackPayload(input.Prompt));
            }

            var cleaned = SanitizeContent(content);

            JobDescriptionResult? parsed;
            try
            {
                parsed = JsonSerializer.Deserialize<JobDescriptionResult>(cleaned, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to parse AI response as JSON: {Content}", cleaned);
                return Ok(BuildFallbackPayload(input.Prompt));
            }

            if (parsed is null ||
                string.IsNullOrWhiteSpace(parsed.Description) ||
                parsed.Responsibilities is null ||
                parsed.Requirements is null)
            {
                _logger.LogWarning("AI response missing required fields: {Content}", cleaned);
                return Ok(BuildFallbackPayload(input.Prompt));
            }

            return Ok(new
            {
                description = parsed.Description,
                responsibilities = parsed.Responsibilities,
                requirements = parsed.Requirements,
                salaryMin = parsed.SalaryMin,
                salaryMax = parsed.SalaryMax
            });
        }
        private static object BuildFallbackPayload(string? prompt) => new
        {
            description = $"Job description for {prompt ?? "this role"}.",
            responsibilities = new[]
            {
                "Outline core responsibilities here.",
                "Collaborate with cross-functional teams.",
                "Deliver high-quality work on schedule."
            },
            requirements = new[]
            {
                "List required skills or experience.",
                "Detail education or certification expectations.",
                "Highlight any additional qualifications."
            },
            salaryMin = 0,
            salaryMax = 0
        };

        private static string SanitizeContent(string content)
        {
            var trimmed = content.Trim();
            if (trimmed.StartsWith("```"))
            {
                var lines = new List<string>(trimmed.Split('\n'));
                if (lines.Count >= 1)
                {
                    lines.RemoveAt(0); // remove opening fence
                }

                while (lines.Count > 0 && lines[^1].TrimStart().StartsWith("```"))
                {
                    lines.RemoveAt(lines.Count - 1);
                }

                return string.Join("\n", lines);
            }

            return trimmed;
        }

        private class JobDescriptionResult
        {
            public string? Description { get; set; }
            public List<string>? Responsibilities { get; set; }
            public List<string>? Requirements { get; set; }
            public decimal? SalaryMin { get; set; }
            public decimal? SalaryMax { get; set; }
           
        }
    }
}