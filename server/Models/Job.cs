// server/Models/Job.cs
namespace TriPowersLLC.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Requirements { get; set; } = null!;
        public string Responsibilities { get; set; } = null!;
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;

        // JobsApi fields (merged)
        public string Company { get; set; } = string.Empty;
        public string Location { get; set; } = null!;
        public string Url { get; set; } = string.Empty;
        public string SalaryRange { get; set; } = string.Empty; // free-form range like "50k-70k"
        public string EmploymentType { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        public DateTime? ClosingDate { get; set; }
        public int Views { get; set; }
        public int ApplicantsCount { get; set; }

        // Existing fields
        public string VendorName { get; set; } = null!;
        public int SalaryRangeMin { get; set; }
        public int SalaryRangeMax { get; set; }
        public string? Benefits { get; set; }

        // Tracking
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
