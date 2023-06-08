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
namespace eFormAPI.Web.Controllers.Mailing;

using System.Threading.Tasks;
using Infrastructure.Models.Mailing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Services.Mailing.EmailRecipients;

[Authorize]
public class EmailRecipientsController : Controller
{
    private readonly IEmailRecipientsService _emailRecipientsService;

    public EmailRecipientsController(IEmailRecipientsService emailRecipientsService)
    {
        _emailRecipientsService = emailRecipientsService;
    }

    [HttpPost]
    [Route("api/email-recipients/index")]
    public async Task<OperationDataResult<Paged<EmailRecipientModel>>> GetEmailRecipients([FromBody]EmailRecipientsRequestModel requestModel)
    {
        return await _emailRecipientsService.GetEmailRecipients(requestModel);
    }

    [HttpPost]
    [Route("api/email-recipients")]
    public async Task<OperationResult> CreateEmailRecipients([FromBody] EmailRecipientsCreateModel model)
    {
        return await _emailRecipientsService.CreateEmailRecipient(model);
    }

    [HttpPut]
    [Route("api/email-recipients")]
    public async Task<OperationResult> UpdateEmailTag([FromBody] EmailRecipientUpdateModel model)
    {
        return await _emailRecipientsService.UpdateEmailRecipient(model);
    }

    [HttpDelete]
    [Route("api/email-recipients/{id}")]
    public async Task<OperationResult> DeleteEmailRecipient(int id)
    {
        return await _emailRecipientsService.DeleteEmailRecipient(id);
    }

    [HttpGet]
    [Route("api/email-recipients/common")]
    public async Task<OperationDataResult<EmailRecipientTagCommonModel[]>> GetEmailRecipientsAndTags()
    {
        return await _emailRecipientsService.GetEmailRecipientsAndTags();
    }

    [HttpGet]
    [Route("api/email-recipients/simple")]
    public async Task<OperationDataResult<CommonDictionaryModel[]>> GetSimpleEmailRecipients()
    {
        return await _emailRecipientsService.GetSimpleEmailRecipients();
    }
}