using System.ComponentModel.DataAnnotations;

namespace TriPowersLLC.Contracts
{
    public class JobCreateRequest
    {
        [Required]
        public string Title { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public string Requirements { get; set; } = null!;

        [Required]
        public string Responsibilities { get; set; } = null!;

        [Required]
        public string Location { get; set; } = null!;

        [Required]
        public string EmploymentType { get; set; } = null!;

        [Required]
        public string VendorName { get; set; } = null!;

        [Range(0, int.MaxValue)]
        public int SalaryRangeMin { get; set; }

        [Range(0, int.MaxValue)]
        public int SalaryRangeMax { get; set; }

        public string? Benefits { get; set; }
    }
}
