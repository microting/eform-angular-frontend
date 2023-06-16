namespace eFormAPI.Web.Services.Mailing.EmailService;

using System.Threading.Tasks;

public interface IEmailService
{
    Task SendAsync(
        string fromEmail,
        string fromName,
        string subject,
        string to,
        string text = null,
        string html = null);

    Task SendFileAsync(
        string fromEmail,
        string fromName,
        string subject,
        string to,
        string fileName,
        string text = null, string html = null);
}