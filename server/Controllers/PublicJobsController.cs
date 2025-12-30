using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;

namespace TriPowersLLC.Controllers;

[ApiController]
[Route("api/public/jobs")]
[AllowAnonymous]
public class PublicJobsController : ControllerBase
{
    private readonly JobDBContext _db;

    public PublicJobsController(JobDBContext db)
    {
        _db = db;
    }

    // GET: /api/public/jobs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
    {
        var jobs = await _db.Jobs
            .OrderByDescending(j => j.PostedAt)
            .ToListAsync();

        return Ok(jobs);
    }

    // GET: /api/public/jobs/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Job>> GetJob(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        if (job == null)
        {
            return NotFound();
        }

        return Ok(job);
    }
}