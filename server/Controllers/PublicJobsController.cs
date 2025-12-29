using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Contracts;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class PublicJobsController : ControllerBase
    {
        internal const string GetJobRouteName = "GetPublicJobById";

        private readonly JobDBContext _db;

        public PublicJobsController(JobDBContext db)
        {
            _db = db;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IEnumerable<JobResponse>> GetAll()
        {
            var jobs = await _db.Jobs
                .OrderByDescending(j => j.PostedAt)
                .ToListAsync();

            return jobs.Select(JobResponse.FromEntity);
        }

        [HttpGet("{id}", Name = GetJobRouteName)]
        [AllowAnonymous]
        public async Task<ActionResult<JobResponse>> GetById(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            return job is null ? NotFound() : JobResponse.FromEntity(job);
        }
    }
}