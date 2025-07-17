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
        public string Location { get; set; } = null!;
        public string EmploymentType { get; set; } = null!;
        public string VendorName { get; set; } = null!;
        public int SalaryRangeMin { get; set; }
        public int SalaryRangeMax { get; set; }
        public string? Benefits { get; set; }
    }
}
