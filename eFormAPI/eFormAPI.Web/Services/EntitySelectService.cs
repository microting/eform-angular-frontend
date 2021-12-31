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


namespace eFormAPI.Web.Services
{
    using Abstractions;
    using Abstractions.Advanced;
    using Infrastructure.Models.SelectableList;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Models;
    using Microting.EformAngularFrontendBase.Infrastructure.Data;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using EntityGroup = Infrastructure.Models.EntityGroup;

    public class EntitySelectService : IEntitySelectService
    {
        private readonly BaseDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public EntitySelectService(BaseDbContext dbContext,
            ILocalizationService localizationService,
            IEFormCoreService coreHelper)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }

        public async Task<OperationDataResult<Paged<EntityGroup>>> Index(
            AdvEntitySelectableGroupListRequestModel requestModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var sdkDbContext = core.DbContextHelper.GetDbContext();

                var entityGroupList = new Paged<EntityGroup>();

                // get query
                var entitySelectableGroupQuery = sdkDbContext.EntityGroups
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Type == Constants.FieldTypes.EntitySelect)
                    .AsNoTracking()
                    .AsQueryable();

                if (!string.IsNullOrEmpty(requestModel.NameFilter))
                {
                    entitySelectableGroupQuery = entitySelectableGroupQuery
                        .Where(x => x.Name.Contains(requestModel.NameFilter));
                }

                // sort
                entitySelectableGroupQuery = QueryHelper.AddSortToQuery(entitySelectableGroupQuery, requestModel.Sort, requestModel.IsSortDsc);

                // count elements
                entityGroupList.Total = await entitySelectableGroupQuery.Select(x => x.Id).CountAsync();

                // pagination
                entitySelectableGroupQuery =
                    entitySelectableGroupQuery
                        .Skip(requestModel.Offset)
                        .Take(requestModel.PageSize);

                // select and take from db
                var entityGroups = await entitySelectableGroupQuery
                    .Select(x => new EntityGroup
                    {
                        Description = x.Description,
                        WorkflowState = x.WorkflowState,
                        CreatedAt = x.CreatedAt,
                        Id = x.Id,
                        MicrotingUUID = x.MicrotingUid,
                        Name = x.Name,
                        Type = x.Type,
                        UpdatedAt = x.UpdatedAt,
                        EntityGroupItemLst = new List<EntityItem>(),
                        IsLocked = x.Locked,
                        IsEditable = x.Editable
                    }).ToListAsync();

                entityGroupList.Entities = entityGroups;

                var plugins = await _dbContext.EformPlugins.Select(x => x.PluginId).ToListAsync();
                foreach (var entityGroup in entityGroupList.Entities)
                {
                    foreach (var _ in plugins.Where(plugin => entityGroup.Name.Contains(plugin)))
                    {
                        entityGroup.IsLocked = true;
                    }
                }

                return new OperationDataResult<Paged<EntityGroup>>(true, entityGroupList);
            }
            catch (Exception)
            {
                return new OperationDataResult<Paged<EntityGroup>>(false,
                    _localizationService.GetString("SelectableGroupLoadingFailed"));
            }
        }

        public async Task<OperationResult> Create(AdvEntitySelectableGroupEditModel editModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var groupCreate = await core.EntityGroupCreate(Constants.FieldTypes.EntitySelect, editModel.Name, editModel.Description, false, true);
                if (editModel.AdvEntitySelectableItemModels.Any())
                {
                    var entityGroup = await core.EntityGroupRead(groupCreate.MicrotingUid);
                    var nextItemUid = entityGroup.EntityGroupItemLst.Count;
                    foreach (var entityItem in editModel.AdvEntitySelectableItemModels)
                    {
                        await core.EntitySelectItemCreate(entityGroup.Id, entityItem.Name, entityItem.DisplayIndex,
                            nextItemUid.ToString());
                        //entityGroup.EntityGroupItemLst.Add(new EntityItem(entityItem.Name,
                        //    entityItem.Description, nextItemUid.ToString(), Constants.WorkflowStates.Created));
                        nextItemUid++;
                    }

                    //core.EntityGroupUpdate(entityGroup);
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("ParamCreatedSuccessfully", groupCreate.MicrotingUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("SelectableListCreationFailed"));
            }
        }

        public async Task<OperationResult> Update(AdvEntitySelectableGroupEditModel editModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var entityGroup = await core.EntityGroupRead(editModel.GroupUid);

                entityGroup.Description = editModel.Description;
                // if (entityGroup.Name != editModel.Name)
                // {
                    entityGroup.Name = editModel.Name;
                    await core.EntityGroupUpdate(entityGroup);
                // }


                var currentIds = new List<int>();

                foreach (var entityItem in editModel.AdvEntitySelectableItemModels)
                {
                    if (string.IsNullOrEmpty(entityItem.MicrotingUUID))
                    {
                        var et = core.EntitySelectItemCreate(entityGroup.Id, entityItem.Name,
                            entityItem.DisplayIndex, entityItem.DisplayIndex.ToString());
                        currentIds.Add(et.Id);
                    }
                    else
                    {
                        await core.EntityItemUpdate(entityItem.Id, entityItem.Name, entityItem.Description,
                            entityItem.DisplayIndex.ToString(), entityItem.DisplayIndex);
                        currentIds.Add(entityItem.Id);
                    }
                }

                foreach (var entityItem in entityGroup.EntityGroupItemLst)
                {
                    if (!currentIds.Contains(entityItem.Id))
                    {
                        await core.EntityItemDelete(entityItem.Id);
                    }
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("ParamUpdatedSuccessfully", editModel.GroupUid));
            }
            catch (Exception exception)
            {
                return new OperationResult(false, _localizationService.GetString("SelectableListCreationFailed") + exception.Message);
            }
        }

        public async Task<OperationDataResult<EntityGroup>> Read(string entityGroupUid)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                EntityGroup entityGroup = await core.EntityGroupRead(entityGroupUid);

                var plugins = await _dbContext.EformPlugins.Select(x => x.PluginId).ToListAsync();

                foreach (var plugin in plugins)
                {
                    if (entityGroup.Name.Contains(plugin))
                    {
                        entityGroup.IsLocked = true;
                    }
                }

                return new OperationDataResult<EntityGroup>(true, entityGroup);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroup>(false,
                    _localizationService.GetString("ErrorWhileObtainSelectableList"));
            }
        }

        public async Task<OperationDataResult<List<CommonDictionaryTextModel>>> GetEntityGroupDictionary(string entityGroupUid)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                var entityGroup = await core.EntityGroupRead(entityGroupUid);

                var mappedEntityGroupDict = entityGroup.EntityGroupItemLst
                    .Select(entityGroupItem => new CommonDictionaryTextModel
                    {
                        Id = entityGroupItem.Id.ToString(),
                        Text = entityGroupItem.Name
                    })
                    .ToList();

                return new OperationDataResult<List<CommonDictionaryTextModel>>(true, mappedEntityGroupDict);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryTextModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainSelectableList"));
            }
        }

        public async Task<OperationResult> Delete(string entityGroupUid)
        {
            try
            {
                var core = await _coreHelper.GetCore();


                return await core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, _localizationService.GetStringWithFormat("ParamDeletedSuccessfully", entityGroupUid))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingSelectableList"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingSelectableList"));
            }
        }

        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetEntityGroupsInDictionary(string searchString)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var sdkDbContext = core.DbContextHelper.GetDbContext();

                var query = sdkDbContext.EntityGroups
                    .Where(x => x.Type == Constants.FieldTypes.EntitySelect);

                if (!string.IsNullOrEmpty(searchString))
                {
                    query = query.Where(x => x.Name.ToUpper().Contains(searchString.ToUpper()));
                }

                var entityGroups = await query
                    .OrderBy(x => x.Name)
                    .Select(x => new CommonDictionaryModel
                    {
                        Name = x.Name,
                        Id = int.Parse(x.MicrotingUid),
                    })
                    .ToListAsync();

                return new OperationDataResult<List<CommonDictionaryModel>>(true, entityGroups);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhenObtainingSearchableList"));
            }
        }
    }
}
