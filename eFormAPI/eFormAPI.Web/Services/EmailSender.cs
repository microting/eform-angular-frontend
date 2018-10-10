using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

namespace eFormAPI.Web.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<EmailSettings> _options;

        public EmailSender(IOptions<EmailSettings> options)
        {
            _options = options;
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var port = _options.Value.SmtpPort;
            var userName = _options.Value.Login;
            var password =  _options.Value.Password;
            var smtp = new SmtpClient
            {
                Host =  _options.Value.SmtpHost,
                Port = port,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(userName, password)
            };
            using (var mailMessage = new MailMessage(userName, email))
            {
                mailMessage.Subject = subject;
                mailMessage.Body = htmlMessage;
                mailMessage.IsBodyHtml = true;
                smtp.Send(mailMessage);
            }
            return Task.FromResult(0);
        }
    }
}