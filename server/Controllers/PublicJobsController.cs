using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Contracts;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/public/jobs")]
    public class PublicJobsController : ControllerBase
    {
        public const string GetJobRouteName = "GetPublicJobById";

        private readonly JobDBContext _db;

        public PublicJobsController(JobDBContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobResponse>>> GetAll()
        {
            var jobs = await _db.Jobs
                .Where(j => j.Status == "active")
                .OrderByDescending(j => j.PostedAt)
                .ToListAsync();

            return Ok(jobs.Select(JobResponse.FromEntity));
        }

        [HttpGet("{id}", Name = GetJobRouteName)]
        public async Task<ActionResult<JobResponse>> GetById(int id)
        {
            var job = await _db.Jobs.FirstOrDefaultAsync(j => j.Id == id && j.Status == "active");

            if (job is null)
            {
                return NotFound();
            }

            job.Views += 1;
            await _db.SaveChangesAsync();

            return Ok(JobResponse.FromEntity(job));
        }
    }
}
