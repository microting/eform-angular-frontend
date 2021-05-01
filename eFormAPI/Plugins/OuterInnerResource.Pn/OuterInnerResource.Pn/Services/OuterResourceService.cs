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

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using OuterInnerResource.Pn.Abstractions;
using OuterInnerResource.Pn.Infrastructure.Models.OuterResources;
using OuterInnerResource.Pn.Messages;
using Rebus.Bus;

namespace OuterInnerResource.Pn.Services
{
    public class OuterResourceService : IOuterResourceService
    {
        private readonly OuterInnerResourcePnDbContext _dbContext;
        private readonly IOuterInnerResourceLocalizationService _localizationService;
        private readonly ILogger<OuterResourceService> _logger;
        private readonly IEFormCoreService _coreService;
        private readonly IBus _bus;

        public OuterResourceService(OuterInnerResourcePnDbContext dbContext,
            IOuterInnerResourceLocalizationService localizationService,
            ILogger<OuterResourceService> logger, 
            IEFormCoreService coreService, 
            IRebusService rebusService)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _logger = logger;
            _coreService = coreService;
            _bus = rebusService.GetBus();
        }

        public async Task<OperationDataResult<OuterResourcesModel>> Index(OuterResourceRequestModel requestModel)
        {
            try
            {
                OuterResourcesModel outerResourcesModel = new OuterResourcesModel();

                IQueryable<OuterResource> query = _dbContext.OuterResources.AsQueryable();
                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        query = query
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        query = query
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    query = _dbContext.OuterResources
                        .OrderBy(x => x.Id);
                }

                query = query.Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

                if (requestModel.PageSize != null)
                {
                    query = query
                        .Skip(requestModel.Offset)
                        .Take((int)requestModel.PageSize);
                }

                List<OuterResourceModel> outerResourceList = await query.Select(x => new OuterResourceModel()
                {
                    Name = x.Name,
                    Id = x.Id,
                    ExternalId = x.ExternalId,
                    RelatedInnerResourcesIds = _dbContext.OuterInnerResources.AsNoTracking().Where(y => 
                        y.OuterResourceId == x.Id && y.WorkflowState != Constants.WorkflowStates.Removed).Select(z => z.InnerResourceId).ToList()
                }).AsNoTracking().ToListAsync();

                outerResourcesModel.Total = await _dbContext.OuterResources.AsNoTracking().Where(x => x.WorkflowState != Constants.WorkflowStates.Removed).CountAsync();
                outerResourcesModel.OuterResourceList = outerResourceList;
                
                try
                {
                    outerResourcesModel.Name = _dbContext.PluginConfigurationValues.SingleOrDefault(x => 
                        x.Name == "OuterInnerResourceSettings:OuterResourceName")
                        ?.Value;  
                } catch {}

                return new OperationDataResult<OuterResourcesModel>(true, outerResourcesModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<OuterResourcesModel>(false,
                    _localizationService.GetString("ErrorObtainOuterResources"));
            }
        }

        public async Task<OperationDataResult<OuterResourceModel>> Get(int id)
        {
            try
            {
                OuterResourceModel outerResource = await _dbContext.OuterResources.Select(x => new OuterResourceModel()
                    {
                        Name = x.Name,
                        Id = x.Id,
                        ExternalId = x.ExternalId
                    })
                    .FirstOrDefaultAsync(x => x.Id == id);
                                
                if (outerResource == null)
                {
                    return new OperationDataResult<OuterResourceModel>(false,
                        _localizationService.GetString("OuterResourceWithIdNotExist", id));
                }

                List<Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource> outerInnerResources = await _dbContext.OuterInnerResources
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed && x.OuterResourceId == outerResource.Id).AsNoTracking().ToListAsync();

                outerResource.RelatedInnerResourcesIds = new List<int>();
                foreach (Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource outerInnerResource in outerInnerResources)
                {
                    outerResource.RelatedInnerResourcesIds.Add(outerInnerResource.InnerResourceId);
                }

                return new OperationDataResult<OuterResourceModel>(true, outerResource);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<OuterResourceModel>(false,
                    _localizationService.GetString("ErrorObtainOuterResource"));
            }
        }

        public async Task<OperationResult> Create(OuterResourceModel model)
        {
            try
            {
                OuterResource outerResource = new OuterResource()
                {
                    Name = model.Name,
                    ExternalId = model.ExternalId
                };

                await outerResource.Create(_dbContext);
                model.Id = outerResource.Id;
                
                if (model.RelatedInnerResourcesIds != null)
                {
                    foreach (var innerResourceId in model.RelatedInnerResourcesIds)
                    {
                        var macth = await _dbContext.OuterInnerResources.SingleOrDefaultAsync(x =>
                            x.OuterResourceId == model.Id
                            && x.InnerResourceId == innerResourceId);
                        if (macth == null)
                        {
                            Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource
                                outerInnerResource =
                                    new Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.
                                        OuterInnerResource
                                        {
                                            InnerResourceId = innerResourceId, 
                                            OuterResourceId = model.Id
                                        };
                            await outerInnerResource.Create(_dbContext);
                        }
                    }
                    await _bus.SendLocal(new OuterInnerResourceCreate(null, model));
                }

                return new OperationResult(true, 
                    _localizationService.GetString("OuterResourceCreatedSuccessfully", model.Name));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorCreatingOuterResource"));
            }
        }

        public async Task<OperationResult> Update(OuterResourceModel model)
        {
            try
            {
                OuterResource outerResource =
                    await _dbContext.OuterResources.SingleOrDefaultAsync(x => x.Id == model.Id);

                outerResource.ExternalId = model.ExternalId;
                outerResource.Name = model.Name;
                await outerResource.Update(_dbContext);
                
                List<Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource>
                    outerInnerResources =
                        await _dbContext.OuterInnerResources.Where(x => 
                            x.OuterResourceId == outerResource.Id
                            && x.WorkflowState != Constants.WorkflowStates.Removed).ToListAsync();
                
                List<int> requestedInnerResourceIds = model.RelatedInnerResourcesIds;
                List<int> deployedInnerResourceIds = new List<int>();
                List<int> toBeDeployed = new List<int>();

                foreach (var outerInnerResource in outerInnerResources)
                {
                    deployedInnerResourceIds.Add(outerInnerResource.InnerResourceId);

                    if (!model.RelatedInnerResourcesIds.Contains(outerInnerResource.InnerResourceId))
                    {
                        await outerInnerResource.Delete(_dbContext);
                        await _bus.SendLocal(new OuterInnerResourceUpdate(outerInnerResource.Id));
                    }
                }

                if (requestedInnerResourceIds.Count != 0)
                {
                    toBeDeployed.AddRange(requestedInnerResourceIds.Where(x => 
                        !deployedInnerResourceIds.Contains(x)));
                }

                foreach (int innerResourceId in toBeDeployed)
                {
                    InnerResource innerResource = _dbContext.InnerResources.SingleOrDefault(x => 
                        x.Id == innerResourceId);
                    if (innerResource != null)
                    {
                        Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource 
                            outerInnerResource = await _dbContext.OuterInnerResources.SingleOrDefaultAsync(x =>
                            x.OuterResourceId == outerResource.Id
                            && x.InnerResourceId == innerResourceId);
                        
                        if (outerInnerResource == null)
                        {
                            outerInnerResource =
                                new Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource()
                                {
                                    InnerResourceId = innerResourceId,
                                    OuterResourceId = outerResource.Id
                                };
                            await outerInnerResource.Create(_dbContext);    
                        }
                        else
                        {
                            outerInnerResource.WorkflowState = Constants.WorkflowStates.Created;
                            await outerInnerResource.Update(_dbContext);
                        }

                        await _bus.SendLocal(new OuterInnerResourceUpdate(outerInnerResource.Id));
                    }
                }
                return new OperationResult(true, _localizationService.GetString("OuterResourceUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorUpdatingOuterResource"));
            }
        }

        public async Task<OperationResult> Delete(int outerResourceId)
        {
            try
            {
                OuterResource outerResource = new OuterResource()
                {
                    Id = outerResourceId
                };
                
                await outerResource.Delete(_dbContext);
                await _bus.SendLocal(new OuterInnerResourceDelete(null, new OuterResourceModel() { Id = outerResourceId }));
                return new OperationResult(true, _localizationService.GetString("OuterResourceDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileDeletingOuterResource"));
            }
        }
    }
}
