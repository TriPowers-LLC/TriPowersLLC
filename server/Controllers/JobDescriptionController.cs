using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TriPowersLLC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobDescriptionController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public JobDescriptionController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> Generate([FromBody] JobPrompt request)
        {
            var apiKey = "YOUR_OPENAI_API_KEY"; // Secure this with environment variables

            var prompt = $"Write a detailed and professional job description for the following: {request.Prompt}";

            var requestBody = new
            {
                model = "gpt-4",
                messages = new[]
                {
                new { role = "system", content = "You are a helpful assistant that writes job descriptions." },
                new { role = "user", content = prompt }
                }
            };

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(httpRequest);
            var result = await response.Content.ReadAsStringAsync();

            return Ok(result);
        }
    }

    public class JobPrompt
    {
        public string Prompt { get; set; }
    }
}
