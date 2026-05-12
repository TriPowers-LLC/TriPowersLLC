using Microsoft.AspNetCore.Mvc;

namespace TriPowersLLC.Controllers;

[ApiController]
[Route("api/auth")]
public class ExternalAuthController : ControllerBase
{
    [HttpGet("google")]
    public IActionResult Google()
    {
        return StatusCode(StatusCodes.Status501NotImplemented, new
        {
            message = "Google OAuth is not configured yet. Set up OAuth credentials and callback handling on the server."
        });
    }

    [HttpGet("microsoft")]
    public IActionResult Microsoft()
    {
        return StatusCode(StatusCodes.Status501NotImplemented, new
        {
            message = "Microsoft OAuth is not configured yet. Set up OAuth credentials and callback handling on the server."
        });
    }
}
