using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicantsController : ControllerBase
    {
        private readonly JobDBContext _context;

         private int? GetUserId()
        {
             var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userId, out var parsed) ? parsed : null;
        }

        public ApplicantsController(JobDBContext context)
        {
            _context = context;
        }

        // POST: api/Applicants
        [HttpPost]
        public async Task<ActionResult<Applicants>> PostApplicants(Applicants applicants)
        {
            applicants.AppliedAt = DateTime.UtcNow;

       // If the caller is authenticated, attach their user id to the application
            var userId = GetUserId();
            if (userId.HasValue)
            {
                applicants.UserId = userId.Value;
            }

            _context.Applicants.Add(applicants);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetApplicants", new { id = applicants.id }, applicants);
        }

        // PUT: api/Applicants/5
        [HttpPut("{id}")]

        [Authorize]
        public async Task<IActionResult> PutApplicants(int id, Applicants updated)
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

        // GET: api/Applicants/me
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Applicants>>> GetMyApplicants()
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