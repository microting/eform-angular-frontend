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
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Services
{
    public class SegmentService : ISegmentService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;
        
        public SegmentService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }
        
        public async Task<OperationDataResult<SegmentsModel>> Index(SegmentRequestModel pnRequestModel)
        {
            try
            {
                SegmentsModel segmentsModel = new SegmentsModel();
                
                IQueryable<Segment> segmentQuery = _dbContext.Segments.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        segmentQuery = segmentQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        segmentQuery = segmentQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    segmentQuery = _dbContext.Segments
                        .OrderBy(x => x.Id);
                }
                
                segmentQuery
                     = segmentQuery
                     .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                     .Skip(pnRequestModel.Offset)
                     .Take(pnRequestModel.PageSize);
                 
                List<SegmentModel> segmentModels = await segmentQuery.Select(x => new SegmentModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    SdkFolderId = x.SdkFolderId
                }).ToListAsync();

                segmentsModel.Total = await _dbContext.Segments.CountAsync(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                segmentsModel.SegmentList = segmentModels;
                Core _core = await _coreHelper.GetCore();

                
                return new OperationDataResult<SegmentsModel>(true, segmentsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<SegmentsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingSegments"));

            }
        }
        public async Task<OperationResult> Create(SegmentModel model)
        {

            Segment segment = new Segment
            {
                Name = model.Name,
                Description = model.Description,
                SdkFolderId = model.SdkFolderId
            };
            
            await segment.Create(_dbContext);
            
            return new OperationResult(true);
        }
        public async Task<OperationDataResult<SegmentModel>> Read(int id)
        {
            try
            {
                var segment = await _dbContext.Segments.Select(x => new SegmentModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        SdkFolderId = x.SdkFolderId
                    })
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (segment == null)
                {                    
                    return new OperationDataResult<SegmentModel>(false,
                        _trashInspectionLocalizationService.GetString($"SegmentWithID:{id}DoesNotExist"));
                }

                return new OperationDataResult<SegmentModel>(true, segment);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<SegmentModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingSegment"));
            }
        }
        public async Task<OperationResult> Update(SegmentModel updateModel)
        {
            Segment segment = await _dbContext.Segments.SingleOrDefaultAsync(x => x.Id == updateModel.Id);

            if (segment != null)
            {
                segment.Name = updateModel.Name;
                segment.Description = updateModel.Description;
                segment.SdkFolderId = updateModel.SdkFolderId;
                await segment.Update(_dbContext);
            
                return new OperationResult(true);
            }
            
            return new OperationResult(false);
        }
        public async Task<OperationResult> Delete(int id)
        {
            Segment segment = await _dbContext.Segments.SingleOrDefaultAsync(x => x.Id == id);

            if (segment != null)
            {
                await segment.Delete(_dbContext);
            
                return new OperationResult(true);
            }
            
            return new OperationResult(false);
        }

    }
}