using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/admin/applicants")]
    [Authorize(Roles = "Admin")]
    public class ApplicantsController : ControllerBase
    {
        private readonly JobDBContext _db;

        public ApplicantsController(JobDBContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Applicants>>> GetAll()
        {
            var applicants = await _db.Applicants
                .Include(a => a.Job)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(applicants);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Applicants>> GetById(int id)
        {
            var applicant = await _db.Applicants
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.id == id);

            return applicant is null ? NotFound() : Ok(applicant);
        }

        [HttpPost]
        public async Task<ActionResult<Applicants>> Create([FromBody] Applicants applicant)
        {
            var job = await _db.Jobs.FindAsync(applicant.JobId);
            if (job is null)
            {
                return BadRequest(new { error = $"Job {applicant.JobId} does not exist." });
            }

            applicant.AppliedAt = DateTime.UtcNow;

            _db.Applicants.Add(applicant);
            job.ApplicantsCount += 1;
            await _db.SaveChangesAsync();

            await _db.Entry(applicant)
                .Reference(a => a.Job)
                .LoadAsync();

            return CreatedAtAction(nameof(GetById), new { id = applicant.id }, applicant);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Applicants applicant)
        {
            if (id != applicant.id)
            {
                return BadRequest(new { error = "Route id must match applicant id." });
            }

            var existingApplicant = await _db.Applicants
                .FirstOrDefaultAsync(a => a.id == id);

            if (existingApplicant is null)
            {
                return NotFound();
            }

            var job = await _db.Jobs.FindAsync(applicant.JobId);
            if (job is null)
            {
                return BadRequest(new { error = $"Job {applicant.JobId} does not exist." });
            }

            existingApplicant.firstName = applicant.firstName;
            existingApplicant.lastName = applicant.lastName;
            existingApplicant.email = applicant.email;
            existingApplicant.password = applicant.password;
            existingApplicant.phone = applicant.phone;
            existingApplicant.streetAddress = applicant.streetAddress;
            existingApplicant.city = applicant.city;
            existingApplicant.state = applicant.state;
            existingApplicant.country = applicant.country;
            existingApplicant.zipCode = applicant.zipCode;
            existingApplicant.ResumeText = applicant.ResumeText;
            existingApplicant.JobId = applicant.JobId;
            existingApplicant.UserId = applicant.UserId;
            existingApplicant.ResumeUrl = applicant.ResumeUrl;
            existingApplicant.CoverLetter = applicant.CoverLetter;
            existingApplicant.LinkedInProfile = applicant.LinkedInProfile;
            existingApplicant.PortfolioUrl = applicant.PortfolioUrl;
            existingApplicant.Message = applicant.Message;
            existingApplicant.AppliedAt = applicant.AppliedAt;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var applicant = await _db.Applicants.FindAsync(id);
            if (applicant is null)
            {
                return NotFound();
            }

            var job = await _db.Jobs.FindAsync(applicant.JobId);

            _db.Applicants.Remove(applicant);

            if (job is not null && job.ApplicantsCount > 0)
            {
                job.ApplicantsCount -= 1;
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
