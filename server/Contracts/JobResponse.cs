using TriPowersLLC.Models;

namespace TriPowersLLC.Contracts
{
    public class JobResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Requirements { get; set; }
        public string? Responsibilities { get; set; }
        public string? Location { get; set; }
        public string? EmploymentType { get; set; }
        public string? VendorName { get; set; }
        public decimal SalaryRangeMin { get; set; }
        public decimal SalaryRangeMax { get; set; }
        public string? Benefits { get; set; }
        public string Status { get; set; } = "active";
        public bool IsActive { get; set; }
        public int Views { get; set; }
        public int ApplicantsCount { get; set; }
        public DateTime PostedAt { get; set; }

        public static JobResponse FromEntity(Job job) => new()
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Requirements = job.Requirements,
            Responsibilities = job.Responsibilities,
            Location = job.Location,
            EmploymentType = job.EmploymentType,
            VendorName = job.VendorName,
            SalaryRangeMin = job.SalaryRangeMin,
            SalaryRangeMax = job.SalaryRangeMax,
            Benefits = job.Benefits,
            Status = job.Status,
            IsActive = job.IsActive,
            Views = job.Views,
            ApplicantsCount = job.ApplicantsCount,
            PostedAt = job.PostedAt
        };
    }
}
