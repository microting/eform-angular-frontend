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

namespace eFormAPI.Web.Services.Mailing.CasePost;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Abstractions;
using EmailService;
using Hosting.Helpers.DbOptions;
using Infrastructure.Models;
using Infrastructure.Models.Mailing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Constants;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Mailing;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.CasePosts;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

public class CasePostService(
    ILogger<CasePostService> logger,
    IUserService userService,
    ILocalizationService localizationService,
    IEFormCoreService coreService,
    BaseDbContext context,
    IEmailService emailService,
    IDbOptions<EmailSettings> emailSettings)
    : ICasePostService, ICasePostBaseService
{
    public async Task<OperationDataResult<CasePostsListModel>> GetAllPosts(
        CasePostsRequest requestModel)
    {
        try
        {
            var core = await coreService.GetCore();
            var language = await userService.GetCurrentUserLanguage();
            var casePostsListModel = new CasePostsListModel();
            var casePostsQuery = context.CasePosts.AsQueryable();

            casePostsQuery = QueryHelper.AddSortToQuery(casePostsQuery, requestModel.Sort, requestModel.IsSortDsc);

            casePostsQuery = casePostsQuery
                .Where(x => x.CaseId == requestModel.CaseId);

            casePostsListModel.Total = await casePostsQuery.CountAsync();

            casePostsQuery = casePostsQuery
                .Skip(requestModel.Offset)
                .Take(requestModel.PageSize);

            var templateDto = await core.TemplateItemRead(requestModel.TemplateId, language);
            var caseDto = await core.CaseLookupCaseId(requestModel.CaseId);
            if (caseDto?.MicrotingUId == null || caseDto.CheckUId == null)
            {
                throw new InvalidOperationException("caseDto not found");
            }

            var replyElement = await core.CaseRead((int)caseDto.MicrotingUId, (int)caseDto.CheckUId, language).ConfigureAwait(false);
            if (replyElement.DocxExportEnabled || replyElement.JasperExportEnabled)
            {
                casePostsListModel.PdfReportAvailable = true;
            }

            casePostsListModel.CaseId = requestModel.CaseId;
            casePostsListModel.CaseDoneAt = replyElement.DoneAt;

            var casePostList = await casePostsQuery
                .Select(x => new CasePostModel()
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    Text = x.Text,
                    Date = x.PostDate,
                    From = context.Users
                        .Where(y => y.Id == x.CreatedByUserId)
                        .Select(y => $"{y.FirstName} {y.LastName}")
                        .FirstOrDefault(),
                    ToRecipients = x.Recipients
                        .Select(y => $"{y.EmailRecipient.Name} ({y.EmailRecipient.Email})")
                        .ToList(),
                    ToRecipientsTags = x.Tags
                        .Select(y => y.EmailTag.Name)
                        .ToList()

                }).ToListAsync();

            await using var dbContext = core.DbContextHelper.GetDbContext();
            var caseEntity = await dbContext.Cases
                .AsNoTracking()
                .Include(x => x.Site)
                .SingleOrDefaultAsync(x => x.Id == requestModel.CaseId);

            if (caseEntity == null)
            {
                return new OperationDataResult<CasePostsListModel>(
                    false,
                    localizationService.GetString("CaseNotFound"));
            }

            if (caseEntity.Site?.MicrotingUid != null)
            {
                var site = await core.SiteRead((int)caseEntity.Site.MicrotingUid);
                casePostsListModel.WorkerName = site.SiteName;
            }

            casePostsListModel.EFormName = templateDto.Label;

            if (templateDto.Field1 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field1.Label,
                        Value = caseEntity.FieldValue1 == "null" ? "" : caseEntity.FieldValue1
                    });
            }

            if (templateDto.Field2 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field2.Label,
                        Value = caseEntity.FieldValue2 == "null" ? "" : caseEntity.FieldValue2
                    });
            }

            if (templateDto.Field3 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field3.Label,
                        Value = caseEntity.FieldValue3 == "null" ? "" : caseEntity.FieldValue3
                    });
            }

            if (templateDto.Field4 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field4.Label,
                        Value = caseEntity.FieldValue4 == "null" ? "" : caseEntity.FieldValue4
                    });
            }

            if (templateDto.Field5 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field5.Label,
                        Value = caseEntity.FieldValue5 == "null" ? "" : caseEntity.FieldValue5
                    });
            }

            if (templateDto.Field6 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field6.Label,
                        Value = caseEntity.FieldValue6 == "null" ? "" : caseEntity.FieldValue6
                    });
            }

            if (templateDto.Field7 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field7.Label,
                        Value = caseEntity.FieldValue7 == "null" ? "" : caseEntity.FieldValue7
                    });
            }

            if (templateDto.Field8 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field8.Label,
                        Value = caseEntity.FieldValue8 == "null" ? "" : caseEntity.FieldValue8
                    });
            }

            if (templateDto.Field9 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field9.Label,
                        Value = caseEntity.FieldValue9 == "null" ? "" : caseEntity.FieldValue9
                    });
            }

            if (templateDto.Field10 != null)
            {
                casePostsListModel.AdditionalFields.Add(
                    new KeyValueStringModel
                    {
                        Key = templateDto.Field10.Label,
                        Value = caseEntity.FieldValue10 == "null" ? "" : caseEntity.FieldValue10
                    });
            }

            casePostsListModel.CasePostsList = casePostList;
            return new OperationDataResult<CasePostsListModel>(true, casePostsListModel);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<CasePostsListModel>(false,
                localizationService.GetString("ErrorWhileObtainingPosts"));
        }
    }

    public async Task<OperationDataResult<CasePostViewModel>> GetPostForView(int id)
    {
        try
        {
            var casePost = await context.CasePosts
                .Where(x => x.Id == id)
                .Select(x => new CasePostViewModel
                {
                    Id = x.Id,
                    Text = x.Text,
                    Subject = x.Subject,
                    AttachReport = x.AttachPdf,
                    AttachLinkToCase = x.LinkToCase,
                    ToRecipients = x.Recipients
                        .Select(y => $"{y.EmailRecipient.Name} ({y.EmailRecipient.Email})")
                        .ToList(),
                    ToRecipientsTags = x.Tags
                        .Select(y => y.EmailTag.Name)
                        .ToList()
                }).FirstOrDefaultAsync();

            if (casePost == null)
            {
                return new OperationDataResult<CasePostViewModel>(
                    false,
                    localizationService.GetString("PostNotFound"));
            }

            return new OperationDataResult<CasePostViewModel>(true, casePost);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<CasePostViewModel>(false,
                localizationService.GetString("ErrorWhileObtainingPostViewInfo"));
        }
    }


    public async Task<OperationResult> CreatePost(CasePostCreateModel requestModel)
    {
        //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
        //                {
        try
        {
            if (string.IsNullOrEmpty(emailSettings.Value.SendGridKey))
            {
                //transaction.Rollback();
                return new OperationResult(false,
                    localizationService.GetString("SendGridKeyShouldBeAddedToSettings"));
            }

            var casePost = new CasePost
            {
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Version = 1,
                CreatedByUserId = userService.UserId,
                UpdatedByUserId = userService.UserId,
                AttachPdf = requestModel.AttachReport,
                LinkToCase = requestModel.AttachLinkToCase,
                Text = requestModel.Text,
                Subject = requestModel.Subject,
                CaseId = requestModel.CaseId,
                PostDate = DateTime.UtcNow,
                WorkflowState = Constants.WorkflowStates.Created
            };

            await context.CasePosts.AddAsync(casePost);
            await context.SaveChangesAsync();

            foreach (var tagsId in requestModel.ToTagsIds)
            {
                var casePostEmailTag = new CasePostEmailTag
                {
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Version = 1,
                    CreatedByUserId = userService.UserId,
                    UpdatedByUserId = userService.UserId,
                    CasePostId = casePost.Id,
                    EmailTagId = tagsId,
                    WorkflowState = Constants.WorkflowStates.Created
                };

                await context.CasePostEmailTags.AddAsync(casePostEmailTag);
            }

            foreach (var recipientId in requestModel.ToRecipientsIds)
            {
                var casePostEmailRecipient = new CasePostEmailRecipient()
                {
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Version = 1,
                    CreatedByUserId = userService.UserId,
                    UpdatedByUserId = userService.UserId,
                    CasePostId = casePost.Id,
                    EmailRecipientId = recipientId,
                    WorkflowState = Constants.WorkflowStates.Created
                };

                await context.CasePostEmailRecipients.AddAsync(casePostEmailRecipient);
            }

            await context.SaveChangesAsync();

            // Send email
            var currentUser = await userService.GetCurrentUserAsync();

            var casePostRecipientResult = await context.CasePosts
                .AsNoTracking()
                .Where(x => x.Id == casePost.Id)
                .Select(x => new
                {
                    Recipients = x.Recipients
                        .Select(y => y.EmailRecipient)
                        .ToList(),
                    EmailTags = x.Tags
                        .Select(y => y.EmailTagId)
                        .ToList()
                })
                .FirstOrDefaultAsync();

            var emailTagsRecipients = await context.EmailTagRecipients
                .Where(x => casePostRecipientResult.EmailTags.Contains(x.EmailTagId))
                .Select(x => x.EmailRecipient)
                .ToListAsync();

            var recipients = new List<EmailRecipient>();
            recipients.AddRange(casePostRecipientResult.Recipients);
            recipients.AddRange(emailTagsRecipients);

            var core = await coreService.GetCore();
            var caseDto = await core.CaseLookupCaseId(casePost.CaseId);
            if (caseDto?.MicrotingUId == null || caseDto.CheckUId == null)
            {
                //transaction.Rollback();
                throw new InvalidOperationException("caseDto not found");
            }
            var language = await userService.GetCurrentUserLanguage();
            var replyElement = await core.CaseRead((int)caseDto.MicrotingUId, (int)caseDto.CheckUId, language).ConfigureAwait(false);
            var assembly = Assembly.GetExecutingAssembly();
            var assemblyName = assembly.GetName().Name;
            var stream = assembly.GetManifestResourceStream($"{assemblyName}.Resources.Email.html");
            string html;
            if (stream == null)
            {
                //transaction.Rollback();
                throw new InvalidOperationException("Resource not found");
            }
            using (var reader = new StreamReader(stream, Encoding.UTF8))
            {
                html = await reader.ReadToEndAsync();
            }

            if (casePost.LinkToCase)
            {
                html = html
                    .Replace("{{link}}",
                        $"{await core.GetSdkSetting(Settings.httpServerAddress)}/cases/edit/{casePost.CaseId}/{caseDto.CheckListId}")
                    .Replace("{{text}}", casePost.Text);
            }
            else
            {
                html = casePost.Text;
            }

            foreach (var recipient in recipients
                         .Where(r => r.WorkflowState != Constants.WorkflowStates.Removed)
                         .GroupBy(x => new { x.Email, x.Name })
                         .Select(x => x.Key)
                         .ToList())
            {
                if (casePost.AttachPdf)
                {
                    try
                    {
                        // Fix for broken SDK not handling empty customXmlContent well
                        var customXmlContent = new XElement("FillerElement",
                            new XElement("InnerElement", "SomeValue")).ToString();

                        // get report file
                        var filePath = await core.CaseToPdf(
                            casePost.CaseId,
                            replyElement.Id.ToString(),
                            DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                            $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" +
                            "api/template-files/get-image/",
                            "pdf",
                            customXmlContent, language);

                        if (!File.Exists(filePath))
                        {
                            throw new Exception("Error while creating report file");
                        }

                        await emailService.SendFileAsync(
                            EformEmailConst.FromEmail,
                            $"{currentUser.FirstName} {currentUser.LastName}",
                            string.IsNullOrEmpty(casePost.Subject) ? "-" : casePost.Subject,
                            recipient.Email,
                            filePath,
                            html: html);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        await emailService.SendAsync(
                            EformEmailConst.FromEmail,
                            $"{currentUser.FirstName} {currentUser.LastName}",
                            string.IsNullOrEmpty(casePost.Subject) ? "-" : casePost.Subject,
                            recipient.Email,
                            html: html);
                    }
                }
                else
                {
                    await emailService.SendAsync(
                        EformEmailConst.FromEmail,
                        $"{currentUser.FirstName} {currentUser.LastName}",
                        string.IsNullOrEmpty(casePost.Subject) ? "-" : casePost.Subject,
                        recipient.Email,
                        html: html);
                }
            }

            //transaction.Commit();
            return new OperationResult(
                true,
                localizationService.GetString("PostCreatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileCreatingPost"));
        }
        //}
    }

    public async Task<OperationDataResult<CasePostsCommonModel>> GetCommonPosts(CasePostsRequestCommonModel requestModel)
    {
        try
        {
            var casePostsListModel = new CasePostsCommonModel();
            var casePostsQuery = context.CasePosts
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsQueryable();

            if (requestModel.CaseId != null)
            {
                casePostsQuery = casePostsQuery
                    .Where(x => x.CaseId == requestModel.CaseId);
            }

            if (requestModel.TemplateId != null)
            {
                var core = await coreService.GetCore();
                await using var microtingDbContext = core.DbContextHelper.GetDbContext();
                var casesIds = await microtingDbContext.Cases
                    .Where(x => x.CheckListId == requestModel.TemplateId)
                    .Select(x => x.Id)
                    .ToListAsync();

                casePostsQuery = casePostsQuery
                    .Where(x => casesIds.Contains(x.CaseId));
            }

            casePostsListModel.Total = await casePostsQuery.CountAsync();

            casePostsQuery = casePostsQuery
                .Skip(requestModel.Offset)
                .Take(requestModel.PageSize);

            casePostsListModel.Entities = await casePostsQuery
                .Select(x => new CasePostCommonModel()
                {
                    CaseId = x.CaseId,
                    PostId = x.Id,
                    Subject = x.Subject,
                    Text = x.Text,
                    PostDate = x.PostDate,
                    ToRecipients = x.Recipients
                        .Select(y => $"{y.EmailRecipient.Name} ({y.EmailRecipient.Email})")
                        .ToList(),
                    ToRecipientsTags = x.Tags
                        .Select(y => y.EmailTag.Name)
                        .ToList()
                }).ToListAsync();

            return new OperationDataResult<CasePostsCommonModel>(
                true,
                casePostsListModel);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<CasePostsCommonModel>(
                false,
                localizationService.GetString("ErrorWhileObtainingPosts"));
        }
    }
}