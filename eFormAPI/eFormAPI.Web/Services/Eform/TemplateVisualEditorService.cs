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

namespace eFormAPI.Web.Services.Eform
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Abstractions;
    using Abstractions.Eforms;
    using Infrastructure.Models.VisualEformEditor;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class TemplateVisualEditorService : ITemplateVisualEditorService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<TemplateVisualEditorService> _logger;
        private readonly ILocalizationService _localizationService;

        public TemplateVisualEditorService(
            IEFormCoreService coreHelper,
            ILogger<TemplateVisualEditorService> logger,
            ILocalizationService localizationService
            )
        {
            _coreHelper = coreHelper;
            _logger = logger;
            _localizationService = localizationService;
        }

        public async Task<OperationDataResult<EformVisualEditorModel>> ReadVisualTemplate(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var sdkDbContext = core.DbContextHelper.GetDbContext();
                var eform = await sdkDbContext.CheckLists
                    .Include(x => x.Translations)
                    .Include(x => x.Taggings)
                    //.Include(x => x.Fields)
                    .Where(x => x.Id == id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new EformVisualEditorModel
                    {
                        Position = 0,
                        Translates = x.Translations.Select(y =>
                                new CommonDictionaryModel
                                {
                                    Name = y.Text,
                                    Description = y.Description,
                                    Id = y.LanguageId
                                })
                            .ToList(),
                        TagIds = x.Taggings.Select(y => (int)y.TagId).ToList(),
                        Fields = new List<VisualEditorFields>(),
                    })
                    .FirstOrDefaultAsync();
                if (eform == null)
                {
                    return new OperationDataResult<EformVisualEditorModel>(false,
                        _localizationService.GetString("EformNotFound"));
                }

                // add fields
                eform.Fields = await FindFields(id, sdkDbContext);

                return new OperationDataResult<EformVisualEditorModel>(true, eform);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<EformVisualEditorModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingEform"));
            }
        }

        public async Task<OperationResult> CreateVisualTemplate(EformVisualEditorModel model)
        {
            throw new NotImplementedException();
        }

        public async Task<OperationResult> UpdateVisualTemplate(EformVisualEditorModel model)
        {
            throw new NotImplementedException();
        }

        private async Task<List<VisualEditorFields>> FindFields(int eformId, MicrotingDbContext sdkDbContext, int parentFieldId = -1)
        {
            var findetFields = new List<VisualEditorFields>();
            var fieldQuery = sdkDbContext.Fields
                .Where(x => x.CheckListId == eformId)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Include(x => x.FieldType)
                .Include(x => x.Translations)
                .AsNoTracking();
            if (parentFieldId != -1)
            {
                fieldQuery = fieldQuery.Where(x => x.ParentFieldId == parentFieldId);
            }
            var fields = await fieldQuery
                .ToListAsync();

            foreach (var field in fields)
            {
                var editorField = new VisualEditorFields
                {
                    Color = field.Color,
                    FieldType = field.FieldType.Type,
                    Position = (int) field.DisplayIndex,
                    Translates = field.Translations.Select(x =>
                        new CommonDictionaryModel
                        {
                            Id = x.LanguageId,
                            Description = x.Description,
                            Name = x.Text
                        }).ToList(),
                    Mandatory = Convert.ToBoolean(field.Mandatory)
                };

                switch (field.FieldType.Type)
                {
                    case Constants.FieldTypes.Number:
                    {
                        editorField.DecimalCount = (int) field.DecimalCount;
                        editorField.MinValue = long.Parse(field.MinValue);
                        editorField.MaxValue = long.Parse(field.MaxValue);
                        editorField.Value = long.Parse(field.DefaultValue);
                        findetFields.Add(editorField);
                        break;
                    }
                    case Constants.FieldTypes.NumberStepper:
                    {
                        editorField.DecimalCount = (int)field.DecimalCount;
                        editorField.MinValue = long.Parse(field.MinValue);
                        editorField.MaxValue = long.Parse(field.MaxValue);
                        editorField.Value = long.Parse(field.DefaultValue);
                        findetFields.Add(editorField);
                        break;
                    }
                    case Constants.FieldTypes.SaveButton:
                    {
                        editorField.Value = field.DefaultValue;
                        findetFields.Add(editorField);
                        break;
                    }
                    case Constants.FieldTypes.FieldGroup:
                    {
                        var fieldsInGroups =  await FindFields(eformId, sdkDbContext, field.Id);
                        editorField.Fields = fieldsInGroups;
                        findetFields.Add(editorField);
                        break;
                    }
                    case Constants.FieldTypes.Date:
                    {
                        editorField.MinValue = DateTime.Parse(field.MinValue);
                        editorField.MaxValue = DateTime.Parse(field.MaxValue);
                        findetFields.Add(editorField);
                        break;
                    }
                    case Constants.FieldTypes.SingleSelect:
                    {
                        editorField.Options = sdkDbContext.FieldOptions
                            .Where(x => x.FieldId == field.Id)
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Include(x => x.FieldOptionTranslations)
                            .SelectMany(x => x.FieldOptionTranslations.ToList())
                            .Select(y => new CommonDictionaryModel() { Id = y.LanguageId, Name = y.Text })
                            .ToList();
                        findetFields.Add(editorField);
                        break;
                    }
                    case Constants.FieldTypes.MultiSelect:
                    {
                        editorField.Options = sdkDbContext.FieldOptions
                            .Where(x => x.FieldId == field.Id)
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Include(x => x.FieldOptionTranslations)
                            .SelectMany(x => x.FieldOptionTranslations.ToList())
                            .Select(y => new CommonDictionaryModel() { Id = y.LanguageId, Name = y.Text })
                            .ToList();
                        findetFields.Add(editorField);
                        break;
                    }
                    default:
                    {
                        findetFields.Add(editorField);
                        break;
                    }
                }
            }

            return findetFields;
        }
    }
}
