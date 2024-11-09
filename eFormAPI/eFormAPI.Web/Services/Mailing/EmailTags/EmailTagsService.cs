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

using Sentry;

namespace eFormAPI.Web.Services.Mailing.EmailTags;

using System;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using Infrastructure.Models.Mailing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Mailing;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

public class EmailTagsService(
    ILogger<EmailTagsService> logger,
    BaseDbContext dbContext,
    ILocalizationService localizationService,
    IUserService userService)
    : IEmailTagsService
{
    public async Task<OperationDataResult<CommonDictionaryModel[]>> GetEmailTags()
    {
        try
        {
            var emailTags = await dbContext.EmailTags
                .AsNoTracking()
                .Select(x => new CommonDictionaryModel
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync();

            return new OperationDataResult<CommonDictionaryModel[]>(
                true,
                emailTags.ToArray());
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<CommonDictionaryModel[]>(
                false,
                localizationService.GetString("ErrorWhileObtainingEmailTag"));
        }
    }
    public async Task<OperationResult> UpdateEmailTag(EmailRecipientTagModel requestModel)
    {
        try
        {
            var emailTag = await dbContext.EmailTags
                .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

            if (emailTag == null)
            {
                return new OperationResult(false,
                    localizationService.GetString("EmailTagNotFound"));
            }

            emailTag.Name = requestModel.Name;
            emailTag.UpdatedAt = DateTime.UtcNow;
            emailTag.UpdatedByUserId = userService.UserId;

            dbContext.EmailTags.Update(emailTag);
            await dbContext.SaveChangesAsync();

            return new OperationResult(true,
                localizationService.GetString("EmailTagUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileUpdatingEmailTag"));
        }
    }
    public async Task<OperationResult> DeleteEmailTag(int id)
    {
        try
        {
            var emailTag = await dbContext.EmailTags
                .FirstOrDefaultAsync(x => x.Id == id);

            if (emailTag == null)
            {
                return new OperationResult(false,
                    localizationService.GetString("EmailTagNotFound"));
            }

            dbContext.EmailTags.Remove(emailTag);
            await dbContext.SaveChangesAsync();

            return new OperationResult(true,
                localizationService.GetString("EmailTagRemovedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileRemovingEmailTag"));
        }
    }
    public async Task<OperationResult> CreateEmailTag(EmailRecipientTagModel requestModel)
    {
        try
        {
            var emailTag = new EmailTag
            {
                Name = requestModel.Name,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userService.UserId,
                UpdatedByUserId = userService.UserId,
                UpdatedAt = DateTime.UtcNow,
                Version = 1
            };

            await dbContext.EmailTags.AddAsync(emailTag);
            await dbContext.SaveChangesAsync();

            return new OperationResult(true,
                localizationService.GetString("EmailTagCreatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileCreatingEmailTag"));
        }
    }
}