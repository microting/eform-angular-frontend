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
    using Infrastructure.Models.Fractions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class FractionService : IFractionService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;
        private readonly IUserService _userService;

        public FractionService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            IUserService userService,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _userService = userService;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<Paged<FractionModel>>> Index(FractionRequestModel pnRequestModel)
        {
            try
            {
                var fractionsModel = new Paged<FractionModel>();

                var fractionsQuery = _dbContext.Fractions
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .AsQueryable();
                //if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                //{
                //    fractionsQuery = fractionsQuery.Where(x =>
                //        x.Name.Contains(pnRequestModel.NameFilter) ||
                //        x.Description.Contains(pnRequestModel.NameFilter));
                //}

                fractionsQuery = QueryHelper.AddSortToQuery(fractionsQuery, pnRequestModel.Sort, pnRequestModel.IsSortDsc);

                fractionsModel.Total = await fractionsQuery.Select(x => x.Id).CountAsync();

                fractionsQuery
                    = fractionsQuery
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);

                var fractions = await fractionsQuery
                    .Select(x => new FractionModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        eFormId = x.eFormId,
                        Description = x.Description,
                        LocationCode = x.LocationCode,
                        ItemNumber = x.ItemNumber
                    })
                    .ToListAsync();

                fractionsModel.Entities = fractions;
                var core = await _coreHelper.GetCore();
                var eFormNames = new List<KeyValuePair<int, string>>();

                var locale = await _userService.GetCurrentUserLocale();
                var language = core.DbContextHelper.GetDbContext().Languages.Single(x => string.Equals(x.LanguageCode, locale, StringComparison.CurrentCultureIgnoreCase));
                foreach (var fractionModel in fractionsModel.Entities)
                {
                    if (fractionModel.eFormId > 0)
                    {
                        if (eFormNames.Any(x => x.Key == fractionModel.eFormId))
                        {
                            fractionModel.SelectedTemplateName = eFormNames.First(x => x.Key == fractionModel.eFormId).Value;
                        }
                        else
                        {
                            try
                            {

                                var eFormName = core.TemplateItemRead(fractionModel.eFormId, language).Result.Label;
                                fractionModel.SelectedTemplateName = eFormName;
                                var kvp =
                                    new KeyValuePair<int, string>(fractionModel.eFormId, eFormName);
                                eFormNames.Add(kvp);
                            }
                            catch
                            {
                                var kvp = new KeyValuePair<int, string>(fractionModel.eFormId, "");
                                eFormNames.Add(kvp);
                            }
                        }
                    }
                }

                return new OperationDataResult<Paged<FractionModel>>(true, fractionsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<Paged<FractionModel>>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingFractions"));

            }
        }
        public async Task<OperationResult> Create(FractionModel createModel)
        {
            var fraction = new Fraction
            {
                Name = createModel.Name,
                Description = createModel.Description,
                ItemNumber = createModel.ItemNumber,
                LocationCode = createModel.LocationCode,
                eFormId = createModel.eFormId
            };
            await fraction.Create(_dbContext);

            return new OperationResult(true);

        }
        public async Task<OperationDataResult<FractionModel>> Read(int id)
        {
            try
            {
                var fraction = await _dbContext.Fractions.Select(x => new FractionModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        eFormId = x.eFormId,
                        Description = x.Description,
                        LocationCode = x.LocationCode,
                        ItemNumber = x.ItemNumber
                    })
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (fraction == null)
                {
                    return new OperationDataResult<FractionModel>(false,
                        _trashInspectionLocalizationService.GetString($"FractionWithID:{id}DoesNotExist"));
                }

                var core = await _coreHelper.GetCore();

                if (fraction.eFormId > 0)
                {
                    try {
                        var locale = await _userService.GetCurrentUserLocale();
                        var language = core.DbContextHelper.GetDbContext().Languages.Single(x => string.Equals(x.LanguageCode, locale, StringComparison.CurrentCultureIgnoreCase));
                        var eFormName = core.TemplateItemRead(fraction.eFormId, language).Result.Label;
                        fraction.SelectedTemplateName = eFormName;

                    }
                    catch
                    {
                        // ignored
                    }
                }
                return new OperationDataResult<FractionModel>(true, fraction);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<FractionModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingFraction"));
            }
        }

        public async Task<OperationResult> Update(FractionModel updateModel)
        {
            var fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == updateModel.Id);
            if (fraction != null)
            {
                fraction.Name = updateModel.Name;
                fraction.Description = updateModel.Description;
                fraction.ItemNumber = updateModel.ItemNumber;
                fraction.LocationCode = updateModel.LocationCode;
                fraction.eFormId = updateModel.eFormId;

                await fraction.Update(_dbContext);
            }

            return new OperationResult(true);

        }

        public async Task<OperationResult> Delete(int id)
        {
            var fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == id);

            if (fraction != null)
            {
                await fraction.Delete(_dbContext);
            }
            return new OperationResult(true);
        }

        private Fraction FindFraction(bool numberExists, int numberColumn, bool fractionNameExists,
            int fractionNameColumn, JToken headers, JToken fractionObj)
        {
            Fraction fraction = null;

            if (numberExists)
            {
                var itemNo = fractionObj[numberColumn]?.ToString();
                fraction = _dbContext.Fractions.SingleOrDefault(x => x.ItemNumber == itemNo);
            }

            if (fractionNameExists)
            {
                var fractionName = fractionObj[fractionNameColumn]?.ToString();
                fraction = _dbContext.Fractions.SingleOrDefault(x => x.Name == fractionName);
            }

            return fraction;
        }
        public async Task<OperationResult> ImportFraction(FractionImportModel fractionsAsJson)
        {
            try
            {
                {
                    var rawJson = JToken.Parse(fractionsAsJson.ImportList);
                    var rawHeadersJson = JToken.Parse(fractionsAsJson.Headers);

                    var headers = rawHeadersJson;
                    var fractionObjects = rawJson.Skip(1);

                    foreach (var fractionObj in fractionObjects)
                    {
                        var numberExists = int.TryParse(headers[0]?["headerValue"]?.ToString(), out var numberColumn);
                        var fractionNameExists = int.TryParse(headers[1]?["headerValue"]?.ToString(),
                            out var nameColumn);
                        if (numberExists || fractionNameExists)
                        {
                            var existingFraction = FindFraction(numberExists, numberColumn, fractionNameExists,
                                nameColumn, headers, fractionObj);
                            if (existingFraction == null)
                            {
                                var fractionModel =
                                    FractionsHelper.ComposeValues(new FractionModel(), headers, fractionObj);

                                var newFraction = new Fraction
                                {
                                    ItemNumber = fractionModel.ItemNumber,
                                    Name = fractionModel.Name,
                                    Description = fractionModel.Description,
                                    LocationCode = fractionModel.LocationCode,
                                    eFormId = fractionModel.eFormId

                                };
                                await newFraction.Create(_dbContext);

                            }
                            else
                            {
                                if (existingFraction.WorkflowState == Constants.WorkflowStates.Removed)
                                {
                                    var fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == existingFraction.Id);
                                    if (fraction != null)
                                    {
                                        fraction.Name = existingFraction.Name;
                                        fraction.Description = existingFraction.Description;
                                        fraction.ItemNumber = existingFraction.ItemNumber;
                                        fraction.LocationCode = existingFraction.LocationCode;
                                        fraction.WorkflowState = Constants.WorkflowStates.Created;

                                        await fraction.Update(_dbContext);
                                    }
                                }
                            }
                        }

                    }
                }
                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("FractionCreated"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileCreatingFraction"));
            }
        }
        public async Task<OperationDataResult<Paged<StatByYearModel>>> GetFractionsStatsByYear(FractionPnYearRequestModel pnRequestModel)
        {
            try
            {
                var trashInspectionsQuery = _dbContext.TrashInspections
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Date.Year == pnRequestModel.Year)
                    .AsQueryable();
                
                var fractionsStatsByYearModel = new Paged<StatByYearModel>();

                var fractionQuery = _dbContext.Fractions
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                //if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                //{
                //    fractionQuery = fractionQuery.Where(x =>
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
                fractionQuery = QueryHelper.AddSortToQuery(fractionQuery, pnRequestModel.Sort, pnRequestModel.IsSortDsc, exludeSort);

                fractionsStatsByYearModel.Total = await fractionQuery.Select(x => x.Id).CountAsync();
                var fractionsStatsByYear = await fractionQuery
                    .Select(x => new StatByYearModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Weighings = trashInspectionsQuery.Count(t => t.FractionId == x.Id),
                        ControlPercentage = 0,
                        AmountOfWeighingsControlled = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.Status == 100),
                        ApprovedPercentage = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.IsApproved && t.Status == 100),
                        NotApprovedPercentage = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.ApprovedValue == "3" && t.Status == 100),
                        ConditionalApprovedPercentage = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.ApprovedValue == "2" && t.Status == 100)

                    })
                    .ToListAsync();

                foreach (var statByYearModel in fractionsStatsByYear)
                {

                    if (statByYearModel.Weighings > 0)
                    {
                        statByYearModel.ControlPercentage = Math.Round((statByYearModel.AmountOfWeighingsControlled / statByYearModel.Weighings) * 100, 1);
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
                    fractionsStatsByYear = pnRequestModel.IsSortDsc
                        ? fractionsStatsByYear.OrderByDescending(x => x.GetPropValue(pnRequestModel.Sort)).ToList()
                        : fractionsStatsByYear.OrderBy(x => x.GetPropValue(pnRequestModel.Sort)).ToList();
                }

                fractionsStatsByYearModel.Entities = fractionsStatsByYear;

                return new OperationDataResult<Paged<StatByYearModel>>(true, fractionsStatsByYearModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<Paged<StatByYearModel>>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingFractions"));
            }
        }

        public async Task<OperationDataResult<StatByMonth>> GetSingleFractionByMonth(int fractionId, int year)
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
                 trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Year == year && x.FractionId == fractionId);
                 //double wheigingsPrYear = await trashInspectionsQuery.CountAsync();
                 //double wheigingsPrYearControlled = await trashInspectionsQuery.CountAsync(x => x.Status == 100);
                 //var avgControlPercentagePrYear = (wheigingsPrYearControlled / wheigingsPrYear) * 100;
                 for (int i = 0, j = 0; i < months.Count; i++, j++)
                 {
                     var month = months[i];
                     trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Month == i);
                     //double wheigingsPrMonth = await trashInspectionsQuery.CountAsync();
                     double wheigingsPrMonthControlled = await trashInspectionsQuery.CountAsync(x => x.Status == 100);
                     double wheighingsApprovedPrMonth =
                         await trashInspectionsQuery.CountAsync(x => x.IsApproved && x.Status == 100);
                     double wheighingsNotApprovedPrMonth =
                         await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "3" && x.Status == 100);
                     double wheighingsPartiallyApprovedPrMonth =
                         await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "2" && x.Status == 100);
                     double approvedWheighingsPercentage = 0;
                     double notApprovedWheighingPercentage = 0;
                     double partiallyApprovedWheighingPercentage = 0;
                     if (Math.Abs(wheigingsPrMonthControlled) > 0)
                     {
                         approvedWheighingsPercentage = Math.Round(
                             (wheighingsApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                         notApprovedWheighingPercentage =
                             Math.Round((wheighingsNotApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                         partiallyApprovedWheighingPercentage =
                             Math.Round((wheighingsPartiallyApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                     }

                     var period = new Period {Name = month, Series = new List<SeriesObject>()};
                     //Bar Chart Data
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
                 }

                 statByMonth.StatByMonthListData2.Add(linePeriod);

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