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

namespace eFormAPI.Web.Services.Mailing.EmailRecipients;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using Infrastructure.Models.Mailing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Constants;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Mailing;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

public class EmailRecipientsService(
    ILogger<EmailRecipientsService> logger,
    IUserService userService,
    ILocalizationService localizationService,
    BaseDbContext dbContext)
    : IEmailRecipientsService
{
    public async Task<OperationDataResult<Paged<EmailRecipientModel>>> GetEmailRecipients(
        EmailRecipientsRequestModel requestModel)
    {
        try
        {
            var emailRecipientsModel = new Paged<EmailRecipientModel>();
            var emailRecipientsQuery = dbContext.EmailRecipients
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsQueryable();

            emailRecipientsQuery = QueryHelper.AddSortToQuery(emailRecipientsQuery, requestModel.Sort, requestModel.IsSortDsc);

            // Tag ids
            if (requestModel.TagIds.Any())
            {
                emailRecipientsQuery = emailRecipientsQuery
                    .Where(x => x.TagRecipients
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Any(y => requestModel.TagIds.Contains(y.EmailTagId)));
            }

            emailRecipientsModel.Total = await emailRecipientsQuery.Select(x => x.Id).CountAsync();

            emailRecipientsQuery = emailRecipientsQuery
                .Skip(requestModel.Offset)
                .Take(requestModel.PageSize);

            var emailRecipientList = await AddSelectToEmailRecipientsQuery(emailRecipientsQuery)
                .ToListAsync();

            emailRecipientsModel.Entities = emailRecipientList;

            return new OperationDataResult<Paged<EmailRecipientModel>>(
                true,
                emailRecipientsModel);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<Paged<EmailRecipientModel>>(false,
                localizationService.GetString("ErrorWhileObtainingEmailRecipients"));
        }
    }

    public async Task<OperationResult> UpdateEmailRecipient(
        EmailRecipientUpdateModel requestModel)
    {
        //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
//                {
        try
        {
            var emailRecipient = await dbContext.EmailRecipients
                .Include(x => x.TagRecipients)
                .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

            if (emailRecipient == null)
            {
                //transaction.Rollback();
                return new OperationResult(false,
                    localizationService.GetString("EmailRecipientNotFound"));
            }

            emailRecipient.Name = requestModel.Name;
            emailRecipient.Email = requestModel.Email.Replace(" ", "");
            emailRecipient.UpdatedAt = DateTime.UtcNow;
            emailRecipient.UpdatedByUserId = userService.UserId;

            // Tags
            var tagIds = emailRecipient.TagRecipients
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => x.EmailTagId)
                .ToList();

            var tagsForDelete = emailRecipient.TagRecipients
                .Where(x => !requestModel.TagsIds.Contains(x.EmailTagId))
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .ToList();

            var tagsForCreate = requestModel.TagsIds
                .Where(x => !tagIds.Contains(x))
                .ToList();

            foreach (var tagRecipient in tagsForDelete)
            {
                dbContext.EmailTagRecipients.Remove(tagRecipient);
            }

            foreach (var tagId in tagsForCreate)
            {

                var emailTagRecipient = new EmailTagRecipient
                {
                    CreatedByUserId = userService.UserId,
                    UpdatedByUserId = userService.UserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    EmailRecipientId = emailRecipient.Id,
                    EmailTagId = tagId,
                    Version = 1
                };

                await dbContext.EmailTagRecipients.AddAsync(emailTagRecipient);
            }

            dbContext.EmailRecipients.Update(emailRecipient);
            await dbContext.SaveChangesAsync();

            //transaction.Commit();
            return new OperationResult(true,
                localizationService.GetString("EmailRecipientUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileUpdatingEmailRecipient"));
        }
        //}
    }

    public async Task<OperationResult> DeleteEmailRecipient(int id)
    {
        try
        {
            var emailRecipient = await dbContext.EmailRecipients
                .FirstOrDefaultAsync(x => x.Id == id);

            if (emailRecipient == null)
            {
                return new OperationResult(false,
                    localizationService.GetString("EmailRecipientNotFound"));
            }

            dbContext.EmailRecipients.Remove(emailRecipient);
            await dbContext.SaveChangesAsync();

            return new OperationResult(true,
                localizationService.GetString("EmailRecipientRemovedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileRemovingEmailRecipient"));
        }
    }

    public async Task<OperationResult> CreateEmailRecipient(EmailRecipientsCreateModel createModel)
    {
        //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
//                {
        try
        {
            var tagIds = new List<int>();
            // Create tags

            if (!string.IsNullOrEmpty(createModel.NewTags))
            {
                var tagNames = createModel.NewTags
                    .Replace(" ", "")
                    .Split(',');

                foreach (var tagName in tagNames)
                {
                    var emailTag = new EmailTag
                    {
                        Name = tagName,
                        CreatedAt = DateTime.UtcNow,
                        CreatedByUserId = userService.UserId,
                        UpdatedAt = DateTime.UtcNow,
                        UpdatedByUserId = userService.UserId,
                        Version = 1
                    };
                    await dbContext.EmailTags.AddAsync(emailTag);
                    await dbContext.SaveChangesAsync();
                    tagIds.Add(emailTag.Id);
                }
            }


            tagIds.AddRange(createModel.TagsIds);


            foreach (var recipientCreateModel in createModel.EmailRecipientsList)
            {
                var emailRecipient = new EmailRecipient
                {
                    Name = recipientCreateModel.Name,
                    Email = recipientCreateModel.Email.Replace(" ", ""),
                    CreatedAt = DateTime.UtcNow,
                    CreatedByUserId = userService.UserId,
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedByUserId = userService.UserId,
                    Version = 1,
                    TagRecipients = new List<EmailTagRecipient>()
                };

                // add new tags
                foreach (var tagId in tagIds)
                {
                    emailRecipient.TagRecipients.Add(
                        new EmailTagRecipient
                        {
                            CreatedAt = DateTime.UtcNow,
                            CreatedByUserId = userService.UserId,
                            UpdatedAt = DateTime.UtcNow,
                            UpdatedByUserId = userService.UserId,
                            Version = 1,
                            EmailTagId = tagId
                        });
                }

                await dbContext.EmailRecipients.AddAsync(emailRecipient);
            }

            await dbContext.SaveChangesAsync();

            //transaction.Commit();
            return new OperationResult(true,
                localizationService.GetString("EmailRecipientCreatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileCreatingEmailRecipient"));
        }
        //}
    }

    public async Task<OperationDataResult<EmailRecipientTagCommonModel[]>> GetEmailRecipientsAndTags()
    {
        try
        {
            var emailTags = await dbContext.EmailTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsNoTracking()
                .Select(x => new EmailRecipientTagCommonModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    IsTag = true
                }).ToListAsync();

            var emailRecipients = await dbContext.EmailRecipients
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsNoTracking()
                .Select(x => new EmailRecipientTagCommonModel
                {
                    Id = x.Id,
                    Name = $"{x.Name} ({x.Email})",
                    IsTag = false
                }).ToListAsync();

            var result = new List<EmailRecipientTagCommonModel>();
            result.AddRange(emailTags);
            result.AddRange(emailRecipients);

            return new OperationDataResult<EmailRecipientTagCommonModel[]>(
                true,
                result.OrderBy(x => x.Name).ToArray());
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<EmailRecipientTagCommonModel[]>(false,
                localizationService.GetString("ErrorWhileObtainingEmailRecipients"));
        }
    }

    public async Task<OperationDataResult<CommonDictionaryModel[]>> GetSimpleEmailRecipients()
    {
        try
        {
            var emailRecipients = await dbContext.EmailRecipients
                .AsNoTracking()
                .Select(x => new CommonDictionaryModel
                {
                    Id = x.Id,
                    Name = $"{x.Name} ({x.Email})"
                }).ToListAsync();

            return new OperationDataResult<CommonDictionaryModel[]>(
                true,
                emailRecipients.ToArray());
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<CommonDictionaryModel[]>(false,
                localizationService.GetString("ErrorWhileObtainingEmailRecipients"));
        }
    }

    private IQueryable<EmailRecipientModel> AddSelectToEmailRecipientsQuery(IQueryable<EmailRecipient> query)
    {
        return query.Select(x => new EmailRecipientModel()
        {
            Id = x.Id,
            Name = x.Name,
            Email = x.Email,
            Tags = x.TagRecipients
                .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(u => new EmailRecipientTagModel
                {
                    Id = u.EmailTag.Id,
                    Name = u.EmailTag.Name
                }).ToList()
        });
    }
}