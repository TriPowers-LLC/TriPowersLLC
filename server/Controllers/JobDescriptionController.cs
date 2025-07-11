using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;            // ← for IConfiguration

namespace TriPowersLLC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobDescriptionController : ControllerBase
    {
        private readonly HttpClient _openAiClient;
        private readonly IConfiguration _configuration;

        // Inject IHttpClientFactory and IConfiguration
        public JobDescriptionController(IHttpClientFactory factory, IConfiguration configuration)
        {
            _openAiClient = factory.CreateClient("OpenAI");
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Generate([FromBody] JobPrompt request)
        {
            // If you want to override headers here, you could still do:
            // var apiKey = _configuration["OpenAI:ApiKey"];

            var prompt = $"Write a detailed and professional job description for the following: {request.Prompt}";

            var requestBody = new
            {
                model = "gpt-4",
                messages = new[]
                {
                    new { role = "system", content = "You are a helpful assistant that writes job descriptions." },
                    new { role = "user",   content = prompt }
                }
            };

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "v1/chat/completions")
            {
                Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
            };

            var response = await _openAiClient.SendAsync(httpRequest);
            response.EnsureSuccessStatusCode();

            // If you want only the text, parse it here; otherwise just return raw JSON
            var json = await response.Content.ReadAsStringAsync();
            return Ok(json);
        }
    }

    public class JobPrompt
    {
        public string? Prompt { get; set; }
    }
}
