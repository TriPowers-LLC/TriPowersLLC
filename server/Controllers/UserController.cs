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
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.RateLimiting;
using System.ComponentModel.DataAnnotations;
using TriPowersLLC.Services;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly JobDBContext _db;
        private readonly string _jwtKey;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _configuration;
        private readonly ITransactionalEmailSender _emailSender;

        public UsersController(
            JobDBContext db,
            IConfiguration config,
            IWebHostEnvironment environment,
            ILogger<UsersController> logger,
            ITransactionalEmailSender emailSender)
        {
            _db = db;
            _environment = environment;
            _logger = logger;
            _configuration = config;
            _emailSender = emailSender;
           var configuredKey = config["Jwt:Key"] ?? config["Jwt__Key"];

            if (string.IsNullOrWhiteSpace(configuredKey))
            {
                throw new InvalidOperationException("JWT signing key is not configured. Set 'Jwt:Key' to a value that is at least 16 bytes long.");
            }

            if (Encoding.UTF8.GetByteCount(configuredKey) < 32)
            {
                throw new InvalidOperationException("JWT signing key must be at least 32 bytes when encoded as UTF-8 to satisfy HMAC-SHA256 requirements.");
            }

            _jwtKey = configuredKey;
        }

        [AllowAnonymous]
        [HttpPost("password-reset/request")]
        [EnableRateLimiting("password-reset")]
        public async Task<ActionResult> RequestPasswordReset(
            PasswordResetRequestDto dto,
            CancellationToken cancellationToken)
        {
            // Always return the same response so this endpoint cannot be used to
            // discover which email addresses have accounts.
            var responseMessage = "If the account exists, reset instructions have been sent.";
            var username = dto.Username?.Trim();
            if (string.IsNullOrWhiteSpace(username))
            {
                return Ok(new { message = responseMessage });
            }

            var normalizedUsername = username.ToLowerInvariant();
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username.ToLower() == normalizedUsername);
            if (user == null)
            {
                return Ok(new { message = responseMessage });
            }

            if (!new EmailAddressAttribute().IsValid(user.Username))
            {
                _logger.LogWarning("Password reset email was not sent because account {UserId} does not use an email username.", user.Id);
                return Ok(new { message = responseMessage });
            }

            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            user.PasswordResetTokenHash = SHA256.HashData(Encoding.UTF8.GetBytes(token));
            user.PasswordResetTokenExpiresAt = DateTimeOffset.UtcNow.AddMinutes(15);
            await _db.SaveChangesAsync(cancellationToken);

            var resetUrl = BuildPasswordResetUrl(user.Username, token);
            var sent = await _emailSender.SendPasswordResetAsync(
                user.Username,
                resetUrl,
                user.PasswordResetTokenExpiresAt.Value,
                cancellationToken);
            if (!sent)
            {
                _logger.LogError("Password reset email could not be delivered for user {UserId}.", user.Id);
            }

            return _environment.IsDevelopment()
                ? Ok(new { message = responseMessage, resetToken = token })
                : Ok(new { message = responseMessage });
        }

        private string BuildPasswordResetUrl(string username, string token)
        {
            var configured = _configuration["Frontend:BaseUrl"] ?? _configuration["FRONTEND_BASE_URL"];
            var frontendBaseUrl = (string.IsNullOrWhiteSpace(configured)
                ? "https://www.tripowersllc.com"
                : configured).TrimEnd('/');
            return $"{frontendBaseUrl}/reset-password#username={Uri.EscapeDataString(username)}&token={Uri.EscapeDataString(token)}";
        }

        [AllowAnonymous]
        [HttpPost("password-reset/confirm")]
        public async Task<ActionResult> ConfirmPasswordReset(PasswordResetConfirmDto dto)
        {
            var username = dto.Username?.Trim();
            if (string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(dto.Token) ||
                string.IsNullOrWhiteSpace(dto.NewPassword) ||
                dto.NewPassword.Length < 12)
            {
                return BadRequest(new { message = "A valid reset token and a password of at least 12 characters are required." });
            }

            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == username);
            var suppliedTokenHash = SHA256.HashData(Encoding.UTF8.GetBytes(dto.Token.Trim()));
            var tokenIsValid = user?.PasswordResetTokenHash is { Length: > 0 } storedHash &&
                user.PasswordResetTokenExpiresAt > DateTimeOffset.UtcNow &&
                CryptographicOperations.FixedTimeEquals(storedHash, suppliedTokenHash);

            if (!tokenIsValid || user == null)
            {
                return BadRequest(new { message = "The reset token is invalid or has expired." });
            }

            using var hmac = new HMACSHA512();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.NewPassword));
            user.PasswordSalt = hmac.Key;
            user.PasswordResetTokenHash = null;
            user.PasswordResetTokenExpiresAt = null;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Password reset successfully. You can now log in." });
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

            // 2. Verify password
            if (user.PasswordSalt is not { Length: > 0 } || user.PasswordHash is not { Length: > 0 })
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            if (!CryptographicOperations.FixedTimeEquals(computedHash, user.PasswordHash))
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
        [HttpDelete("me")]
        [Authorize]
        public async Task<ActionResult> DeleteMyAccount()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid authenticated user." });
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (AuthPolicies.NormalizeRole(user.Role) == "admin")
            {
                return BadRequest(new { message = "Admin accounts cannot be deleted through this endpoint." });
            }

            var applications = await _db.Applicants.Where(a => a.UserId == userId).ToListAsync();
            if (applications.Count > 0)
            {
                _db.Applicants.RemoveRange(applications);
            }

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Account and associated applicant data deleted." });
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

    public class PasswordResetRequestDto
    {
        public string Username { get; set; } = null!;
    }

    public class PasswordResetConfirmDto
    {
        public string Username { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

}
