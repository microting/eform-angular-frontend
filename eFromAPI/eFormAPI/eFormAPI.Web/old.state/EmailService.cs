//using System.Configuration;
//using System.Net;
//using System.Net.Mail;
//using System.Threading.Tasks;

//namespace eFormAPI.Web.Infrastructure.Services
//{
//    public class EmailService : IIdentityMessageService
//    {
//        public Task SendAsync(IdentityMessage message)
//        {
//            int.TryParse(ConfigurationManager.AppSettings["email:smtpPort"], out int port);
//            var userName = ConfigurationManager.AppSettings["email:login"];
//            var password = ConfigurationManager.AppSettings["email:password"];
//            var smtp = new SmtpClient
//            {
//                Host = ConfigurationManager.AppSettings["email:smtpHost"],
//                Port = port,
//                EnableSsl = true,
//                DeliveryMethod = SmtpDeliveryMethod.Network,
//                UseDefaultCredentials = false,
//                Credentials = new NetworkCredential(userName, password)
//            };
//            using (var mailMessage = new MailMessage(userName, message.Destination))
//            {
//                mailMessage.Subject = message.Subject;
//                mailMessage.Body = message.Body;
//                mailMessage.IsBodyHtml = true;
//                smtp.Send(mailMessage);
//            }
//            return Task.FromResult(0);
//        }
//    }
//}