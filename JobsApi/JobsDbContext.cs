// JobsDbContext.cs
using Microsoft.EntityFrameworkCore;

public class JobsDbContext : DbContext
{
    public JobsDbContext(DbContextOptions<JobsDbContext> options) : base(options) {}

    public DbSet<Job> Jobs { get; set; } = null!;
    public DbSet<JobApplication> JobApplications { get; set; } = null!;
}

public class Job
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Company { get; set; } = "";
    public string Location { get; set; } = "";
    public string Url { get; set; } = "";
    public string Description { get; set; } = "";
    public string SalaryRange { get; set; } = "";
    public string EmploymentType { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public DateTimeOffset? PostedDate { get; set; }
    public DateTimeOffset? ClosingDate { get; set; }
    public int Views { get; set; }
    public int Applicants { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class JobApplication
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string ResumeUrl { get; set; } = "";
    public string CoverLetter { get; set; } = "";
    public string LinkedInProfile { get; set; } = "";
    public string PortfolioUrl { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string ZipCode { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Message { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Job? Job { get; set; }
}
