using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace TriPowersLLC.Models
{
    public class Applicants
    {
        [Key]
        public int id { get; set; }
        public required string firstName { get; set; }
        public required string lastName { get; set; }
        public required string email { get; set; }
        public required string password { get; set; }
        public required string phone { get; set; }
        public required string streetAddress { get; set; }
        public required string city { get; set; }
        public required string state { get; set; }
        public required string country { get; set; }
        [Column(TypeName = "nvarchar(10)")]
        public required string zipCode { get; set; }
        public required string ResumeText { get; set; } = null!;
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public int JobId { get; set; }
        public Job Job { get; set; } = null!;

        // JobsApi application fields
        public string ResumeUrl { get; set; } = string.Empty;
        public string CoverLetter { get; set; } = string.Empty;
        public string LinkedInProfile { get; set; } = string.Empty;
        public string PortfolioUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
