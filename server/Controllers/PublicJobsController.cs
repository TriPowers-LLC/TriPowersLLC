using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;

<<<<<<< HEAD
namespace TriPowersLLC.Controllers;

[ApiController]
[Route("api/public/jobs")]
<<<<<<< HEAD
=======
[ApiController]
[Route("/jobs")]
>>>>>>> codex/add-admin-route-and-views
=======
[Route("api/jobs")]
>>>>>>> 0c65dfe15558630c415c8d9dd4cd911334947142
[AllowAnonymous]
public class PublicJobsController : ControllerBase
{
    private readonly JobDBContext _db;
<<<<<<< HEAD

=======
>>>>>>> codex/add-admin-route-and-views
    public PublicJobsController(JobDBContext db)
    {
        _db = db;
    }

<<<<<<< HEAD
<<<<<<< HEAD
=======
    // Named route constant for external references (keeps callers stable)
    public const string GetJobRouteName = nameof(GetJob);



>>>>>>> 0c65dfe15558630c415c8d9dd4cd911334947142
    // GET: /api/public/jobs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
    {
        var jobs = await _db.Jobs
=======
    // GET /jobs
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var now = DateTime.UtcNow;

        var jobs = await _db.Jobs
            .Where(j => j.IsActive)
            .Where(j => j.PostedAt <= now)
            .Where(j => !j.ClosingDate.HasValue || j.ClosingDate >= now)
>>>>>>> codex/add-admin-route-and-views
            .OrderByDescending(j => j.PostedAt)
            .ToListAsync();

        return Ok(jobs);
    }

<<<<<<< HEAD
    // GET: /api/public/jobs/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Job>> GetJob(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        if (job == null)
        {
            return NotFound();
=======
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
>>>>>>> codex/add-admin-route-and-views
        }

        return Ok(job);
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> codex/add-admin-route-and-views
