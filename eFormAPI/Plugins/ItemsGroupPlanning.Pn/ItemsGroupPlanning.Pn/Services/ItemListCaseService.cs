using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Data.Entities;

namespace ItemsGroupPlanning.Pn.Services
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Xml.Linq;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Dto;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data.Entities;
    using Rebus.Bus;

    public class ItemListCaseService :IItemsListCaseService
    {
        private readonly ItemsGroupPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IExcelService _excelService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEFormCoreService _core;
        private readonly IRebusService _rebusService;
        private readonly IBus _bus;
        private readonly IUserService _userService;

        public ItemListCaseService(
            ItemsGroupPlanningPnDbContext dbContext,
            IUserService userService,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IExcelService excelService,
            IHttpContextAccessor httpContextAccessor, IEFormCoreService core,
            IRebusService rebusService)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _httpContextAccessor = httpContextAccessor;
            _core = core;
            _userService = userService;
            _excelService = excelService;
            _rebusService = rebusService;
            _bus = rebusService.GetBus();
        }

        public async Task<OperationDataResult<ItemsListCasePnModel>> GetSingleList(ItemListCasesPnRequestModel requestModel)
        {
            try
            {

                var newItems = (_dbContext.Items.Where(item => item.ItemListId == requestModel.ListId)
                    .Join(_dbContext.ItemCases, item => item.Id, itemCase => itemCase.ItemId,
                        (item, itemCase) => new
                        {
                            itemCase.Id,
                            item.Name,
                            item.Description,
                            item.Type,
                            item.BuildYear,
                            item.ItemNumber,
                            itemCase.Comment,
                            itemCase.Location,
                            itemCase.FieldStatus,
                            itemCase.NumberOfImages,
                            itemCase.WorkflowState,
                            itemCase.CreatedAt,
                            itemCase.MicrotingSdkCaseId,
                            itemCase.MicrotingSdkeFormId,
                            itemCase.Status
                        }));

                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        newItems = newItems
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        newItems = newItems
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    newItems = newItems
                        .OrderBy(x => x.Id);
                }


                newItems
                    = newItems
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(requestModel.Offset)
                        .Take(requestModel.PageSize);

                if (newItems.Any())
                {

                    ItemsListCasePnModel itemsListCasePnModel = new ItemsListCasePnModel();
                    itemsListCasePnModel.Items = await newItems.Select(x => new ItemsListPnItemCaseModel()
                    {
                        Id = x.Id,
                        Date = x.CreatedAt,
                        CreatedAt = x.CreatedAt,
                        Name = x.Name,
                        ItemNumber = x.ItemNumber,
                        BuildYear = x.BuildYear,
                        Description = x.Description,
                        Type = x.Type,
                        Comment = x.Comment,
                        Location = x.Location,
                        FieldStatus = x.FieldStatus,
                        NumberOfImages = x.NumberOfImages,
                        SdkCaseId = x.MicrotingSdkCaseId,
                        SdkeFormId = x.MicrotingSdkeFormId,
                        Status = x.Status
                    }).ToListAsync();

                    itemsListCasePnModel.Total = await (_dbContext.Items.Where(item => item.ItemListId == requestModel.ListId)
                        .Join(_dbContext.ItemCases, item => item.Id, itemCase => itemCase.ItemId,
                            (item, itemCase) => new
                            {
                                itemCase.Id
                            })).CountAsync();

                    return new OperationDataResult<ItemsListCasePnModel>(
                        true,
                        itemsListCasePnModel);
                }
                else
                {
                    return new OperationDataResult<ItemsListCasePnModel>(
                        false, "");
                }
            }
            catch (Exception ex)
            {
                return new OperationDataResult<ItemsListCasePnModel>(
                    false, ex.Message);
            }
        }

        public async Task<OperationDataResult<ItemListPnCaseResultListModel>> GetSingleListResults(ItemListCasesPnRequestModel requestModel)
        {
            ItemListPnCaseResultListModel itemListPnCaseResultListModel = await GetTableData(requestModel);

            return new OperationDataResult<ItemListPnCaseResultListModel>(true, itemListPnCaseResultListModel);
        }

        public async Task<OperationDataResult<FileStreamModel>> GenerateSingleListResults(
            ItemListCasesPnRequestModel requestModel)
        {
            string excelFile = null;
            try
            {
                ItemListPnCaseResultListModel reportDataResult = await GetTableData(requestModel);
                if (reportDataResult == null)
                {
                    return new OperationDataResult<FileStreamModel>(false, "ERROR");
                }

                ItemList itemList = await _dbContext.ItemLists.SingleOrDefaultAsync(x => x.Id == requestModel.ListId);

                excelFile = _excelService.CopyTemplateForNewAccount("report_template_lists");
                bool writeResult = _excelService.WriteTableToExcel(itemList.Name,itemList.Description,
                    reportDataResult,
                    requestModel,
                    excelFile);

                if (!writeResult)
                {
                    throw new Exception($"Error while writing excel file {excelFile}");
                }

                FileStreamModel result = new FileStreamModel()
                {
                    FilePath = excelFile,
                    FileStream = new FileStream(excelFile, FileMode.Open),
                };

                return new OperationDataResult<FileStreamModel>(true, result);
            }
            catch (Exception e)
            {
                if (!string.IsNullOrEmpty(excelFile) && File.Exists(excelFile))
                {
                    File.Delete(excelFile);
                }

                Trace.TraceError(e.Message);
//                _logger.LogError(e.Message);
                return new OperationDataResult<FileStreamModel>(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileGeneratingReportFile"));
            }
        }

        private async Task<ItemListPnCaseResultListModel> GetTableData(ItemListCasesPnRequestModel requestModel)
        {
            PluginConfigurationValue pluginConfigurationValue =
                await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "ItemsPlanningBaseSettings:Token");

            var itemList = await _dbContext.ItemLists.SingleOrDefaultAsync(x => x.Id == requestModel.ListId);

            List<FieldDto> allFields = await _core.GetCore().Result.Advanced_TemplateFieldReadAll(itemList.RelatedEFormId);

            int i = 0;
            List<int> toBeRemoved = new List<int>();
            foreach (FieldDto field in allFields)
            {
                if (field.FieldType == Constants.FieldTypes.SaveButton)
                {
                    toBeRemoved.Add(i);
                }

                i += 1;
            }

            foreach (int i1 in toBeRemoved)
            {
                allFields.RemoveAt(i1);
            }

            ItemListPnCaseResultListModel itemListPnCaseResultListModel = new ItemListPnCaseResultListModel();
            itemListPnCaseResultListModel.Total = 0;
            itemListPnCaseResultListModel.LabelEnabled = itemList.LabelEnabled;
            itemListPnCaseResultListModel.DescriptionEnabled = itemList.DescriptionEnabled;
            itemListPnCaseResultListModel.DeployedAtEnabled = itemList.DeployedAtEnabled;
            itemListPnCaseResultListModel.DoneAtEnabled = itemList.DoneAtEnabled;
            itemListPnCaseResultListModel.DoneByUserNameEnabled = itemList.DoneByUserNameEnabled;
            itemListPnCaseResultListModel.UploadedDataEnabled = itemList.UploadedDataEnabled;
            itemListPnCaseResultListModel.ItemNumberEnabled = itemList.ItemNumberEnabled;
            itemListPnCaseResultListModel.LocationCodeEnabled = itemList.LocationCodeEnabled;
            itemListPnCaseResultListModel.BuildYearEnabled = itemList.BuildYearEnabled;
            itemListPnCaseResultListModel.TypeEnabled = itemList.TypeEnabled;
            itemListPnCaseResultListModel.NumberOfImagesEnabled = itemList.NumberOfImagesEnabled;
            itemListPnCaseResultListModel.SdkeFormId = itemList.RelatedEFormId;

            itemListPnCaseResultListModel.FieldEnabled1 = itemList.SdkFieldEnabled1;
            if ( itemListPnCaseResultListModel.FieldEnabled1)
                itemListPnCaseResultListModel.FieldName1 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId1)?.Label;

            itemListPnCaseResultListModel.FieldEnabled2 = itemList.SdkFieldEnabled2;
            if (itemListPnCaseResultListModel.FieldEnabled2)
                itemListPnCaseResultListModel.FieldName2 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId2)?.Label;

            itemListPnCaseResultListModel.FieldEnabled3 = itemList.SdkFieldEnabled3;
            if (itemListPnCaseResultListModel.FieldEnabled3)
                itemListPnCaseResultListModel.FieldName3 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId3)?.Label;

            itemListPnCaseResultListModel.FieldEnabled4 = itemList.SdkFieldEnabled4;
            if (itemListPnCaseResultListModel.FieldEnabled4)
                itemListPnCaseResultListModel.FieldName4 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId4)?.Label;

            itemListPnCaseResultListModel.FieldEnabled5 = itemList.SdkFieldEnabled5;
            if (itemListPnCaseResultListModel.FieldEnabled5)
                itemListPnCaseResultListModel.FieldName5 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId5)?.Label;

            itemListPnCaseResultListModel.FieldEnabled6 = itemList.SdkFieldEnabled6;
            if (itemListPnCaseResultListModel.FieldEnabled6)
                itemListPnCaseResultListModel.FieldName6 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId6)?.Label;

            itemListPnCaseResultListModel.FieldEnabled7 = itemList.SdkFieldEnabled7;
            if (itemListPnCaseResultListModel.FieldEnabled7)
                itemListPnCaseResultListModel.FieldName7 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId7)?.Label;

            itemListPnCaseResultListModel.FieldEnabled8 = itemList.SdkFieldEnabled8;
            if (itemListPnCaseResultListModel.FieldEnabled8)
                itemListPnCaseResultListModel.FieldName8 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId8)?.Label;

            itemListPnCaseResultListModel.FieldEnabled9 = itemList.SdkFieldEnabled9;
            if (itemListPnCaseResultListModel.FieldEnabled9)
                itemListPnCaseResultListModel.FieldName9 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId9)?.Label;

            itemListPnCaseResultListModel.FieldEnabled10 = itemList.SdkFieldEnabled10;
            if (itemListPnCaseResultListModel.FieldEnabled10)
                itemListPnCaseResultListModel.FieldName10 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId10)?.Label;

            var newItems = (_dbContext.Items.Where(item => item.ItemListId == requestModel.ListId)
                .Join(_dbContext.ItemCases, item => item.Id, itemCase => itemCase.ItemId,
                    (item, itemCase) => new
                    {
                        itemCase.Id,
                        item.Name,
                        item.Description,
                        item.BuildYear,
                        item.LocationCode,
                        item.ItemNumber,
                        item.Type,
                        itemCase.MicrotingSdkCaseDoneAt,
                        itemCase.MicrotingSdkCaseId,
                        itemCase.Status,
                        itemCase.CreatedAt,
                        itemCase.DoneByUserName,
                        itemCase.SdkFieldValue1,
                        itemCase.SdkFieldValue2,
                        itemCase.SdkFieldValue3,
                        itemCase.SdkFieldValue4,
                        itemCase.SdkFieldValue5,
                        itemCase.SdkFieldValue6,
                        itemCase.SdkFieldValue7,
                        itemCase.SdkFieldValue8,
                        itemCase.SdkFieldValue9,
                        itemCase.SdkFieldValue10,
                        itemCase.WorkflowState,
                        itemCase.NumberOfImages
                    }));

            if (requestModel.DateFrom != null)
            {
                newItems = newItems.Where(x =>
                    x.CreatedAt >= new DateTime(requestModel.DateFrom.Value.Year, requestModel.DateFrom.Value.Month, requestModel.DateFrom.Value.Day, 0, 0, 0));
            }

            if (requestModel.DateTo != null)
            {
                newItems = newItems.Where(x =>
                    x.CreatedAt <= new DateTime(requestModel.DateTo.Value.Year, requestModel.DateTo.Value.Month, requestModel.DateTo.Value.Day, 23, 59, 59));
            }

            if (!string.IsNullOrEmpty(requestModel.Sort))
            {
                if (requestModel.IsSortDsc)
                {
                    newItems = newItems
                        .CustomOrderByDescending(requestModel.Sort);
                }
                else
                {
                    newItems = newItems
                        .CustomOrderBy(requestModel.Sort);
                }
            }
            else
            {
                newItems = newItems
                    .OrderBy(x => x.Id);
            }

            itemListPnCaseResultListModel.Total = newItems.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);

            newItems
                = newItems
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize);

            itemListPnCaseResultListModel.Items = new List<ItemsListPnCaseResultModel>();

            foreach (var item in newItems.ToList())
            {
                Console.WriteLine($"[DBG] ItemListCaseService.GetSingleListResults: Looking at case with id {item.Id} with status {item.Status}");

                try
                {
                    ItemsListPnCaseResultModel newItem = new ItemsListPnCaseResultModel()
                    {
                        Id = item.Id,
                        DoneAt = item.MicrotingSdkCaseDoneAt,
                        DeployedAt = item.CreatedAt,
                        DoneByUserName = item.DoneByUserName,
                        Label = item.Name,
                        Description = item.Description,
                        ItemNumber = item.ItemNumber,
                        LocationCode = item.LocationCode,
                        BuildYear = item.BuildYear,
                        Type = item.Type,
                        NumberOfImages = item.NumberOfImages,
                        Field1 = item.SdkFieldValue1,
                        Field2 = item.SdkFieldValue2,
                        Field3 = item.SdkFieldValue3,
                        Field4 = item.SdkFieldValue4,
                        Field5 = item.SdkFieldValue5,
                        Field6 = item.SdkFieldValue6,
                        Field7 = item.SdkFieldValue7,
                        Field8 = item.SdkFieldValue8,
                        Field9 = item.SdkFieldValue9,
                        Field10 = item.SdkFieldValue10,
                        SdkCaseId = item.MicrotingSdkCaseId,
                        SdkeFormId = itemList.RelatedEFormId,
                        Status = item.Status,
                        Token = pluginConfigurationValue.Value
                    };
                    itemListPnCaseResultListModel.Items.Add(newItem);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return itemListPnCaseResultListModel;
        }

        public async Task<OperationDataResult<ItemsListPnItemCaseModel>> GetSingleCase(int caseId)
        {
            try
            {
                ItemsListPnItemCaseModel itemCaseModel = new ItemsListPnItemCaseModel();

                var itemCase = await _dbContext.ItemCases.FirstOrDefaultAsync(x => x.Id == caseId);
                var item = await _dbContext.Items.FirstOrDefaultAsync(x => x.Id == itemCase.ItemId);


                itemCaseModel.Id = itemCase.Id;
                itemCaseModel.Comment = itemCase.Comment;
                itemCaseModel.Status = itemCase.Status;
                itemCaseModel.NumberOfImages = itemCase.NumberOfImages;
                itemCaseModel.Location = itemCase.Location;
                itemCaseModel.Description = item.Description;
                itemCaseModel.ItemNumber = item.ItemNumber;
                itemCaseModel.BuildYear = item.BuildYear;
                itemCaseModel.Type = item.Type;
//
//                if (itemCaseModel == null)
//                {
//                    return new OperationDataResult<ItemsListPnItemCaseModel>(false,
//                        _itemsPlanningLocalizationService.GetString(($"ListItemCase with ID: {caseId} does not exist")));
//                }
                return new OperationDataResult<ItemsListPnItemCaseModel>(true, itemCaseModel);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return new OperationDataResult<ItemsListPnItemCaseModel>(false, "Not done yet.");
        }

        public async Task<string> DownloadEFormPdf(int caseId, string token, string fileType)
        {
            PluginConfigurationValue pluginConfigurationValue =
                await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "ItemsPlanningBaseSettings:Token");
            if (token == pluginConfigurationValue.Value)
            {
                try
                {
                    var core = await _core.GetCore();
                    int eFormId = 0;
                    ItemCase itemCase = await _dbContext.ItemCases.FirstOrDefaultAsync(x => x.Id == caseId);
                    Item item = await _dbContext.Items.SingleOrDefaultAsync(x => x.Id == itemCase.ItemId);
                    ItemList itemList = await _dbContext.ItemLists.SingleOrDefaultAsync(x => x.Id == item.ItemListId);

                    await using MicrotingDbContext microtingDbContext = core.dbContextHelper.GetDbContext();
                    var locale = await _userService.GetCurrentUserLocale();
                    Language language = core.dbContextHelper.GetDbContext().Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                    if (itemList != null)
                    {
                        eFormId = itemList.RelatedEFormId;
                    }

                    string xmlContent = new XElement("ItemCase",
                        new XElement("ItemId", item.Id),
                        new XElement("ItemNumber", item.ItemNumber),
                        new XElement("ItemName", item.Name),
                        new XElement("ItemDescription", item.Description),
                        new XElement("ItemLocationCode", item.LocationCode),
                        new XElement("ItemBuildYear", item.BuildYear),
                        new XElement("ItemType", item.Type)
                    ).ToString();

                    if (caseId != 0 && eFormId != 0)
                    {
                        var filePath = await core.CaseToPdf(itemCase.MicrotingSdkCaseId, eFormId.ToString(),
                            DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                            $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", fileType, xmlContent, language);
                        if (!System.IO.File.Exists(filePath))
                        {
                            throw new FileNotFoundException();
                        }

                        return filePath;
                    }
                    else
                    {
                        throw new Exception("could not find case of eform!");
                    }

                }
                catch (Exception exception)
                {
                    Log.LogException($"ItemListCaseService.DownloadEFormPdf: Got exception {exception.Message}");
                    throw new Exception("Something went wrong!", exception);
                }
            }

            throw new UnauthorizedAccessException();
        }

    }
}