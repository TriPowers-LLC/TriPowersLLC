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
        public string? password { get; set; }
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
        public int? UserId { get; set; }
        public User? User { get; set; }


    }
}
