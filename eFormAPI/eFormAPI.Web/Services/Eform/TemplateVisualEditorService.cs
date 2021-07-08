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
    using Microting.eForm.Infrastructure.Data.Entities;
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
                    .Where(x => x.Id == id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new EformVisualEditorModel
                    {
                        Id = x.Id,
                        Position = 0,
                        Translations = x.Translations.Select(y =>
                                new CommonTranslationsModel
                                {
                                    Name = y.Text,
                                    Description = y.Description,
                                    Id = y.Id,
                                    LanguageId = y.LanguageId,
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
            try
            {
                var core = await _coreHelper.GetCore();
                var sdkDbContext = core.DbContextHelper.GetDbContext();

                // create main checkList
                var newCheckList = new CheckList
                {
                    Color = model.Color,
                    DisplayIndex = 0,
                    Repeated = 1,
                    ReviewEnabled = 0,
                    ManualSync = 0,
                    ExtraFieldsEnabled = 0,
                    DoneButtonEnabled = 0,
                    ApprovalEnabled = 0,
                    MultiApproval = 0,
                    FastNavigation = 0,
                    DownloadEntities = 0,
                    QuickSyncEnabled = 0,
                };
                await newCheckList.Create(sdkDbContext);

                // create empty checkList
                var emptyCheckList = new CheckList
                {
                    Color = model.Color,
                    DisplayIndex = 0,
                    ParentId = newCheckList.Id,
                    ReviewEnabled = 0,
                    ExtraFieldsEnabled = 0,
                    DoneButtonEnabled = 0,
                    ApprovalEnabled = 0,
                };
                await emptyCheckList.Create(sdkDbContext);

                // create translations to eform
                foreach (var translation in model.Translations)
                {
                    var newCheckListTranslation = new CheckListTranslation
                    {
                        CheckListId = newCheckList.Id,
                        LanguageId = translation.LanguageId,
                        Text = translation.Name,
                        Description = translation.Description
                    };
                    var emptyCheckListTranslation = new CheckListTranslation
                    {
                        CheckListId = emptyCheckList.Id,
                        LanguageId = translation.LanguageId,
                        Text = translation.Name,
                        Description = translation.Description
                    };

                    await newCheckListTranslation.Create(sdkDbContext);
                    await emptyCheckListTranslation.Create(sdkDbContext);
                }

                // add tags to eform
                foreach (var tag in model.TagIds.Select(tagId => new Tagging { CheckListId = newCheckList.Id, TagId = tagId }))
                {
                    await tag.Create(sdkDbContext);
                }

                // add fields to eform
                await CreateFields(newCheckList.Id, sdkDbContext, model.Fields);

                return new OperationResult(true,
                    _localizationService.GetString("EformSuccessfullyCreated"));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<EformVisualEditorModel>(false,
                    _localizationService.GetString("ErrorWhileCreateEform"));
            }
        }

        public async Task<OperationResult> UpdateVisualTemplate(EformVisualEditorModel model)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var sdkDbContext = core.DbContextHelper.GetDbContext();
                var dbEform = await sdkDbContext.CheckLists
                    .Where(x => x.Id == model.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Include(x => x.Fields)
                    .Include(x => x.Taggings)
                    .Include(x => x.Translations)
                    .FirstOrDefaultAsync();

                if (dbEform == null)
                {
                    return new OperationDataResult<EformVisualEditorModel>(false,
                        _localizationService.GetString("EformNotFound"));
                }

                var fieldIdForDelete = dbEform.Fields
                    .Select(x => x.Id)
                    .Where(id => !model.Fields.Select(y => y.Id).Contains(id))
                    .ToList();

                var fieldForCreate = model.Fields
                    .Where(x => x.Id == null)
                    .ToList();

                // delete removed field
                await DeleteFields(fieldIdForDelete, sdkDbContext);

                // create new field
                await CreateFields(dbEform.Id, sdkDbContext, fieldForCreate);

                //tagging

                var tagsIdForDelete = dbEform.Taggings
                    .Select(x => x.Id)
                    .Where(id => !model.TagIds.Contains(id))
                    .ToList();

                foreach (var tagId in tagsIdForDelete)
                {
                    var tagging = await sdkDbContext.Taggings
                        .Where(x => x.TagId == tagId && x.CheckListId == dbEform.Id)
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .FirstOrDefaultAsync();
                    if (tagging != null)
                    {
                        await tagging.Delete(sdkDbContext);
                    }
                }

                var tagsForCreate = model.TagIds
                    .Where(id => !dbEform.Taggings.Select(x => x.Id).Contains(id))
                    .ToList();

                foreach (var tagId in tagsForCreate)
                {
                    var tagging = new Tagging
                    {
                        CheckListId = dbEform.Id,
                        TagId = tagId,
                    };
                    await tagging.Create(sdkDbContext);
                }

                return new OperationResult(true,
                    _localizationService.GetString("EformSuccessfullyUpdated"));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<EformVisualEditorModel>(false,
                    _localizationService.GetString("ErrorWhileUpdateEform"));
            }
        }

        private static async Task DeleteFields(List<int> fieldIdForDelete, MicrotingDbContext sdkDbContext)
        {

            foreach (var fieldId in fieldIdForDelete)
            {
                var fieldForDelete = await sdkDbContext.Fields
                    .Where(x => x.Id == fieldId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Include(x => x.Translations)
                    .FirstOrDefaultAsync();
                foreach (var translate in fieldForDelete.Translations)
                {
                    await translate.Delete(sdkDbContext);
                }

                var fieldType = await sdkDbContext.FieldTypes
                    .Where(x => x.Id == fieldForDelete.FieldTypeId)
                    .Select(x => x.Type)
                    .FirstAsync();

                switch (fieldType)
                {
                    case Constants.FieldTypes.SingleSelect or Constants.FieldTypes.MultiSelect:
                        {
                            var options = sdkDbContext.FieldOptions
                                .Where(x => x.FieldId == fieldId)
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Include(x => x.FieldOptionTranslations)
                                .ToList();
                            foreach (var optionTranslation in options.SelectMany(x => x.FieldOptionTranslations).ToList())
                            {
                                await optionTranslation.Delete(sdkDbContext);
                            }

                            foreach (var fieldOption in options)
                            {
                                await fieldOption.Delete(sdkDbContext);
                            }

                            break;
                        }
                    case Constants.FieldTypes.FieldGroup:
                        {
                            var fieldIds = await sdkDbContext.Fields
                                .Where(x => x.ParentFieldId == fieldForDelete.Id)
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Select(x => x.Id)
                                .ToListAsync();
                            await DeleteFields(fieldIds, sdkDbContext);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }

                await fieldForDelete.Delete(sdkDbContext);
            }
        }

        private static async Task<List<VisualEditorFields>> FindFields(int eformId, MicrotingDbContext sdkDbContext, int parentFieldId = -1)
        {
            var findFields = new List<VisualEditorFields>();
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
                    Id = field.Id,
                    Color = field.Color,
                    FieldType = (int)field.FieldTypeId,
                    Position = (int)field.DisplayIndex,
                    Translations = field.Translations.Select(x =>
                        new CommonTranslationsModel
                        {
                            Id = x.LanguageId,
                            Description = x.Description,
                            Name = x.Text,
                            LanguageId = x.LanguageId,
                        }).ToList(),
                    Mandatory = Convert.ToBoolean(field.Mandatory)
                };

                switch (field.FieldType.Type)
                {
                    case Constants.FieldTypes.Number or Constants.FieldTypes.NumberStepper:
                        {
                            editorField.DecimalCount = (int)field.DecimalCount;
                            editorField.MinValue = long.Parse(field.MinValue);
                            editorField.MaxValue = long.Parse(field.MaxValue);
                            editorField.Value = long.Parse(field.DefaultValue);
                            findFields.Add(editorField);
                            break;
                        }
                    case Constants.FieldTypes.SaveButton:
                        {
                            editorField.Value = field.DefaultValue;
                            findFields.Add(editorField);
                            break;
                        }
                    case Constants.FieldTypes.FieldGroup:
                        {
                            var fieldsInGroups = await FindFields(eformId, sdkDbContext, field.Id);
                            editorField.Fields = fieldsInGroups;
                            findFields.Add(editorField);
                            break;
                        }
                    case Constants.FieldTypes.Date:
                        {
                            editorField.MinValue = DateTime.Parse(field.MinValue);
                            editorField.MaxValue = DateTime.Parse(field.MaxValue);
                            findFields.Add(editorField);
                            break;
                        }
                    case Constants.FieldTypes.SingleSelect or Constants.FieldTypes.MultiSelect:
                        {
                            editorField.Options = sdkDbContext.FieldOptions
                                .Where(x => x.FieldId == field.Id)
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Include(x => x.FieldOptionTranslations)
                                .Select(x =>
                                    new FieldOptions
                                    {
                                        DisplayOrder = int.Parse(x.DisplayOrder),
                                        Id = x.Id,
                                        Key = int.Parse(x.Key),
                                        Selected = x.Selected,
                                        Translates = x.FieldOptionTranslations
                                            .Select(y =>
                                                new CommonTranslationsModel
                                                {
                                                    Id = y.Id,
                                                    Name = y.Text,
                                                    LanguageId = y.LanguageId
                                                }).ToList()
                                    })
                                .ToList();
                            findFields.Add(editorField);
                            break;
                        }
                    default:
                        {
                            findFields.Add(editorField);
                            break;
                        }
                }
            }

            return findFields;
        }

        private static async Task CreateFields(int eformId, MicrotingDbContext sdkDbContext,
            List<VisualEditorFields> fieldsList, int? parentFieldId = null)
        {
            foreach (var field in fieldsList)
            {
                var dbField = new Field
                {
                    CheckListId = eformId,
                    Color = field.Color,
                    FieldTypeId = field.FieldType,
                    DecimalCount = field.DecimalCount,
                    DefaultValue = field.Value,
                    DisplayIndex = field.Position,
                    MaxValue = field.MaxValue,
                    MinValue = field.MinValue,
                    Mandatory = Convert.ToInt16(field.Mandatory),
                    ParentFieldId = parentFieldId,
                };
                await dbField.Create(sdkDbContext);

                var fieldType = await sdkDbContext.FieldTypes
                    .Where(x => x.Id == field.FieldType)
                    .Select(x => x.Type)
                    .FirstAsync();

                switch (fieldType)
                {
                    case Constants.FieldTypes.SingleSelect or Constants.FieldTypes.MultiSelect:
                        {
                            var optionsForCreate = field.Options.Select(x =>
                                    new FieldOption
                                    {
                                        FieldId = dbField.Id,
                                        Selected = x.Selected,
                                        DisplayOrder = x.DisplayOrder.ToString(),
                                        Key = x.Key.ToString(),
                                        FieldOptionTranslations = x.Translates
                                            .Select(y =>
                                                new FieldOptionTranslation
                                                {
                                                    LanguageId = y.LanguageId,
                                                    Text = y.Name
                                                })
                                            .ToList(),
                                    })
                                .ToList();
                            foreach (var dbOption in optionsForCreate)
                            {
                                await dbOption.Create(sdkDbContext);
                                foreach (var optionTranslation in dbOption.FieldOptionTranslations)
                                {
                                    optionTranslation.FieldOptionId = dbOption.Id;
                                    await optionTranslation.Create(sdkDbContext);
                                }
                            }
                            break;
                        }
                    case Constants.FieldTypes.FieldGroup:
                        {
                            await CreateFields(eformId, sdkDbContext, field.Fields, dbField.Id);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }

                var translates = field.Translations
                    .Select(x =>
                        new FieldTranslation
                        {
                            FieldId = dbField.Id,
                            LanguageId = x.LanguageId,
                            Text = x.Name,
                            Description = x.Description,
                        }).ToList();
                foreach (var fieldTranslation in translates)
                {
                    await fieldTranslation.Create(sdkDbContext);
                }
            }
        }
    }
}
