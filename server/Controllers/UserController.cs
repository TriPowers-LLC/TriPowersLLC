using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using TriPowersLLC.Auth;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly JobDBContext _db;
        private readonly string _jwtKey;

        public UsersController(JobDBContext db, IConfiguration config)
        {
            _db = db;
           var configuredKey = config["Jwt:Key"] ?? config["Jwt__Key"];

            if (string.IsNullOrWhiteSpace(configuredKey))
            {
                throw new InvalidOperationException("JWT signing key is not configured. Set 'Jwt:Key' to a value that is at least 16 bytes long.");
            }

            if (Encoding.UTF8.GetByteCount(configuredKey) < 16)
            {
                throw new InvalidOperationException("JWT signing key must be at least 16 bytes when encoded as UTF-8 to satisfy HMAC-SHA256 requirements.");
            }

            _jwtKey = configuredKey;
        }

        // POST /api/users/login
        [AllowAnonymous] // Allow unauthenticated access for login
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto dto)
        {
            // 1. Find user
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            Console.WriteLine($"User found: {user.Username}, role: {user.Role}");
            Console.WriteLine($"Stored hash length: {user.PasswordHash?.Length}");
            Console.WriteLine($"Stored salt length: {user.PasswordSalt?.Length}");

            // 2. Verify password
                using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            if (!computedHash.SequenceEqual(user.PasswordHash))
               {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            // 3. Generate JWT
            var token = GenerateJwtToken(user);

            

            // 4. Return token (and optionally user info)
            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    Role = AuthPolicies.NormalizeRole(user.Role)
                }
            });
        }

        // POST /api/users/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
                return Conflict(new { message = "Username already taken." });

            using var hmac = new HMACSHA512();

            var user = new User
            {
                Username = dto.Username,
                Role = "applicant",
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
                PasswordSalt = hmac.Key
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    Role = AuthPolicies.NormalizeRole(user.Role)
                }
            });
        }

        // ----- HELPER -----
       private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, AuthPolicies.NormalizeRole(user.Role))
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(12),
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
    
    public class LoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

}
