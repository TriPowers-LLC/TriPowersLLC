using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TriPowersLLC.Models
{
    public class JobDbContextFactory : IDesignTimeDbContextFactory<JobDBContext>
    {
        public JobDBContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), optional: true)
                .AddEnvironmentVariables()
                .Build();

            var cs =
                Environment.GetEnvironmentVariable("DEFAULT_CONNECTION")
                ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                ?? config.GetConnectionString("DefaultConnection")
                ?? config["ConnectionStrings:DefaultConnection"]
                ?? config["ConnectionStrings__DefaultConnection"];

            Console.WriteLine($"EF Connection: {cs}");

            if (string.IsNullOrWhiteSpace(cs))
            {
                throw new InvalidOperationException(
                    "No connection string found. Checked DEFAULT_CONNECTION, ConnectionStrings__DefaultConnection, and ConnectionStrings:DefaultConnection."
                );
            }

            var opts = new DbContextOptionsBuilder<JobDBContext>()
                .UseNpgsql(cs)
                .Options;

            return new JobDBContext(opts);
        }
    }
}