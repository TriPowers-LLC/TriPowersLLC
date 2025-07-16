using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriPowersLLC.Models;
using Microsoft.AspNetCore.Authorization;
using System;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Ensure this controller requires authentication
public class JobsController : ControllerBase
{
    private readonly JobDBContext _db;
    public JobsController(JobDBContext db)
    {
        _db = db;

        // If you have access to configuration, inject it and use here
        // Example: IConfiguration _config, then use _config["OpenAI:ApiKey"]
        // Remove or adjust the following line as needed:
        // var key = builder.Configuration["OpenAI:ApiKey"];
        // Console.WriteLine($"[DEBUG] Using OpenAI key prefix: {key?.Substring(0, 4)}…");
    }


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
