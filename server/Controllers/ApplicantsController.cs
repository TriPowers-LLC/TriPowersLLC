using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/applicants")]
    public class ApplicantsController : ControllerBase
    {
        private readonly JobDBContext _db;

        public ApplicantsController(JobDBContext db)
        {
            _db = db;
        }

        private int? GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userId, out var parsed) ? parsed : null;
        }

        // =========================
        // APPLICANT: Submit Application
        // =========================
        [HttpPost("jobs/{jobId}")]
        [Authorize(Roles = "applicant")]
        public async Task<IActionResult> Apply(int jobId, [FromBody] CreateApplicationDto dto)
        {
            var job = await _db.Jobs.FirstOrDefaultAsync(j => j.Id == jobId && j.IsActive);
            if (job == null)
            {
                return NotFound(new { error = "Job not found." });
            }

            var application = new Applicants
            {
                JobId = jobId,
                AppliedAt = DateTime.UtcNow,
                FullName= $"{dto.FirstName} {dto.LastName}",
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                StreetAddress = dto.StreetAddress,
                City = dto.City,    
                State = dto.State,
                Country = dto.Country,
                ZipCode = dto.ZipCode,
                LinkedInProfile = dto.LinkedInProfile,
                PortfolioUrl = dto.PortfolioUrl,
                ResumeUrl = dto.ResumeUrl,
                CoverLetter = dto.CoverLetter
            };

            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            application.UserId = userId.Value;

            _db.Applicants.Add(application);
            job.ApplicantsCount += 1;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully." });
        }

        // =========================
        // USER: My Applications
        // =========================
        [HttpGet("me")]
        [Authorize(Roles = "applicant")]
        public async Task<ActionResult<IEnumerable<Applicants>>> GetMyApplications()
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var apps = await _db.Applicants
                .Include(a => a.Job)
                .Where(a => a.UserId == userId.Value)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(apps);
        }

        // =========================
        // ADMIN: All Applications
        // =========================
        [HttpGet("admin")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string search = "",
            [FromQuery] int? jobId = null,
            [FromQuery] string? status = null)
        {
            var query = _db.Applicants
                .Include(a => a.Job)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a =>
                    a.FullName.Contains(search) ||
                    a.Email.Contains(search) ||
                    a.Phone.Contains(search));
            }

            if (jobId.HasValue)
            {
                query = query.Where(a => a.JobId == jobId.Value);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                var normalizedStatus = status.Trim().ToLower();
                query = query.Where(a => (a.Status ?? "submitted").ToLower() == normalizedStatus);
            }

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(a => a.AppliedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                items,
                total,
                page,
                pageSize
            });
        }

        [HttpPatch("admin/{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            var app = await _db.Applicants.FirstOrDefaultAsync(a => a.Id == id);

            if (app == null)
            {
                return NotFound(new { error = "Application not found." });
            }

            var allowedStatuses = new[] { "submitted", "reviewing", "interviewed", "offered", "hired", "rejected" };
            var normalizedStatus = (dto.Status ?? "").Trim().ToLower();

            if (!allowedStatuses.Contains(normalizedStatus))
            {
                return BadRequest(new { error = "Invalid status." });
            }

            app.Status = normalizedStatus;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Application status updated.", status = app.Status });
        }

        // =========================
        // ADMIN: Single Application
        // =========================
        [HttpGet("admin/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Applicants>> GetById(int id)
        {
            var app = await _db.Applicants
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (app == null)
            {
                return NotFound();
            }

            return Ok(app);
        }
    }

    public class CreateApplicationDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
        public string CoverLetter { get; set; } = string.Empty;
        public string LinkedInProfile { get; set; } = string.Empty;
        public string PortfolioUrl { get; set; } = string.Empty;
    }

    public class UpdateApplicationStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}