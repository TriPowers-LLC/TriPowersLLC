// server/Controllers/MessageController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { text = "Hello from the API!" });
}
