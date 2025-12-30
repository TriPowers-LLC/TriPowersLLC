using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using TriPowersLLC.Contracts;
using TriPowersLLC.Models;
using Xunit;

namespace TriPowersLLC.Tests;

public class ApplicantEndpointsTests
{
    [Fact]
    public async Task Applicants_Endpoints_Require_Admin_Role()
    {
        using var factory = new CustomWebApplicationFactory();
        var anonymousClient = factory.CreateClient();
        var userClient = factory.CreateUserClient();

        var unauthorized = await anonymousClient.GetAsync("/api/admin/applicants");
        Assert.Equal(HttpStatusCode.Unauthorized, unauthorized.StatusCode);

        var forbidden = await userClient.GetAsync("/api/admin/applicants");
        Assert.Equal(HttpStatusCode.Forbidden, forbidden.StatusCode);
    }

    [Fact]
    public async Task Applicants_Admin_Can_Perform_Crud()
    {
        using var factory = new CustomWebApplicationFactory();
        var adminClient = factory.CreateAdminClient();

        var jobResponse = await adminClient.PostAsJsonAsync("/api/admin/jobs", new JobCreateRequest
        {
            Title = "QA Engineer",
            Description = "Test applications",
            Requirements = "Attention to detail",
            Responsibilities = "Write test cases",
            Location = "Remote",
            EmploymentType = "Contract",
            VendorName = "TriPowers",
            SalaryRangeMin = 60000,
            SalaryRangeMax = 80000
        });

        var job = await jobResponse.Content.ReadFromJsonAsync<JobResponse>();
        Assert.NotNull(job);

        var applicant = new Applicants
        {
            firstName = "Ada",
            lastName = "Lovelace",
            email = "ada@example.com",
            password = "password123",
            phone = "123-456-7890",
            streetAddress = "123 Main St",
            city = "Remote City",
            state = "NA",
            country = "USA",
            zipCode = "12345",
            ResumeText = "Pioneer",
            JobId = job!.Id
        };

        var createResponse = await adminClient.PostAsJsonAsync("/api/admin/applicants", applicant);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var createdApplicant = await createResponse.Content.ReadFromJsonAsync<Applicants>();
        Assert.NotNull(createdApplicant);

        var listResponse = await adminClient.GetFromJsonAsync<List<Applicants>>("/api/admin/applicants");
        Assert.NotNull(listResponse);
        Assert.Contains(listResponse!, a => a.email == applicant.email);

        createdApplicant!.firstName = "Augusta";
        var updateResponse = await adminClient.PutAsJsonAsync($"/api/admin/applicants/{createdApplicant.id}", createdApplicant);
        Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);

        var updated = await adminClient.GetFromJsonAsync<Applicants>($"/api/admin/applicants/{createdApplicant.id}");
        Assert.NotNull(updated);
        Assert.Equal("Augusta", updated!.firstName);

        var deleteResponse = await adminClient.DeleteAsync($"/api/admin/applicants/{createdApplicant.id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var afterDelete = await adminClient.GetAsync($"/api/admin/applicants/{createdApplicant.id}");
        Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
    }
}
