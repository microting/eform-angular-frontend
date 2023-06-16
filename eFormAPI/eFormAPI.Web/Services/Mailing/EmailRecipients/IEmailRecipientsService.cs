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
namespace eFormAPI.Web.Services.Mailing.EmailRecipients;

using System.Threading.Tasks;
using Infrastructure.Models.Mailing;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

public interface IEmailRecipientsService
{
    Task<OperationDataResult<Paged<EmailRecipientModel>>> GetEmailRecipients(
        EmailRecipientsRequestModel requestModel);
    Task<OperationResult> UpdateEmailRecipient(
        EmailRecipientUpdateModel requestModel);
    Task<OperationResult> DeleteEmailRecipient(int id);
    Task<OperationResult> CreateEmailRecipient(EmailRecipientsCreateModel createModel);
    Task<OperationDataResult<EmailRecipientTagCommonModel[]>> GetEmailRecipientsAndTags();
    Task<OperationDataResult<CommonDictionaryModel[]>> GetSimpleEmailRecipients();
}