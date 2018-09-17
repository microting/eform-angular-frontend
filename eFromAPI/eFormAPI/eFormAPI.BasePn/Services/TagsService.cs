using System;
using System.Collections.Generic;
using eFormAPI.BasePn.Abstractions;
using eFormAPI.BasePn.Infrastructure.Helpers;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Common;
using eFormAPI.BasePn.Models.Tags;
using Microsoft.Extensions.Logging;

namespace eFormAPI.BasePn.Services
{
    public class TagsService : ITagsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<TagsService> _logger;

        public TagsService(ILogger<TagsService> logger,
            IEFormCoreService coreHelper)
        {
            _logger = logger;
            _coreHelper = coreHelper;
        }

        public OperationDataResult<List<CommonDictionaryModel>> GetAllTags()
        {
            try
            {
                var core = _coreHelper.GetCore();
                var tags = core.GetAllTags(false);
                var model = new List<CommonDictionaryModel>(tags.Count);
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
                    LocaleHelper.GetString("ErrorWhileObtainTags"));
            }
        }

        public OperationResult DeleteTag(int tagId)
        {
            try
            {
                var result = _coreHelper.GetCore().TagDelete(tagId);
                return result
                    ? new OperationResult(true, LocaleHelper.GetString("TagDeletedSuccessfully"))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingTag"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingTag"));
            }
        }

        public OperationResult CreateTag(string tagName)
        {
            try
            {
                var result = _coreHelper.GetCore().TagCreate(tagName);
                return result > 0
                    ? new OperationResult(true, LocaleHelper.GetString("TagParamCreatedSuccessfully", tagName))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingParamTag", tagName));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingParamTag", tagName));
            }
        }

        public OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel)
        {
            try
            {
                var result = _coreHelper.GetCore().TemplateSetTags(requestModel.TemplateId, requestModel.TagsIds);
                return result
                    ? new OperationResult(true, LocaleHelper.GetString("TemplateTagUpdatedSuccessfully"))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhileUpdatingTemplateTags"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileUpdatingTemplateTags"));
            }
        }
    }
}