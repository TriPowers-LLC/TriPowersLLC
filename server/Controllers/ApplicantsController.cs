using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ApplicantsController : ControllerBase
    {
        private readonly JobDBContext _context;

         private int? GetUserId()
        {
             var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userId, out var parsed) ? parsed : null;
        }

        // GET: api/admin/Applicants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Applicants>>> GetApplicants()
        {
            _context = context;
        }

        // GET: api/admin/Applicants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Applicants>> GetApplicants(int id)
        {
            applicants.AppliedAt = DateTime.UtcNow;

        // PUT: api/admin/Applicants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplicants(int id, Applicants applicants)
        {
            if (id != applicants.id)
            {
                applicants.UserId = userId.Value;
            }

            _context.Applicants.Add(applicants);
            await _context.SaveChangesAsync();

            // Update job applicants count (best-effort)
            try
            {
                var job = await _context.Jobs.FindAsync(applicants.JobId);
                if (job != null)
                {
                    job.ApplicantsCount += 1;
                    await _context.SaveChangesAsync();
                }
            }
            catch { /* don't block on count update */ }

            return CreatedAtAction("GetApplicants", new { id = applicants.id }, applicants);
        }

        // POST: api/admin/Applicants
        [HttpPost]
        public async Task<ActionResult<Applicants>> PostApplicants(Applicants applicants)
        {
            
            var userId = GetUserId();
            if (userId is null) return Unauthorized();

            var existing = await _context.Applicants.FirstOrDefaultAsync(a => a.id == id && a.UserId == userId);
            if (existing is null) return Forbid();

            existing.firstName = updated.firstName;
            existing.lastName = updated.lastName;
            existing.email = updated.email;
            existing.phone = updated.phone;
            existing.streetAddress = updated.streetAddress;
            existing.city = updated.city;
            existing.state = updated.state;
            existing.country = updated.country;
            existing.zipCode = updated.zipCode;
            existing.ResumeText = updated.ResumeText;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/admin/Applicants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplicants(int id)
        {
            var userId = GetUserId();
            if (userId is null) return Unauthorized();

            var myApplications = await _context.Applicants
                .Include(a => a.Job)
                .Where(a => a.UserId == userId.Value)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(myApplications);
        }

        // GET: api/Applicants/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Applicants>> GetApplicants(int id)
        {
            var userId = GetUserId();
            if (userId is null) return Unauthorized();

            var applicants = await _context.Applicants
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.id == id && a.UserId == userId);

            if (applicants == null) return Forbid();

            return applicants;
        }

        private bool ApplicantsExists(int id) => _context.Applicants.Any(e => e.id == id);
    }
}