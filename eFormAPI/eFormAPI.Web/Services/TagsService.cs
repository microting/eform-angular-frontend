using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormCore;
using eFormShared;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Services
{
    public class TagsService : ITagsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<TagsService> _logger;
        private readonly ILocalizationService _localizationService;

        public TagsService(ILogger<TagsService> logger,
            IEFormCoreService coreHelper,
            ILocalizationService localizationService)
        {
            _logger = logger;
            _coreHelper = coreHelper;
            _localizationService = localizationService;
        }

        public OperationDataResult<List<CommonDictionaryModel>> GetAllTags()
        {
            try
            {
                Core core = _coreHelper.GetCore();
                List<Tag> tags = core.GetAllTags(false);
                List<CommonDictionaryModel> model = new List<CommonDictionaryModel>(tags.Count);
                tags.ForEach(tag =>
                {
                    model.Add(new CommonDictionaryModel()
                    {
                        Id = tag.Id,
                        Name = tag.Name,
                    });
                });
                return new OperationDataResult<List<CommonDictionaryModel>>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainTags"));
            }
        }

        public OperationResult DeleteTag(int tagId)
        {
            try
            {
                bool result = _coreHelper.GetCore().TagDelete(tagId);
                return result
                    ? new OperationResult(true, _localizationService.GetString("TagDeletedSuccessfully"))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingTag"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingTag"));
            }
        }

        public OperationResult CreateTag(string tagName)
        {
            try
            {
                int result = _coreHelper.GetCore().TagCreate(tagName);
                return result > 0
                    ? new OperationResult(true, _localizationService.GetString("TagParamCreatedSuccessfully", tagName))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileCreatingParamTag", tagName));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileCreatingParamTag", tagName));
            }
        }

        public OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel)
        {
            try
            {
                bool result = _coreHelper.GetCore().TemplateSetTags(requestModel.TemplateId, requestModel.TagsIds);
                return result
                    ? new OperationResult(true, _localizationService.GetString("TemplateTagUpdatedSuccessfully"))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingTemplateTags"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingTemplateTags"));
            }
        }
    }
}