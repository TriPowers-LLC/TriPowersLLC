// server/Models/User.cs
namespace TriPowersLLC.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public byte[] PasswordHash { get; set; } = null!;
        public byte[] PasswordSalt { get; set; } = null!;
        public byte[]? PasswordResetTokenHash { get; set; }
        public DateTimeOffset? PasswordResetTokenExpiresAt { get; set; }
        public string? ExternalProvider { get; set; }
        public string? ExternalSubject { get; set; }

        // "admin", "applicant"
        public string Role { get; set; } = "applicant";
    }
}

