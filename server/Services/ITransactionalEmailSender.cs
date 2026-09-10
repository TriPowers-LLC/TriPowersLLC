namespace TriPowersLLC.Services;

public interface ITransactionalEmailSender
{
    Task<bool> SendPasswordResetAsync(
        string recipient,
        string resetUrl,
        DateTimeOffset expiresAt,
        CancellationToken cancellationToken = default);
}
