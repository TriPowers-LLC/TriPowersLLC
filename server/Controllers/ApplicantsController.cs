using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ApplicantsController : ControllerBase
    {
        private readonly JobDBContext _context;

        public ApplicantsController(JobDBContext context)
        {
            _context = context;
        }

        //GET: api/admin/Applicants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Applicants>>> GetApplicants()
        {
            return await _context.Applicants.ToListAsync();
        }

        // GET: api/admin/Applicants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Applicants>> GetApplicants(int id)
        {
            var applicants = await _context.Applicants.FindAsync(id);

            if (applicants == null)
            {
                return NotFound();
            }

            return applicants;
        }

        // PUT: api/admin/Applicants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplicants(int id, Applicants applicants)
        {
            if (id != applicants.id)
            {
                return BadRequest();
            }

            _context.Entry(applicants).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicantsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Applicants
        [HttpPost]
        public async Task<ActionResult<Applicants>> PostApplicants(Applicants applicants)
        {
            _context.Applicants.Add(applicants);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetApplicants", new { id = applicants.id }, applicants);
        }

        // DELETE: api/admin/Applicants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplicants(int id)
        {
            var applicants = await _context.Applicants.FindAsync(id);
            if (applicants == null)
            {
                return NotFound();
            }

            _context.Applicants.Remove(applicants);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApplicantsExists(int id)
        {
            return _context.Applicants.Any(e => e.id == id);
        }
    }
}
