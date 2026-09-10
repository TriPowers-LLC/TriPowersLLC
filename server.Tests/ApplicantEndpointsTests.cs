using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using TriPowersLLC.Contracts;
using TriPowersLLC.Controllers;
using Xunit;

namespace TriPowersLLC.Tests;

public class ApplicantEndpointsTests
{
    [Fact]
    public async Task Applicants_Admin_Endpoint_Requires_Admin_Role()
    {
        using var factory = new CustomWebApplicationFactory();
        var anonymous = await factory.CreateClient().GetAsync("/api/applicants/admin");
        var nonAdmin = await factory.CreateUserClient().GetAsync("/api/applicants/admin");

        Assert.Equal(HttpStatusCode.Unauthorized, anonymous.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, nonAdmin.StatusCode);
    }

    [Fact]
    public async Task Applicant_Can_Apply_And_Admin_Can_Update_Status()
    {
        using var factory = new CustomWebApplicationFactory();
        var adminClient = factory.CreateAdminClient();
        var applicantClient = factory.CreateUserClient();
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

        var applyResponse = await applicantClient.PostAsJsonAsync($"/api/applicants/jobs/{job!.Id}", new CreateApplicationDto
        {
            FirstName = "Ada",
            LastName = "Lovelace",
            Email = "ada@example.com",
            Phone = "123-456-7890",
            StreetAddress = "123 Main St",
            City = "Remote City",
            State = "NA",
            Country = "USA",
            ZipCode = "12345",
            CoverLetter = "Pioneer"
        });
        Assert.Equal(HttpStatusCode.OK, applyResponse.StatusCode);

        var listResponse = await adminClient.GetAsync("/api/applicants/admin");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);
        var page = await listResponse.Content.ReadFromJsonAsync<JsonElement>();
        var applicantId = page.GetProperty("items")[0].GetProperty("id").GetInt32();

        var statusResponse = await adminClient.PatchAsJsonAsync(
            $"/api/applicants/admin/{applicantId}/status",
            new { status = "reviewing" });
        Assert.Equal(HttpStatusCode.OK, statusResponse.StatusCode);

        var updated = await adminClient.GetFromJsonAsync<JsonElement>($"/api/applicants/admin/{applicantId}");
        Assert.Equal("reviewing", updated.GetProperty("status").GetString());
    }
}
