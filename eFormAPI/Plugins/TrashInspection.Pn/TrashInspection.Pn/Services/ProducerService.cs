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
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Newtonsoft.Json.Linq;
using OpenStack.NetCoreSwiftClient.Extensions;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Helpers;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Services
{
    using Infrastructure.Extensions;
    using Infrastructure.Models.Producers;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class ProducerService : IProducerService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public ProducerService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<ProducersModel>> Index(ProducerRequestModel pnRequestModel)
        {
            try
            {
                var producersModel = new ProducersModel();

                var producersQuery = _dbContext.Producers.AsQueryable();

                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    producersQuery = producersQuery.Where(x =>
                        x.Name.Contains(pnRequestModel.NameFilter) ||
                        x.Description.Contains(pnRequestModel.NameFilter));
                }
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        producersQuery = producersQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        producersQuery = producersQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    producersQuery = _dbContext.Producers
                        .OrderBy(x => x.Id);
                }
                
                producersQuery
                    = producersQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);
                var producers = await producersQuery.Select(x => new ProducerModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    ForeignId = x.ForeignId,
                    Address = x.Address,
                    City = x.City,
                    ZipCode = x.ZipCode,
                    Phone = x.Phone,
                    ContactPerson = x.ContactPerson
                }).ToListAsync();

                producersModel.Total =
                    _dbContext.Producers.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                producersModel.ProducerList = producers;
                
                return new OperationDataResult<ProducersModel>(true, producersModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<ProducersModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingProducers"));
            }
        }
        
        public async Task<OperationResult> Create(ProducerModel producerModel)
        {
            var producer = new Producer
            {
                Name = producerModel.Name,
                Description = producerModel.Description,
                ForeignId = producerModel.ForeignId,
                Address = producerModel.Address,
                City = producerModel.City,
                ZipCode = producerModel.ZipCode,
                Phone = producerModel.Phone,
                ContactPerson = producerModel.ContactPerson
            };
            await producer.Create(_dbContext);
           
           return new OperationResult(true);
        }
        public async Task<OperationDataResult<ProducerModel>> Read(int id)
        {
            try
            {
                var producer = await _dbContext.Producers.Select(x => new ProducerModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    ForeignId = x.ForeignId,
                    Address = x.Address,
                    City = x.City,
                    ZipCode = x.ZipCode,
                    Phone = x.Phone,
                    ContactPerson = x.ContactPerson
                }).FirstOrDefaultAsync(y => y.Id == id);

                if (producer == null)
                {
                    return new OperationDataResult<ProducerModel>(false,
                        _trashInspectionLocalizationService.GetString($"ProducerWithID:{id}DoesNotExist"));
                }

                return new OperationDataResult<ProducerModel>(true, producer);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<ProducerModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingProducer"));
            }
        }
        public async Task<OperationResult> Update(ProducerModel producerModel)
        {
            var producer = await _dbContext.Producers.SingleOrDefaultAsync(x => x.Id == producerModel.Id);
            if (producer != null)
            {
                producer.Name = producerModel.Name;
                producer.Description = producerModel.Description;
                producer.Address = producerModel.Address;
                producer.ForeignId = producerModel.ForeignId;
                producer.City = producerModel.City;
                producer.ZipCode = producerModel.ZipCode;
                producer.Phone = producerModel.Phone;
                producer.ContactPerson = producerModel.ContactPerson;
            }
            await producer.Update(_dbContext);
            
            return new OperationResult(true);
        }

        public async Task<OperationResult> Delete(int id)
        {
            var producer = await _dbContext.Producers.SingleOrDefaultAsync(x => x.Id == id);
            await producer.Delete(_dbContext);
            return new OperationResult(true);
        }
        public async Task<OperationResult> ImportProducer(ProducerImportModel producersAsJson)
        {
            try
            {
                {
                    var rawJson = JRaw.Parse(producersAsJson.ImportList);
                    var rawHeadersJson = JRaw.Parse(producersAsJson.Headers);

                    var headers = rawHeadersJson;
                    var fractionObjects = rawJson.Skip(1);
                    
                    foreach (var fractionObj in fractionObjects)
                    {
                        var producerNameExists = int.TryParse(headers[0]["headerValue"].ToString(), out var nameColumn);
                        if (!producerNameExists) continue;
                        var existingProducer = FindProducer(nameColumn, headers, fractionObj);
                        if (existingProducer == null)
                        {
                            var producerModel =
                                ProducersHelper.ComposeValues(new ProducerModel(), headers, fractionObj);

                            var newProducer = new Producer
                            {
                                    
                                Name = producerModel.Name,
                                Description = producerModel.Description,
                                ForeignId = producerModel.ForeignId,
                                Address = producerModel.Address,
                                City = producerModel.City,
                                ZipCode = producerModel.ZipCode,
                                Phone = producerModel.Phone,
                                ContactPerson = producerModel.ContactPerson
                                    
                            };
                            await newProducer.Create(_dbContext);
  
                        }
                        else
                        {
                            var producerModel =
                                ProducersHelper.ComposeValues(new ProducerModel(), headers, fractionObj);
                            existingProducer.Name = producerModel.Name;
                            existingProducer.Description = producerModel.Description;
                            existingProducer.ForeignId = producerModel.ForeignId;
                            existingProducer.Address = producerModel.Address;
                            existingProducer.City = producerModel.City;
                            existingProducer.ZipCode = producerModel.ZipCode;
                            existingProducer.Phone = producerModel.Phone;
                            existingProducer.ContactPerson = producerModel.ContactPerson;
                                
                            if (existingProducer.WorkflowState == Constants.WorkflowStates.Removed)
                            {
                                existingProducer.WorkflowState = Constants.WorkflowStates.Created;
                            }
                            
                            await existingProducer.Update(_dbContext);
                        }

                    }
                }
                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("ProducerCreated"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileCreatingProducer"));
            }
        }
        private Producer FindProducer(int producerNameColumn, JToken headers, JToken producerObj)
        {
            var producerName = producerObj[producerNameColumn].ToString();
            var producer = _dbContext.Producers.SingleOrDefault(x => x.Name == producerName);

            return producer;
        }
        
        public async Task<OperationDataResult<Paged<StatByYearModel>>> GetProducersStatsByYear(ProducersYearRequestModel pnRequestModel)
        {
            try
            {
                var trashInspectionsQuery = _dbContext.TrashInspections
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Date.Year == pnRequestModel.Year)
                        .AsQueryable();

                var producersStatsByYearModel = new Paged<StatByYearModel>();

                var producerQuery = _dbContext.Producers.AsQueryable();

                //if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                //{
                //    producerQuery = producerQuery.Where(x =>
                //        x.Name.Contains(pnRequestModel.NameFilter) ||
                //        x.Description.Contains(pnRequestModel.NameFilter));
                //}
                var exludeSort = new List<string>
                {
                    "Weighings",
                    "ControlPercentage",
                    "AmountOfWeighingsControlled",
                    "ApprovedPercentage",
                    "NotApprovedPercentage",
                    "ConditionalApprovedPercentage"
                };

                QueryHelper.AddSortToQuery(producerQuery,
                    pnRequestModel.Sort,
                    pnRequestModel.IsSortDsc,
                    exludeSort);

                producersStatsByYearModel.Total =
                    producerQuery.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);

                var producersStatByYear = await producerQuery
                    .Select(x => new StatByYearModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Weighings = trashInspectionsQuery.Count(t => t.ProducerId == x.Id),
                        ControlPercentage = 0,
                        AmountOfWeighingsControlled = trashInspectionsQuery.Count(t => t.ProducerId == x.Id && t.Status == 100),
                        ApprovedPercentage = trashInspectionsQuery.Count(t => t.ProducerId == x.Id && t.IsApproved && t.Status == 100),
                        NotApprovedPercentage = trashInspectionsQuery.Count(t => t.ProducerId == x.Id && t.ApprovedValue == "3" && t.Status == 100),
                        ConditionalApprovedPercentage = trashInspectionsQuery.Count(t => t.ProducerId == x.Id && t.ApprovedValue == "2" && t.Status == 100)

                    })
                    .ToListAsync();

                foreach (var statByYearModel in producersStatByYear)
                {
                    
                    if (statByYearModel.AmountOfWeighingsControlled > 0 && statByYearModel.Weighings > 0)
                    {
                        statByYearModel.ControlPercentage = Math.Round((statByYearModel.AmountOfWeighingsControlled / statByYearModel.Weighings) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.ControlPercentage = 0;
                    }
                    
                    if (statByYearModel.ApprovedPercentage > 0 && statByYearModel.AmountOfWeighingsControlled > 0)
                    {
                        statByYearModel.ApprovedPercentage =
                            Math.Round((statByYearModel.ApprovedPercentage / statByYearModel.AmountOfWeighingsControlled) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.ApprovedPercentage = 0;
                    }

                    if (statByYearModel.ConditionalApprovedPercentage > 0 && statByYearModel.AmountOfWeighingsControlled > 0)
                    {
                        statByYearModel.ConditionalApprovedPercentage = 
                            Math.Round((statByYearModel.ConditionalApprovedPercentage / statByYearModel.AmountOfWeighingsControlled) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.ConditionalApprovedPercentage = 0;
                    }
                    
                    if (statByYearModel.NotApprovedPercentage > 0 && statByYearModel.AmountOfWeighingsControlled > 0)
                    {
                        statByYearModel.NotApprovedPercentage =
                            Math.Round((statByYearModel.NotApprovedPercentage / statByYearModel.AmountOfWeighingsControlled) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.NotApprovedPercentage = 0;
                    }
                }

                if (!string.IsNullOrEmpty(pnRequestModel.Sort) && exludeSort.Contains(pnRequestModel.Sort))
                {
                    producersStatByYear = pnRequestModel.IsSortDsc
                        ? producersStatByYear.OrderByDescending(x => x.GetPropValue(pnRequestModel.Sort)).ToList()
                        : producersStatByYear.OrderBy(x => x.GetPropValue(pnRequestModel.Sort)).ToList();
                }

                producersStatsByYearModel.Entities = producersStatByYear;
                
                return new OperationDataResult<Paged<StatByYearModel>>(true, producersStatsByYearModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<Paged<StatByYearModel>>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingProducers"));
            }
        }

        public async Task<OperationDataResult<StatByMonth>> GetSingleProducerByMonth(int producerId, int year)
        {
             try
             {
                 var statByMonth = new StatByMonth();
                 statByMonth.StatByMonthListData1 = new List<Period>();
                 var months = new List<string>
                 {
                     "Jan","Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
                 };
                 var outcomes = new List<string>
                 {
                     "Godkendt", "Betinget Godkendt", "Ikke Godkendt"
                 };
                 var trashInspectionsQuery = 
                     _dbContext.TrashInspections.AsQueryable();
                 var linePeriod = new Period
                 {
                     Name = "Compliance"
                 };
                 linePeriod.Series = new List<SeriesObject>();
                 trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Year == year && x.ProducerId == producerId);
                 double wheigingsPrYear = await trashInspectionsQuery.CountAsync();
                 double wheigingsPrYearControlled = await trashInspectionsQuery.CountAsync(x => x.Status == 100);
                 var avgControlPercentagePrYear = (wheigingsPrYearControlled / wheigingsPrYear) * 100;
                 var i = 1;
                 var j = 0;
                 foreach (var month in months)
                 {
                     trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Month == i);
                     double wheigingsPrMonth = await trashInspectionsQuery.CountAsync();
                    
                     double value1 = await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "1" && x.Status == 100);
                     double value2 = await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "2" && x.Status == 100);
                     double value3 = await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "3" && x.Status == 100);
                    
                    
                     double wheigingsPrMonthControlled = await trashInspectionsQuery.CountAsync(x => x.Status == 100);
                     double wheighingsApprovedPrMonth = await trashInspectionsQuery.CountAsync(x => x.IsApproved && x.Status == 100);
                     double wheighingsNotApprovedPrMonth = await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "3" && x.Status == 100);
                     double wheighingsPartiallyApprovedPrMonth = await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "2" && x.Status == 100);
                     double approvedWheighingsPercentage = 0;
                     double notApprovedWheighingPercentage = 0;
                     double partiallyApprovedWheighingPercentage = 0;
                     if (wheigingsPrMonthControlled != 0)
                     {
                         approvedWheighingsPercentage = Math.Round(
                             (wheighingsApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                         notApprovedWheighingPercentage =
                             Math.Round((wheighingsNotApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                         partiallyApprovedWheighingPercentage = 
                             Math.Round((wheighingsPartiallyApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                     }
                       
                     var period = new Period
                     {
                         Name = month
                     };
                     //Bar Chart Data
                     period.Series = new List<SeriesObject>();
                     var seriesObject1 = new SeriesObject
                     {
                         Name = outcomes[0],
                         Value = approvedWheighingsPercentage
                     };
                     period.Series.Add(seriesObject1);
                     var seriesObject2 = new SeriesObject
                     {
                         Name = outcomes[1],
                         Value = partiallyApprovedWheighingPercentage
                     };
                     period.Series.Add(seriesObject2);
                     var seriesObject3 = new SeriesObject
                     {
                         Name = outcomes[2],
                         Value = notApprovedWheighingPercentage
                     };
                     period.Series.Add(seriesObject3);
                     statByMonth.StatByMonthListData1.Add(period);
                    
                     //Line Chart Data
                     var lineSeriesObject1 = new SeriesObject
                     {
                         Name = months[j],
                         Value = approvedWheighingsPercentage
                     };
                     linePeriod.Series.Add(lineSeriesObject1);
                     i += 1;
                     j += 1;

                 }
                 statByMonth.StatByMonthListData2.Add(linePeriod);

//                   
                 return new OperationDataResult<StatByMonth>(true,
                     statByMonth);
             }
             catch (Exception e)
             {
                 Trace.TraceError(e.Message);
                 _coreHelper.LogException(e.Message);
                 return new OperationDataResult<StatByMonth>(false,
                     _trashInspectionLocalizationService.GetString("ErrorObtainingStatsByMonth"));
             }
        }

    }
}