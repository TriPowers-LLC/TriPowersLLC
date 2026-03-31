using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    private readonly IAmazonS3 _s3;
    private readonly IConfiguration _config;

    public UploadsController(IAmazonS3 s3, IConfiguration config)
    {
        _s3 = s3;
        _config = config;
    }

    [HttpPost("presign")]
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

    public class PresignUploadRequest
    {
        public string FileName { get; set; } = "";
        public string? ContentType { get; set; }
    }
}