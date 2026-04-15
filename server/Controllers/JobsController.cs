using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Auth;
using TriPowersLLC.Contracts;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/admin/jobs")]
    [Authorize(Policy = AuthPolicies.Admin)]
    public class JobsController : ControllerBase
    {
        private readonly JobDBContext _db;

        private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
        {
            "draft",
            "active",
            "closed"
        };

        private static string NormalizeStatus(string? status)
        {
            return string.IsNullOrWhiteSpace(status)
                ? "active"
                : status.Trim().ToLowerInvariant();
        }

        public JobsController(JobDBContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var jobs = await _db.Jobs
                .OrderByDescending(j => j.UpdatedAt)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    j.Description,
                    j.Requirements,
                    j.Responsibilities,
                    j.Location,
                    j.EmploymentType,
                    j.VendorName,
                    j.SalaryRangeMin,
                    j.SalaryRangeMax,
                    j.Benefits,
                    j.PostedAt,
                    j.CreatedAt,
                    j.UpdatedAt,
                    j.Status,
                    j.Views,
                    applicantsCount = _db.Applicants.Count(a => a.JobId == j.Id)
                })
                .ToListAsync();

            return Ok(jobs);
        }

        [HttpPost]
        public async Task<ActionResult<JobResponse>> Create([FromBody] JobCreateRequest request)
        {
            if (request.SalaryRangeMin > request.SalaryRangeMax)
            {
                return BadRequest(new { error = "SalaryRangeMin cannot exceed SalaryRangeMax." });
            }

            var status = NormalizeStatus(request.Status);

            if (!AllowedStatuses.Contains(status))
            {
                return BadRequest(new { error = "Invalid job status. Allowed values: draft, active, closed." });
            }

            var job = new Job
            {
                Title = request.Title,
                Description = request.Description,
                Requirements = request.Requirements,
                Responsibilities = request.Responsibilities,
                Location = request.Location,
                EmploymentType = request.EmploymentType,
                VendorName = request.VendorName,
                SalaryRangeMin = request.SalaryRangeMin,
                SalaryRangeMax = request.SalaryRangeMax,
                Benefits = request.Benefits,
                PostedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = status,
                IsActive = status == "active",
                Views = 0,
                ApplicantsCount = 0
            };

            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();

            var response = JobResponse.FromEntity(job);
            return CreatedAtRoute(PublicJobsController.GetJobRouteName, new { id = job.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] JobUpdateRequest request)
        {
            if (request.SalaryRangeMin > request.SalaryRangeMax)
            {
                return BadRequest(new { error = "SalaryRangeMin cannot exceed SalaryRangeMax." });
            }

            var job = await _db.Jobs.FirstOrDefaultAsync(j => j.Id == id);
            if (job is null)
            {
                return NotFound();
            }

            var status = NormalizeStatus(request.Status);

            if (!AllowedStatuses.Contains(status))
            {
                return BadRequest(new { error = "Invalid job status. Allowed values: draft, active, closed." });
            }

            job.Title = request.Title;
            job.Description = request.Description;
            job.Requirements = request.Requirements;
            job.Responsibilities = request.Responsibilities;
            job.Location = request.Location;
            job.EmploymentType = request.EmploymentType;
            job.VendorName = request.VendorName;
            job.SalaryRangeMin = request.SalaryRangeMin;
            job.SalaryRangeMax = request.SalaryRangeMax;
            job.Benefits = request.Benefits;
            job.Status = status;
            job.IsActive = status == "active";
            job.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job is null)
            {
                return NotFound();
            }

            _db.Jobs.Remove(job);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
