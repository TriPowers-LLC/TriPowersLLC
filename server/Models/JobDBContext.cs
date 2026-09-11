using Microsoft.EntityFrameworkCore;

namespace TriPowersLLC.Models
{
    public class JobDBContext : DbContext
    {
        public JobDBContext(DbContextOptions<JobDBContext> options) : base(options)
        {

        }
        public DbSet<Applicants> Applicants { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(user => new { user.ExternalProvider, user.ExternalSubject })
                .IsUnique();

            modelBuilder.Entity<User>().Property(user => user.ExternalProvider).HasMaxLength(32);
            modelBuilder.Entity<User>().Property(user => user.ExternalSubject).HasMaxLength(255);
        }
    }
}
