// server/Models/Job.cs
namespace TriPowersLLC.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    }
}
