using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Contracts;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/admin/jobs")]
    [Authorize(Roles = "Admin")]
    public class JobsController : ControllerBase
    {
        private readonly JobDBContext _db;

        public JobsController(JobDBContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<ActionResult<JobResponse>> Create([FromBody] JobCreateRequest request)
        {
            if (request.SalaryRangeMin > request.SalaryRangeMax)
            {
                return BadRequest(new { error = "SalaryRangeMin cannot exceed SalaryRangeMax." });
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
                PostedAt = DateTime.UtcNow
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
