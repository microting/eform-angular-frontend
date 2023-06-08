/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

namespace eFormAPI.Web.Services;

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
        var host = _options.Value.SmtpHost;

        if (string.IsNullOrEmpty(host) || port <= 0)
        {
            return Task.CompletedTask;
        }

        var smtp = new SmtpClient
        {
            Host = host,
            Port = port,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(userName, password)
        };
        if (!userName.Contains(@"@"))
        {
            if (htmlMessage.Contains("microting.com"))
            {
                userName = "no-reply@microting.com";
            }
        }
            
        using (var mailMessage = new MailMessage(userName, email))
        {
            mailMessage.Subject = subject;
            mailMessage.Body = htmlMessage;
            mailMessage.IsBodyHtml = true;
            smtp.Send(mailMessage);
        }
        return Task.CompletedTask;
    }
}