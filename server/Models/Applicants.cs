using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace TriPowersLLC.Models
{
    public class Applicants
    {
        [Key]
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Password { get; set; }
        public required string Phone { get; set; }
        public string? StreetAddress { get; set; }
        public required  string City { get; set; }
        public required string State { get; set; }
        public string? Country { get; set; }
        [Column(TypeName = "varchar(10)")]
        public string? ZipCode { get; set; }
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public int JobId { get; set; }
        public Job Job { get; set; } = null!;
        public int? UserId { get; set; }
        public User? User { get; set; }


        // JobsApi application fields
        public string ResumeUrl { get; set; } = string.Empty;
        public string CoverLetter { get; set; } = string.Empty;
        public string LinkedInProfile { get; set; } = string.Empty;
        public string PortfolioUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
