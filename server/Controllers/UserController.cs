using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly JobDBContext _db;
        private readonly IConfiguration _config;

        public UsersController(JobDBContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // POST /api/users/register
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto dto)
        {
            // 1. Check for existing username
            if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
                return Conflict(new { message = "Username already taken." });

            // 2. Hash password
            using var hmac = new HMACSHA512();
            var user = new User
            {
                Username     = dto.Username,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(dto.Password)),
                PasswordSalt = hmac.Key
            };

            // 3. Save user
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // 4. Generate JWT
            var token = GenerateJwtToken(user.Id);

            // 5. Return token (and optionally user info)
            return Ok(new { token, user = new { user.Id, user.Username } });
        }

        // ----- HELPER -----
        private string GenerateJwtToken(int userId)
        {
            var key      = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds    = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims   = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
            var token    = new JwtSecurityToken(
                issuer:     null,
                audience:   null,
                claims:     claims,
                expires:    DateTime.UtcNow.AddHours(12),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
