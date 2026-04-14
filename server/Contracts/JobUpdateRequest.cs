namespace TriPowersLLC.Contracts
{
    public class JobUpdateRequest : JobCreateRequest
    {

        private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
        {
            "draft",
            "active",
            "closed"
        };

        private static string NormalizeStatus(string? status)
        {
            return string.IsNullOrWhiteSpace(status) ? "active" : status.Trim().ToLowerInvariant();
        }
    }
}
