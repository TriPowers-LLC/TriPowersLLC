using Microsoft.EntityFrameworkCore;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.OpenApi;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Design;


var builder = WebApplication.CreateBuilder(args);

Console.WriteLine($"[Env] ASPNETCORE_ENVIRONMENT = {builder.Environment.EnvironmentName}");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()      // allow all callers for now
            .AllowAnyMethod()      // GET, POST, PUT, DELETE
            .AllowAnyHeader();     // all headers
    });
});

builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddAuthentication()
    .AddJwtBearer();

/* var appwriteConfig = new AppwriteConfig
{
    Endpoint = Environment.GetEnvironmentVariable("APPWRITE_ENDPOINT") ?? "https://sfo.cloud.appwrite.io/v1",   // e.g. your Appwrite endpoint
    ProjectId = Environment.GetEnvironmentVariable("APPWRITE_PROJECT_ID") ?? "6931e19600334b1440fa",
    ApiKey = Environment.GetEnvironmentVariable("APPWRITE_API_KEY") ?? "standard_749780b411decc1b7aa8fbb0c8ef1ee1c30b99c17cfe628a9384c6bd10568912c87b3b89aa3aba712753902d79bb6609a89a633a066f0854d1ffef16f178f08a93f8ca0525aa43311b0a7f7954c210d4442ca4cb69c9ef3b272014ecd5cf235019db706cdc2fc4976b7f0e348b5cfaa6b05e4985be43cab3c20e7f1c23e303dd",
    DatabaseId = Environment.GetEnvironmentVariable("APPWRITE_DATABASE_ID") ?? "6931e37b000d1dc0ec63",
    TableId = Environment.GetEnvironmentVariable("APPWRITE_TABLE_ID") ?? "jobs"
}; */

var connectionString = Environment.GetEnvironmentVariable("RDS_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("JobsDb");

// Read RDS env var (for AWS) and local config (for dev)
var rdsConnection = Environment.GetEnvironmentVariable("RDS_CONNECTION_STRING");
Console.WriteLine($"[Config] RDS_CONNECTION_STRING present? {!string.IsNullOrWhiteSpace(rdsConnection)}");

var localConnection = builder.Configuration.GetConnectionString("JobsDb");
Console.WriteLine($"[Config] Local ConnectionStrings:JobsDb present? {!string.IsNullOrWhiteSpace(localConnection)}");

builder.Services.AddDbContext<JobsDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        Console.WriteLine("[Config] Environment=Development → using in-memory JobsDev DB");
        options.UseInMemoryDatabase("JobsDev");
    }
    else if (!string.IsNullOrWhiteSpace(rdsConnection))
    {
        Console.WriteLine("[Config] Environment=Production → using RDS_CONNECTION_STRING");
        options.UseNpgsql(rdsConnection);
    }
    else
    {
        throw new InvalidOperationException(
            "No valid DB connection string found. " +
            "In Production, set RDS_CONNECTION_STRING. " +
            "In Development, ensure ASPNETCORE_ENVIRONMENT=Development so in-memory DB is used.");
    }
});

/* 
// Register Appwrite TablesDB client as a singleton
builder.Services.AddSingleton(sp =>
{
    var client = new Client()
        .SetEndpoint(appwriteConfig.Endpoint)
        .SetProject(appwriteConfig.ProjectId)
        .SetKey(appwriteConfig.ApiKey);

    return new TablesDB(client);
});

// Also register config so we can inject it
builder.Services.AddSingleton(appwriteConfig); */

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Jobs API",
        Version = "v1"
    });
});


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.MapGet("/", () => "Jobs API is running");

app.MapGet("/jobs", async (JobsDbContext db) =>
{
    var now = DateTimeOffset.UtcNow;

    var jobs = await db.Jobs
        .Where(j => j.IsActive)
        .Where(j => !j.PostedDate.HasValue || j.PostedDate <= now)
        .Where(j => !j.ClosingDate.HasValue || j.ClosingDate >= now)
        .OrderByDescending(j => j.PostedDate ?? j.CreatedAt)
        .ToListAsync();

    return Results.Ok(jobs);
});


/* // POST /jobs  -> create a new job in Appwrite
app.MapPost("/jobs", async (JobCreateRequest request, TablesDB tablesDb, JobsDbContext db) =>
{
    // Map request to DB row data
    var data = new Dictionary<string, object>
    {
        { "title", request.Title },
        { "company", request.Company },
        { "location", request.Location },
        { "url", request.Url },
        { "description", request.Description },
        { "salaryRange", request.SalaryRange },
        { "employmentType", request.EmploymentType },
        { "postedDate", DateTime.UtcNow.ToString("o") }, // ISO 8601 format
        { "isActive", true },
        { "views", 0 },
        { "applicants", 0 },
        { "closingDate", DateTime.UtcNow.AddMonths(1).ToString("o") } // Default to 1 month from now
    };

    // Looser permissions for testing – anyone can read
    var permissions = new List<string>
    {
        "read(\"any\")"
    };

    var createdRow = await tablesDb.CreateRow(
        databaseId: db.DatabaseId,
        tableId: db.TableId,
        rowId: "unique()",
        data: data,
        permissions: permissions
    );

    var job = MapRowToJob(createdRow);

    return Results.Created($"/jobs/{job.Id}", job);
});

// GET /jobs/{id}  -> get single job by rowId
app.MapGet("/jobs/{id}", async (string id, TablesDB tablesDb, JobsDbContext db) =>
{
    try
    {
        var row = await tablesDb.GetRow(
            databaseId: db.DatabaseId,
            tableId: db.TableId,
            rowId: id
        );

        var job = MapRowToJob(row);
        return Results.Ok(job);
    }
    catch (Appwrite.AppwriteException ex)
    {
        // If not found, Appwrite will throw; we map to 404
        return Results.NotFound(new { message = ex.Message });
    }
});
 */
// Only run migrations when NOT in Development (i.e., on AWS / real DB)
if (!app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<JobsDbContext>();

    try
    {
        Console.WriteLine("[DB] Applying migrations...");
        db.Database.Migrate();
        Console.WriteLine("[DB] Migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine("[DB] Migration failed: " + ex);
        // You can decide whether to rethrow or just log
        throw;
    }
}
else
{
    Console.WriteLine("[DB] Development environment detected → skipping migrations (in-memory DB).");
}

app.Run();
// ------------ Helper mapping + models below -----------------

/* static JobDto MapRowToJob(Row row)
{
    // Safely read fields from row.Data dictionary
    object? Get(string key) =>
        row.Data != null && row.Data.TryGetValue(key, out var value) ? value : null;

    return new JobDto(
        Id: row.Id,
        Title: Get("title")?.ToString() ?? string.Empty,
        Company: Get("company")?.ToString() ?? string.Empty,
        Location: Get("location")?.ToString() ?? string.Empty,
        Url: Get("url")?.ToString() ?? string.Empty,
        Description: Get("description")?.ToString() ?? string.Empty,
        SalaryRange: Get("salaryRange")?.ToString() ?? string.Empty,
        EmploymentType: Get("employmentType")?.ToString() ?? string.Empty
    );
} */

public record JobDto(
    string Id,
    string Title,
    string Company,
    string Location,
    string Url,
    string Description,
    string SalaryRange,
    string EmploymentType
);

public class JobCreateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SalaryRange { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = string.Empty;
}

/* public class AppwriteConfig
{
    public string Endpoint { get; set; } = string.Empty;
    public string ProjectId { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string DatabaseId { get; set; } = string.Empty;
    public string TableId { get; set; } = string.Empty;
}
 */