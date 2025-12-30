using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using TriPowersLLC.Contracts;
using Xunit;

namespace TriPowersLLC.Tests;

public class JobEndpointsTests
{
    [Fact]
    public async Task Admin_Jobs_EndPoints_RequireAuthentication()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/admin/jobs", new JobCreateRequest
        {
            Title = "Unauthorized Job",
            Description = "Desc",
            Requirements = "Req",
            Responsibilities = "Resp",
            Location = "Remote",
            EmploymentType = "Full-time",
            VendorName = "Vendor",
            SalaryRangeMin = 1,
            SalaryRangeMax = 2
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Admin_Jobs_EndPoints_Require_Admin_Role()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateUserClient();

        var response = await client.DeleteAsync("/api/admin/jobs/1");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_Jobs_Can_Create_Update_And_Delete()
    {
        using var factory = new CustomWebApplicationFactory();
        var adminClient = factory.CreateAdminClient();
        var publicClient = factory.CreateClient();

        var createRequest = new JobCreateRequest
        {
            Title = "Backend Engineer",
            Description = "Work on APIs",
            Requirements = "C#, SQL",
            Responsibilities = "Build services",
            Location = "Remote",
            EmploymentType = "Full-time",
            VendorName = "TriPowers",
            SalaryRangeMin = 90000,
            SalaryRangeMax = 120000,
            Benefits = "Health"
        };

        var createResponse = await adminClient.PostAsJsonAsync("/api/admin/jobs", createRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdJob = await createResponse.Content.ReadFromJsonAsync<JobResponse>();
        Assert.NotNull(createdJob);
        Assert.True(createdJob!.Id > 0);

        var fetchedJob = await publicClient.GetFromJsonAsync<JobResponse>($"/api/jobs/{createdJob.Id}");
        Assert.NotNull(fetchedJob);
        Assert.Equal(createRequest.Title, fetchedJob!.Title);

        var updateRequest = new JobUpdateRequest
        {
            Title = "Senior Backend Engineer",
            Description = createRequest.Description,
            Requirements = createRequest.Requirements,
            Responsibilities = createRequest.Responsibilities,
            Location = createRequest.Location,
            EmploymentType = createRequest.EmploymentType,
            VendorName = createRequest.VendorName,
            SalaryRangeMin = createRequest.SalaryRangeMin,
            SalaryRangeMax = createRequest.SalaryRangeMax + 10000,
            Benefits = "Health, 401k"
        };

        var updateResponse = await adminClient.PutAsJsonAsync($"/api/admin/jobs/{createdJob.Id}", updateRequest);
        Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

        var updatedJob = await publicClient.GetFromJsonAsync<JobResponse>($"/api/jobs/{createdJob.Id}");
        Assert.NotNull(updatedJob);
        Assert.Equal(updateRequest.Title, updatedJob!.Title);
        Assert.Equal(updateRequest.SalaryRangeMax, updatedJob.SalaryRangeMax);

        var deleteResponse = await adminClient.DeleteAsync($"/api/admin/jobs/{createdJob.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var afterDelete = await publicClient.GetAsync($"/api/jobs/{createdJob.Id}");
        Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
    }
}