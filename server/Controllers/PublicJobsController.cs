using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;

[ApiController]
[Route("/jobs")]
[AllowAnonymous]
public class PublicJobsController : ControllerBase
{
    private readonly JobDBContext _db;
    public PublicJobsController(JobDBContext db)
    {
        _db = db;
    }

    // GET /jobs
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var now = DateTime.UtcNow;

        var jobs = await _db.Jobs
            .Where(j => j.IsActive)
            .Where(j => j.PostedAt <= now)
            .Where(j => !j.ClosingDate.HasValue || j.ClosingDate >= now)
            .OrderByDescending(j => j.PostedAt)
            .ToListAsync();

        return Ok(jobs);
    }

    // GET /jobs/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        if (job == null) return NotFound();

        // Increment views counter (best-effort)
        try
        {
            job.Views += 1;
            _db.Entry(job).Property(j => j.Views).IsModified = true;
            await _db.SaveChangesAsync();
        }
        catch
        {
            // Swallow errors updating views — shouldn't block reads
        }

        return Ok(job);
    }
}
