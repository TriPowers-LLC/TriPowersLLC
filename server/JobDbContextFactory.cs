using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TriPowersLLC.Models
{
    public class JobDbContextFactory : IDesignTimeDbContextFactory<JobDBContext>
    {
        public JobDBContext CreateDbContext(string[] args)
        {
            // Try env var first (easy for CLI), then appsettings
            var cs = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION");

            if (string.IsNullOrWhiteSpace(cs))
            {
                var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: true)
                    .AddJsonFile("appsettings.Development.json", optional: true)
                    .AddEnvironmentVariables()
                    .Build();

                cs = config.GetConnectionString("DefaultConnection");
            }

            if (string.IsNullOrWhiteSpace(cs))
                throw new InvalidOperationException("No connection string. Set DEFAULT_CONNECTION or ConnectionStrings:DefaultConnection.");

            var opts = new DbContextOptionsBuilder<JobDBContext>()
                .UseSqlServer(cs)
                .Options;

            return new JobDBContext(opts);
        }
    }
}
