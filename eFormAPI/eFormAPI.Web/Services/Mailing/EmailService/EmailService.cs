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

using Microsoft.Extensions.Logging;
using Sentry;

namespace eFormAPI.Web.Services.Mailing.EmailService;

using System;
using System.IO;
using System.Threading.Tasks;
using Hosting.Helpers.DbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using SendGrid;
using SendGrid.Helpers.Mail;

public class EmailService(IDbOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
    : IEmailService
{
    public async Task SendAsync(
        string fromEmail,
        string fromName,
        string subject,
        string to,
        string text = null,
        string html = null)
    {
        try
        {
            var client = new SendGridClient(emailSettings.Value.SendGridKey);
            var fromAddress = new EmailAddress(fromEmail.Replace(" ", ""), fromName);
            var toAddress = new EmailAddress(to.Replace(" ", ""));
            var msg = MailHelper.CreateSingleEmail(fromAddress, toAddress, subject, text, html);
            var response = await client.SendEmailAsync(msg);
            if (((int)response.StatusCode < 200) || ((int)response.StatusCode >= 300))
            {
                var responseText = await response.Body.ReadAsStringAsync();
                throw new Exception($"Status: {response.StatusCode}. Response: {responseText}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to send email message", ex);
        }
    }

    public async Task SendFileAsync(
        string fromEmail,
        string fromName,
        string subject,
        string to,
        string fileName,
        string text = null, string html = null)
    {
        try
        {
            var client = new SendGridClient(emailSettings.Value.SendGridKey);
            var fromEmailAddress = new EmailAddress(fromEmail.Replace(" ", ""), fromName);
            var toEmail = new EmailAddress(to.Replace(" ", ""));
            var msg = MailHelper.CreateSingleEmail(fromEmailAddress, toEmail, subject, text, html);
            var bytes = File.ReadAllBytes(fileName);
            var file = Convert.ToBase64String(bytes);
            msg.AddAttachment(Path.GetFileName(fileName), file);
            var response = await client.SendEmailAsync(msg);
            if (((int)response.StatusCode < 200) || ((int)response.StatusCode >= 300))
            {
                throw new Exception($"Status: {response.StatusCode}");
            }
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            throw new Exception("Failed to send email message", e);
        }
        finally
        {
            File.Delete(fileName);
        }
    }
}