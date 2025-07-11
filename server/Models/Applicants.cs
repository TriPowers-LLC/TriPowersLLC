using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace TriPowersLLC.Models
{
    public class Applicants
    {
        [Key]
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string phone { get; set; }
        public string streetAddress { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string country { get; set; }
        [Column(TypeName = "nvarchar(10)")]
        public string zipCode { get; set; }
        public string ResumeText { get; set; } = null!;
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public int JobId { get; set; }
        public Job Job { get; set; } = null!;

    }
}
