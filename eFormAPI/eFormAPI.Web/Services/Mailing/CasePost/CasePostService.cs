/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
namespace eFormAPI.Web.Services.Mailing.CasePost
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Database;
    using Infrastructure.Database.Entities.Mailing;
    using Infrastructure.Models.Mailing;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class CasePostService : ICasePostService
    {
        private readonly ILogger<CasePostService> _logger;
        private readonly IUserService _userService;
        private readonly ILocalizationService _localizationService;
        private readonly BaseDbContext _dbContext;

        public CasePostService(
            ILogger<CasePostService> logger,
            IUserService userService,
            ILocalizationService localizationService,
            BaseDbContext dbContext)
        {
            _logger = logger;
            _userService = userService;
            _localizationService = localizationService;
            _dbContext = dbContext;
        }

        public async Task<OperationDataResult<CasePostsListModel>> GetAllPosts(
            CasePostsRequest requestModel)
        {
            try
            {

                var casePostsListModel = new CasePostsListModel();
                var casePostsQuery = _dbContext.CasePosts.AsQueryable();
                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        casePostsQuery = casePostsQuery
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        casePostsQuery = casePostsQuery
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    casePostsQuery = casePostsQuery
                        .OrderBy(x => x.Id);
                }

                if (requestModel.CaseId != null)
                {
                    casePostsQuery = casePostsQuery
                        .Where(x => x.CaseId == requestModel.CaseId);
                }

                if (requestModel.TemplateId != null)
                {
                    casePostsQuery = casePostsQuery
                        .Where(x => x.TemplateId == requestModel.TemplateId);
                }

                casePostsListModel.Total = await casePostsQuery.CountAsync();

                casePostsQuery = casePostsQuery
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize);

                var casePostList = await casePostsQuery
                    .Select(x => new CasePostModel()
                    {
                        Id = x.Id,
                        Subject = x.Subject,
                        Text = x.Text,
                        Date = x.PostDate,
                        // TODO add fields
                    }).ToListAsync();

                casePostsListModel.CasePostsList = casePostList;

                return new OperationDataResult<CasePostsListModel>(true, casePostsListModel);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<CasePostsListModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationDataResult<CasePostViewModel>> GetPostForView(
            int id)
        {
            try
            {
                var casePost = await _dbContext.CasePosts
                    .Where(x => x.Id == id)
                    .Select(x => new CasePostViewModel
                    {
                        Id = x.Id,
                        Text = x.Text,
                        Subject = x.Subject,
                        AttachReport = x.AttachPdf,
                        AttachLinkToCase = x.LinkToCase,
                        ToRecipients = x.Recipients
                            .Select(y => y.EmailRecipient.Name)
                            .ToList(),
                        ToRecipientsTags = x.Tags
                            .Select(y => y.EmailTag.Name)
                            .ToList(),
                        // TODO add fields
                    }).FirstOrDefaultAsync();

                if (casePost == null)
                {
                    return new OperationDataResult<CasePostViewModel>(
                        false,
                        _localizationService.GetString(""));
                }

                return new OperationDataResult<CasePostViewModel>(true, casePost);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<CasePostViewModel>(false,
                    _localizationService.GetString(""));
            }
        }


        public async Task<OperationResult> CreatePost(
            CasePostCreateModel requestModel)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var casePost = new CasePost
                    {
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        Version = 1,
                        CreatedByUserId = _userService.UserId,
                        UpdatedByUserId = _userService.UserId,
                        AttachPdf = requestModel.AttachReport,
                        LinkToCase = requestModel.AttachLinkToCase,
                        Text = requestModel.Text,
                        Subject = requestModel.Subject,
                        CaseId = requestModel.CaseId,
                        TemplateId = requestModel.TemplateId,
                        PostDate = DateTime.UtcNow,
                    };

                    await _dbContext.CasePosts.AddAsync(casePost);
                    await _dbContext.SaveChangesAsync();

                    foreach (var tagsId in requestModel.ToTagsIds)
                    {
                        var casePostEmailTag = new CasePostEmailTag
                        {
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            Version = 1,
                            CreatedByUserId = _userService.UserId,
                            UpdatedByUserId = _userService.UserId,
                            CasePostId = casePost.Id,
                            EmailTagId = tagsId,
                        };

                        await _dbContext.CasePostEmailTags.AddAsync(casePostEmailTag);
                    }

                    foreach (var recipientId in requestModel.ToRecipientsIds)
                    {
                        var casePostEmailRecipient = new CasePostEmailRecipient()
                        {
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            Version = 1,
                            CreatedByUserId = _userService.UserId,
                            UpdatedByUserId = _userService.UserId,
                            CasePostId = casePost.Id,
                            EmailRecipientId = recipientId,
                        };

                        await _dbContext.CasePostEmailRecipients.AddAsync(casePostEmailRecipient);
                    }

                    await _dbContext.SaveChangesAsync();

                    transaction.Commit();
                    return new OperationResult(true,
                        _localizationService.GetString(""));
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    _logger.LogError(e.Message);
                    transaction.Rollback();
                    return new OperationResult(false,
                        _localizationService.GetString(""));
                }
            }
        }
    }
}