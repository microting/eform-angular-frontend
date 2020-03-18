namespace eFormAPI.Web.Services.Mailing.CasePost
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Database;
    using Infrastructure.Models.Mailing;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;


    public class CasePostsRequest
    {
        public string Sort { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool IsSortDsc { get; set; }
        public int Offset { get; set; }
        public int TemplateId { get; set; }
        public int CaseId { get; set; }
    }

    public class CasePostsListModel
    {
        public string EFormName { get; set; }
        public string Description { get; set; }
        public string LocationName { get; set; }
        public string Status { get; set; }
        public int Total { get; set; }

        public List<CasePostModel> CasePostsList { get; set; }
            = new List<CasePostModel>();
    }

    public class CasePostModel
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string SentBy { get; set; }
        public string SentTo { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
    }

    public class CasePostViewModel
    {
        public int Id { get; set; }
        public string From { get; set; }
        public List<string> ToRecipients { get; set; }
        public List<string> ToRecipientsTags { get; set; }
        public string Title { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
        public bool AttachReport { get; set; }
    }

    public class CasePostCreateModel
    {
        public string From { get; set; }
        public List<string> ToRecipientsIds { get; set; }
        public List<string> ToTagsIds { get; set; }
        public string Title { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
        public bool AttachReport { get; set; }
    }

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
                return new OperationDataResult<CasePostsListModel>(true,
                    _localizationService.GetString(""));
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
                return new OperationDataResult<CasePostViewModel>(true,
                    _localizationService.GetString(""));
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
            try
            {
                return new OperationResult(true,
                    _localizationService.GetString(""));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString(""));
            }
        }


}

}