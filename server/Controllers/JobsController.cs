using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly JobDBContext _db;
    public JobsController(JobDBContext db) => _db = db;

    // GET /api/jobs
    [HttpGet]
    public async Task<IEnumerable<Job>> GetAll() =>
        await _db.Jobs.OrderByDescending(j => j.PostedAt).ToListAsync();

    // GET /api/jobs/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Job>> GetById(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        return job == null ? NotFound() : job;
    }

    // POST /api/jobs
    [HttpPost]
    public async Task<ActionResult<Job>> Create(Job job)
    {
        _db.Jobs.Add(job);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
    }

    // PUT /api/jobs/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Job job)
    {
        if (id != job.Id) return BadRequest();

        _db.Entry(job).State = EntityState.Modified;
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!JobExists(id)) return NotFound();
            throw;
        }
        return NoContent();
    }

    // DELETE /api/jobs/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var job = await _db.Jobs.FindAsync(id);
        if (job == null) return NotFound();

        _db.Jobs.Remove(job);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private bool JobExists(int id) => _db.Jobs.Any(e => e.Id == id);
}
