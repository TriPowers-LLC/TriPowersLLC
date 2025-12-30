using TriPowersLLC.Models;

namespace TriPowersLLC.Contracts
{
    public class JobResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Requirements { get; set; } = null!;
        public string Responsibilities { get; set; } = null!;
        public DateTime PostedAt { get; set; }
        public string Location { get; set; } = null!;
        public string EmploymentType { get; set; } = null!;
        public string VendorName { get; set; } = null!;
        public int SalaryRangeMin { get; set; }
        public int SalaryRangeMax { get; set; }
        public string? Benefits { get; set; }

        public static JobResponse FromEntity(Job job) => new()
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Requirements = job.Requirements,
            Responsibilities = job.Responsibilities,
            PostedAt = job.PostedAt,
            Location = job.Location,
            EmploymentType = job.EmploymentType,
            VendorName = job.VendorName,
            SalaryRangeMin = job.SalaryRangeMin,
            SalaryRangeMax = job.SalaryRangeMax,
            Benefits = job.Benefits
        };
    }
}
