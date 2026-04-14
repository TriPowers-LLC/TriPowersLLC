using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TriPowersLLC.Models;

[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    private readonly IAmazonS3 _s3;
    private readonly IConfiguration _config;
    private readonly JobDBContext _db;

    public UploadsController(IAmazonS3 s3, IConfiguration config, JobDBContext db)
    {
        _s3 = s3;
        _config = config;
        _db = db;
    }

    [HttpPost("presign")]
    [Authorize(Roles = "admin,applicant")]
    public IActionResult CreatePresignedUploadUrl([FromBody] PresignUploadRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FileName))
            return BadRequest("File name is required.");

        var bucket = _config["S3_BUCKET"];
        if (string.IsNullOrWhiteSpace(bucket))
            return StatusCode(500, "S3 bucket is not configured.");

        var safeFileName = Path.GetFileName(request.FileName);
        var objectKey = $"resumes/{Guid.NewGuid()}-{safeFileName}";

        var presignRequest = new GetPreSignedUrlRequest
        {
            BucketName = bucket,
            Key = objectKey,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(10),
            ContentType = request.ContentType ?? "application/octet-stream"
        };

        var url = _s3.GetPreSignedURL(presignRequest);

        return Ok(new
        {
            uploadUrl = url,
            objectKey
        });
    }

    [HttpGet("applications/{applicationId:int}/resume")]
    [Authorize(Roles = "admin,applicant")]
    public async Task<IActionResult> GetResumeDownloadUrl(int applicationId)
    {
        try
        {
            var applicant = await _db.Applicants
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (applicant == null)
                return NotFound("Application not found.");

            if (!User.IsInRole("admin"))
            {
                var userId = GetUserId();
                if (!userId.HasValue || applicant.UserId != userId.Value)
                    return Forbid();
            }

            if (string.IsNullOrWhiteSpace(applicant.ResumeUrl))
                return NotFound("Resume not found.");

            var bucket = _config["S3_BUCKET"] ?? _config["S3_Bucket"];
            if (string.IsNullOrWhiteSpace(bucket))
                return StatusCode(500, "S3 bucket is not configured.");

            var storedResumeValue = applicant.ResumeUrl.Trim();

            var objectKey = storedResumeValue.Contains(".amazonaws.com/")
                ? storedResumeValue.Split(".amazonaws.com/")[1]
                : storedResumeValue;

            if (string.IsNullOrWhiteSpace(objectKey))
                return StatusCode(500, new
                {
                    error = "Resume object key could not be determined.",
                    storedResumeValue
                });

            var presignRequest = new GetPreSignedUrlRequest
            {
                BucketName = bucket,
                Key = objectKey,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(10)
            };

            Console.WriteLine($"Bucket: {bucket}");
            Console.WriteLine($"Stored ResumeUrl: {storedResumeValue}");
            Console.WriteLine($"Object Key: {objectKey}");
            var url = _s3.GetPreSignedURL(presignRequest);

            return Ok(new
            {
                downloadUrl = url,
                objectKey
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Failed to generate resume download URL.",
                detail = ex.Message,
                inner = ex.InnerException?.Message
            });
        }
    }

    [HttpPost("applications/{applicationId:int}/resume/presign-replace")]
    [Authorize(Roles = "admin,applicant")]
    public async Task<IActionResult> CreateResumeReplaceUrl(int applicationId, [FromBody] PresignUploadRequest request)
    {
        var applicant = await _db.Applicants
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (applicant == null)
            return NotFound("Application not found.");

        if (!User.IsInRole("admin"))
        {
            var userId = GetUserId();
            if (!userId.HasValue || applicant.UserId != userId.Value)
                return Forbid();
        }

        if (string.IsNullOrWhiteSpace(request.FileName))
            return BadRequest("File name is required.");

        var bucket = _config["S3_BUCKET"];
        if (string.IsNullOrWhiteSpace(bucket))
            return StatusCode(500, "S3 bucket is not configured.");

        var safeFileName = Path.GetFileName(request.FileName);
        var newObjectKey = $"resumes/{Guid.NewGuid()}-{safeFileName}";

        var presignRequest = new GetPreSignedUrlRequest
        {
            BucketName = bucket,
            Key = newObjectKey,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(10),
            ContentType = request.ContentType ?? "application/octet-stream"
        };

        var uploadUrl = _s3.GetPreSignedURL(presignRequest);

        return Ok(new
        {
            uploadUrl,
            objectKey = newObjectKey,
            oldObjectKey = applicant.ResumeUrl
        });
    }

    [HttpPut("applications/{applicationId:int}/resume")]
    [Authorize(Roles = "admin,applicant")]
    public async Task<IActionResult> ConfirmResumeReplace(int applicationId, [FromBody] ConfirmResumeReplaceRequest request)
    {
        var applicant = await _db.Applicants
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (applicant == null)
            return NotFound("Application not found.");

        if (!User.IsInRole("admin"))
        {
            var userId = GetUserId();
            if (!userId.HasValue || applicant.UserId != userId.Value)
                return Forbid();
        }

        var bucket = _config["S3_BUCKET"];
        if (string.IsNullOrWhiteSpace(bucket))
            return StatusCode(500, "S3 bucket is not configured.");

        var oldObjectKey = applicant.ResumeUrl;
        applicant.ResumeUrl = request.ObjectKey;
        await _db.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(oldObjectKey))
        {
            try
            {
                await _s3.DeleteObjectAsync(new DeleteObjectRequest
                {
                    BucketName = bucket,
                    Key = oldObjectKey
                });
            }
            catch
            {
                // Keep app update successful even if old file cleanup fails.
            }
        }

        return Ok(new { success = true, objectKey = request.ObjectKey });
    }

    [HttpDelete("applications/{applicationId:int}/resume")]
    [Authorize(Roles = "admin,applicant")]
    public async Task<IActionResult> DeleteResume(int applicationId)
    {
        var applicant = await _db.Applicants
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (applicant == null)
            return NotFound("Application not found.");

        if (!User.IsInRole("admin"))
        {
            var userId = GetUserId();
            if (!userId.HasValue || applicant.UserId != userId.Value)
                return Forbid();
        }

        if (string.IsNullOrWhiteSpace(applicant.ResumeUrl))
            return Ok(new { success = true });

        var bucket = _config["S3_BUCKET"];
        if (string.IsNullOrWhiteSpace(bucket))
            return StatusCode(500, "S3 bucket is not configured.");

        var objectKey = applicant.ResumeUrl;
        applicant.ResumeUrl = "";
        await _db.SaveChangesAsync();

        await _s3.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = bucket,
            Key = objectKey
        });

        return Ok(new { success = true });
    }

    private int? GetUserId()
    {
        var claim =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
            User.FindFirst("nameid")?.Value ??
            User.FindFirst("sub")?.Value;

        return int.TryParse(claim, out var id) ? id : null;
    }

    public class PresignUploadRequest
    {
        public string FileName { get; set; } = "";
        public string? ContentType { get; set; }
    }

    public class ConfirmResumeReplaceRequest
    {
        public string ObjectKey { get; set; } = "";
    }
}