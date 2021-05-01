using eFormCore;
using Microting.eForm.Infrastructure.Data.Entities;

namespace ItemsGroupPlanning.Pn.Services
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Helpers;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data.Entities;
    using Newtonsoft.Json.Linq;

    public class ItemsListService : IItemsListService
    {
        private readonly ItemsGroupPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserService _userService;
        private readonly IEFormCoreService _coreHelper;

        public ItemsListService(
            ItemsGroupPlanningPnDbContext dbContext,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IUserService userService,
            IHttpContextAccessor httpContextAccessor, IEFormCoreService coreHelper)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _httpContextAccessor = httpContextAccessor;
            _coreHelper = coreHelper;
            _userService = userService;
        }

        public async Task<OperationDataResult<ItemsListsModel>> Index(ItemsListRequestModel pnRequestModel)
        {
            try
            {
                ItemsListsModel listsModel = new ItemsListsModel();

                IQueryable<ItemList> itemListsQuery = _dbContext.ItemLists.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        itemListsQuery = itemListsQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        itemListsQuery = itemListsQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    itemListsQuery = _dbContext.ItemLists
                        .OrderBy(x => x.Id);
                }

                if (!string.IsNullOrEmpty(pnRequestModel.NameFilter))
                {
                    itemListsQuery = itemListsQuery.Where(x => x.Name.Contains(pnRequestModel.NameFilter));
                }

                itemListsQuery
                    = itemListsQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);

                List<ItemsListPnModel> lists = await itemListsQuery.Select(x => new ItemsListPnModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    RepeatEvery = x.RepeatEvery,
                    RepeatType = x.RepeatType,
                    RepeatUntil = x.RepeatUntil,
                    DayOfWeek = x.DayOfWeek,
                    DayOfMonth = x.DayOfMonth,
                    RelatedEFormId = x.RelatedEFormId,
                    RelatedEFormName = x.RelatedEFormName,
                }).ToListAsync();

                listsModel.Total = await _dbContext.ItemLists.CountAsync(x =>
                    x.WorkflowState != Constants.WorkflowStates.Removed);
                listsModel.Lists = lists;

                return new OperationDataResult<ItemsListsModel>(true, listsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemsListsModel>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorObtainingLists"));
            }
        }

        public async Task<OperationResult> Create(ItemsListPnModel model)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.dbContextHelper.GetDbContext();

                var locale = await _userService.GetCurrentUserLocale();
                Language language = dbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                var template = await core.TemplateItemRead(model.RelatedEFormId, language);
                var itemsList = new ItemList
                {
                    Name = model.Name,
                    Description = model.Description,
                    CreatedByUserId = UserId,
                    CreatedAt = DateTime.UtcNow,
                    RepeatEvery = model.RepeatEvery,
                    RepeatUntil = model.RepeatUntil,
                    RepeatType = model.RepeatType,
                    DayOfWeek = model.DayOfWeek,
                    DayOfMonth = model.DayOfMonth,
                    Enabled = true,
                    Items = new List<Item>(),
                    RelatedEFormId = model.RelatedEFormId,
                    RelatedEFormName = template?.Label
                };

                await itemsList.Create(_dbContext);

                foreach (var itemModel in model.Items)
                {
                    var item = new Item()
                    {
                        LocationCode = itemModel.LocationCode,
                        ItemNumber = itemModel.ItemNumber,
                        Description = itemModel.Description,
                        Name = itemModel.Name,
                        Version = 1,
                        WorkflowState = Constants.WorkflowStates.Created,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        Enabled = true,
                        BuildYear = itemModel.BuildYear,
                        Type = itemModel.Type,
                        ItemListId = itemsList.Id,
                        CreatedByUserId = UserId,
                    };
                    await item.Save(_dbContext);
                }

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ListCreatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileCreatingList"));
            }
        }
        public async Task<OperationDataResult<ItemsListPnModel>> Read(int listId)
        {
            try
            {
                var itemList = await _dbContext.ItemLists
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed && x.Id == listId)
                    .Select(x => new ItemsListPnModel()
                    {
                        Id = x.Id,
                        RepeatUntil = x.RepeatUntil,
                        RepeatEvery = x.RepeatEvery,
                        RepeatType = x.RepeatType,
                        DayOfWeek = x.DayOfWeek,
                        DayOfMonth = x.DayOfMonth,
                        Description = x.Description,
                        Name = x.Name,
                        RelatedEFormId = x.RelatedEFormId,
                        RelatedEFormName = x.RelatedEFormName,
                        LabelEnabled = x.LabelEnabled,
                        DeployedAtEnabled = x.DeployedAtEnabled,
                        DescriptionEnabled = x.DescriptionEnabled,
                        DoneAtEnabled = x.DoneAtEnabled,
                        DoneByUserNameEnabled = x.DoneByUserNameEnabled,
                        UploadedDataEnabled = x.UploadedDataEnabled,
                        ItemNumberEnabled = x.ItemNumberEnabled,
                        LocationCodeEnabled = x.LocationCodeEnabled,
                        BuildYearEnabled = x.BuildYearEnabled,
                        TypeEnabled = x.TypeEnabled,
                        NumberOfImagesEnabled = x.NumberOfImagesEnabled,
                        SdkFieldId1 = x.SdkFieldId1,
                        SdkFieldId2 = x.SdkFieldId2,
                        SdkFieldId3 = x.SdkFieldId3,
                        SdkFieldId4 = x.SdkFieldId4,
                        SdkFieldId5 = x.SdkFieldId5,
                        SdkFieldId6 = x.SdkFieldId6,
                        SdkFieldId7 = x.SdkFieldId7,
                        SdkFieldId8 = x.SdkFieldId8,
                        SdkFieldId9 = x.SdkFieldId9,
                        SdkFieldId10 = x.SdkFieldId10,
                        LastExecutedTime = x.LastExecutedTime,
                        Items = x.Items.Select(i => new ItemsListPnItemModel()
                        {
                            Id = i.Id,
                            Description = i.Description,
                            Name = i.Name,
                            LocationCode = i.LocationCode,
                            ItemNumber = i.ItemNumber,
                            BuildYear = i.BuildYear,
                            Type = i.Type
                        }).ToList()
                    }).FirstOrDefaultAsync();

                if (itemList == null)
                {
                    return new OperationDataResult<ItemsListPnModel>(
                        false,
                        _itemsPlanningLocalizationService.GetString("ListNotFound"));
                }


                return new OperationDataResult<ItemsListPnModel>(
                    true,
                    itemList);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemsListPnModel>(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingList"));
            }
        }
        public async Task<OperationResult> Update(ItemsListPnModel updateModel)
        {
            try
            {

                var core = await _coreHelper.GetCore();
                await using var dbContext = core.dbContextHelper.GetDbContext();

                var locale = await _userService.GetCurrentUserLocale();
                Language language = dbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                var template = await _coreHelper.GetCore().Result.TemplateItemRead(updateModel.RelatedEFormId, language);
                var itemsList = new ItemList
                {
                    Id = updateModel.Id,
                    RepeatUntil = updateModel.RepeatUntil,
                    RepeatEvery = updateModel.RepeatEvery,
                    RepeatType = updateModel.RepeatType,
                    DayOfWeek = updateModel.DayOfWeek,
                    DayOfMonth = updateModel.DayOfMonth,
                    Description = updateModel.Description,
                    Name = updateModel.Name,
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedByUserId = UserId,
                    RelatedEFormId = updateModel.RelatedEFormId,
                    RelatedEFormName = template?.Label,
                    LabelEnabled = updateModel.LabelEnabled,
                    DescriptionEnabled = updateModel.DescriptionEnabled,
                    DeployedAtEnabled = updateModel.DeployedAtEnabled,
                    DoneAtEnabled = updateModel.DoneAtEnabled,
                    DoneByUserNameEnabled = updateModel.DoneByUserNameEnabled,
                    UploadedDataEnabled = updateModel.UploadedDataEnabled,
                    ItemNumberEnabled = updateModel.ItemNumberEnabled,
                    LocationCodeEnabled = updateModel.LocationCodeEnabled,
                    BuildYearEnabled = updateModel.BuildYearEnabled,
                    TypeEnabled = updateModel.TypeEnabled,
                    NumberOfImagesEnabled = updateModel.NumberOfImagesEnabled,
                    SdkFieldId1 = updateModel.SdkFieldId1,
                    SdkFieldId2 = updateModel.SdkFieldId2,
                    SdkFieldId3 = updateModel.SdkFieldId3,
                    SdkFieldId4 = updateModel.SdkFieldId4,
                    SdkFieldId5 = updateModel.SdkFieldId5,
                    SdkFieldId6 = updateModel.SdkFieldId6,
                    SdkFieldId7 = updateModel.SdkFieldId7,
                    SdkFieldId8 = updateModel.SdkFieldId8,
                    SdkFieldId9 = updateModel.SdkFieldId9,
                    SdkFieldId10 = updateModel.SdkFieldId10,
                    SdkFieldEnabled1 = updateModel.SdkFieldId1 != null,
                    SdkFieldEnabled2 = updateModel.SdkFieldId2 != null,
                    SdkFieldEnabled3 = updateModel.SdkFieldId3 != null,
                    SdkFieldEnabled4 = updateModel.SdkFieldId4 != null,
                    SdkFieldEnabled5 = updateModel.SdkFieldId5 != null,
                    SdkFieldEnabled6 = updateModel.SdkFieldId6 != null,
                    SdkFieldEnabled7 = updateModel.SdkFieldId7 != null,
                    SdkFieldEnabled8 = updateModel.SdkFieldId8 != null,
                    SdkFieldEnabled9 = updateModel.SdkFieldId9 != null,
                    SdkFieldEnabled10 = updateModel.SdkFieldId10 != null,
                    LastExecutedTime = updateModel.LastExecutedTime

                };
                await itemsList.Update(_dbContext);

                // update current items
                var items = await _dbContext.Items
                    .Where(x => x.ItemListId == itemsList.Id)
                    .ToListAsync();

                foreach (var item in items)
                {
                    var itemModel = updateModel.Items.FirstOrDefault(x => x.Id == item.Id);
                    if (itemModel != null)
                    {
                        item.Description = itemModel.Description;
                        item.ItemNumber = itemModel.ItemNumber;
                        item.LocationCode = itemModel.LocationCode;
                        item.Name = itemModel.Name;
                        item.UpdatedAt = DateTime.UtcNow;
                        item.UpdatedByUserId = UserId;
                        item.BuildYear = itemModel.BuildYear;
                        item.Type = itemModel.Type;
                        await item.Update(_dbContext);
                    }
                }

                // Remove old
                var itemModelIds = updateModel.Items.Select(x => x.Id).ToArray();
                var itemsForRemove = await _dbContext.Items
                    .Where(x => !itemModelIds.Contains(x.Id) && x.ItemListId == itemsList.Id)
                    .ToListAsync();

                foreach (var itemForRemove in itemsForRemove)
                {
                    await itemForRemove.Delete(_dbContext);
                }

                // Create new
                foreach (var itemModel in updateModel.Items)
                {
                    var item = items.FirstOrDefault(x => x.Id == itemModel.Id);
                    if (item == null)
                    {
                        var newItem = new Item()
                        {
                            LocationCode = itemModel.LocationCode,
                            ItemNumber = itemModel.ItemNumber,
                            Description = itemModel.Description,
                            Name = itemModel.Name,
                            Version = 1,
                            WorkflowState = Constants.WorkflowStates.Created,
                            CreatedAt = DateTime.UtcNow,
                            CreatedByUserId = UserId,
                            UpdatedAt = DateTime.UtcNow,
                            Enabled = true,
                            BuildYear = itemModel.BuildYear,
                            Type = itemModel.Type,
                            ItemListId = itemsList.Id,
                        };
                        await newItem.Save(_dbContext);
                    }
                }

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ListUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileUpdatingList"));
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
//                Debugger.Break();
                var itemsList = new ItemList
                {
                    Id = id
                };
                await itemsList.Delete(_dbContext);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ListDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileRemovingList"));
            }
        }



        private Item FindItem(bool numberExists, int numberColumn, bool itemNameExists,
            int itemNameColumn, JToken headers, JToken itemObj)
        {
            Item item = null;

            if (numberExists)
            {
                string itemNo = itemObj[numberColumn].ToString();
                item = _dbContext.Items.SingleOrDefault(x => x.ItemNumber == itemNo);
            }

            if (itemNameExists)
            {
                string itemName = itemObj[itemNameColumn].ToString();
                item = _dbContext.Items.SingleOrDefault(x => x.Name == itemName);
            }

            return item;
        }

        public async Task<OperationResult> ImportUnit(UnitImportModel unitAsJson)
        {
            try
            {
                {
                    JToken rawJson = JRaw.Parse(unitAsJson.ImportList);
                    JToken rawHeadersJson = JRaw.Parse(unitAsJson.Headers);

                    JToken headers = rawHeadersJson;
                    IEnumerable<JToken> itemObjects = rawJson.Skip(1);

                    foreach (JToken itemObj in itemObjects)
                    {
                        bool numberExists = int.TryParse(headers[0]["headerValue"].ToString(), out int numberColumn);
                        bool itemNameExists = int.TryParse(headers[1]["headerValue"].ToString(),
                            out int nameColumn);
                        if (numberExists || itemNameExists)
                        {
                            Item existingItem = FindItem(numberExists, numberColumn, itemNameExists,
                                nameColumn, headers, itemObj);
                            if (existingItem == null)
                            {
                                ItemsListPnItemModel itemModel =
                                    ItemsHelper.ComposeValues(new ItemsListPnItemModel(), headers, itemObj);

                                Item newItem = new Item
                                {
                                    ItemNumber = itemModel.ItemNumber,
                                    Name = itemModel.Name,
                                    Description = itemModel.Description,
                                    LocationCode = itemModel.LocationCode,


                                };
                               await newItem.Save(_dbContext);

                            }
                            else
                            {
                                if (existingItem.WorkflowState == Constants.WorkflowStates.Removed)
                                {
                                    Item item = await _dbContext.Items.SingleOrDefaultAsync(x => x.Id == existingItem.Id);
                                    if (item != null)
                                    {
                                        item.Name = existingItem.Name;
                                        item.Description = existingItem.Description;
                                        item.ItemNumber = existingItem.ItemNumber;
                                        item.LocationCode = existingItem.LocationCode;
                                        item.WorkflowState = Constants.WorkflowStates.Created;

                                        await item.Update(_dbContext);
                                    }
                                }
                            }
                        }

                    }
                }
                return new OperationResult(true,
                    _itemsPlanningLocalizationService.GetString("ItemImportes"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileImportingItems"));
            }
        }

        public int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}