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
        // PUBLIC: Submit Application
        // =========================
        [HttpPost("jobs/{jobId}")]
        [AllowAnonymous]
        public async Task<IActionResult> Apply(int jobId, [FromBody] Applicants request)
        {
            var job = await _db.Jobs.FirstOrDefaultAsync(j => j.Id == jobId && j.IsActive);
            if (job == null)
            {
                return NotFound(new { error = "Job not found." });
            }

            request.JobId = jobId;
            request.AppliedAt = DateTime.UtcNow;

            var userId = GetUserId();
            if (userId.HasValue)
            {
                request.UserId = userId.Value;
            }

            _db.Applicants.Add(request);
            job.ApplicantsCount += 1;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully." });
        }

        // =========================
        // USER: My Applications
        // =========================
        [HttpGet("me")]
        [Authorize]
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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Applicants>>> GetAll()
        {
            var apps = await _db.Applicants
                .Include(a => a.Job)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(apps);
        }

        // =========================
        // ADMIN: Single Application
        // =========================
        [HttpGet("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Applicants>> GetById(int id)
        {
            var app = await _db.Applicants
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.id == id);

            if (app == null)
            {
                return NotFound();
            }

            return Ok(app);
        }
    }
}