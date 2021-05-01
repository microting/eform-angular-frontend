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

namespace ItemsPlanning.Pn.Services.ItemsPlanningTagsService
{
    using ItemsPlanningLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.ItemsPlanningBase.Infrastructure.Data;
    using Microting.ItemsPlanningBase.Infrastructure.Data.Entities;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Infrastructure.Models.Planning;
    using Microting.eForm.Infrastructure.Constants;

    public class ItemsPlanningTagsService : IItemsPlanningTagsService
    {
        private readonly ILogger<ItemsPlanningTagsService> _logger;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IUserService _userService;

        public ItemsPlanningTagsService(
                IItemsPlanningLocalizationService itemsPlanningLocalizationService,
                ILogger<ItemsPlanningTagsService> logger,
                ItemsPlanningPnDbContext dbContext,
                IUserService userService
                )
        {
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _logger = logger;
            _dbContext = dbContext;
            _userService = userService;
        }

        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetItemsPlanningTags()
        {
            try
            {
                var itemsPlanningTags = await _dbContext.PlanningTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                    .AsNoTracking()
                                    .Select(x => new CommonDictionaryModel
                                    {
                                        Id = x.Id,
                                        Name = x.Name
                                    }).OrderBy(x => x.Name).ToListAsync();

                return new OperationDataResult<List<CommonDictionaryModel>>(
                    true,
                    itemsPlanningTags);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingItemsPlanningTags"));
            }
        }

        public async Task<OperationResult> CreateItemsPlanningTag(PlanningTagModel requestModel)
        {
            try
            {
                var itemsPlanningTag = new PlanningTag
                {
                    Name = requestModel.Name,
                    CreatedByUserId = _userService.UserId,
                    UpdatedByUserId = _userService.UserId,
                };

                await itemsPlanningTag.Create(_dbContext);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ItemsPlanningTagCreatedSuccessfully"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileCreatingItemsPlanningTag"));
            }
        }

        public async Task<OperationResult> DeleteItemsPlanningTag(int id)
        {
            try
            {
                var itemsPlanningTag = await _dbContext.PlanningTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (itemsPlanningTag == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("ItemsPlanningTagNotFound"));
                }

                var planningsTags = await _dbContext.PlanningsTags
                    .Where(x => x.PlanningTagId == id).ToListAsync();

                foreach(var planningTag in planningsTags)
                {
                    await planningTag.Delete(_dbContext);
                }
                await itemsPlanningTag.Delete(_dbContext);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ItemsPlanningTagRemovedSuccessfully"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileRemovingItemsPlanningTag"));
            }
        }

        public async Task<OperationResult> UpdateItemsPlanningTag(PlanningTagModel requestModel)
        {
            try
            {
                var itemsPlanningTag = await _dbContext.PlanningTags
                    .Where(x=> x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

                if (itemsPlanningTag == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("ItemsPlanningTagNotFound"));
                }

                itemsPlanningTag.Name = requestModel.Name;
                itemsPlanningTag.UpdatedByUserId = _userService.UserId;

                await itemsPlanningTag.Update(_dbContext);

                return new OperationResult(true,
                    _itemsPlanningLocalizationService.GetString("ItemsPlanningTagUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileUpdatingItemsPlanningTag"));
            }
        }
    }
}
