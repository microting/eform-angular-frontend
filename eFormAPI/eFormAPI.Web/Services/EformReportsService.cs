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


namespace eFormAPI.Web.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abstractions;
using Abstractions.Eforms;
using Infrastructure.Helpers;
using Infrastructure.Models.Reports;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Models;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Reports;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

public class EformReportsService : IEformReportsService
{
    private readonly IEFormCoreService _coreHelper;
    private readonly ILocalizationService _localizationService;
    private readonly BaseDbContext _dbContext;
    private readonly IUserService _userService;
    private readonly ILogger<EformReportsService> _logger;

    public EformReportsService(
        IEFormCoreService coreHelper,
        IUserService userService,
        ILocalizationService localizationService,
        BaseDbContext dbContext,
        ILogger<EformReportsService> logger)
    {
        _coreHelper = coreHelper;
        _localizationService = localizationService;
        _dbContext = dbContext;
        _logger = logger;
        _userService = userService;
    }

    private static List<EformReportElementModel> GetReportElementsList(BaseDbContext dbContext,
        EformReportElement parent,
        List<object> elementList)
    {
        if (elementList == null)
        {
            elementList = new List<object>();
        }

        var elements = new List<Element>();
        var dataElements = new List<DataElement>();
        var groupElements = new List<GroupElement>();

        var item = elementList.FirstOrDefault();
        if (item != null)
        {
            var itemType = item.GetType();
            foreach (var element in elementList)
            {
                elements.Add((Element) element);
            }

            foreach (var element in elements)
            {
                var eformReportElement = parent.NestedElements.FirstOrDefault(x => x.ElementId == element.Id);
                if (eformReportElement == null)
                {
                    eformReportElement = new EformReportElement()
                    {
                        EformReportId = parent.EformReportId,
                        ElementId = element.Id,
                        ParentId = parent.Id
                    };
                    dbContext.EformReportElements.Add(eformReportElement);
                    dbContext.SaveChanges();
                }

                parent.NestedElements.Add(eformReportElement);
            }

            if (itemType == typeof(DataElement))
            {
                foreach (var element in elementList)
                {
                    dataElements.Add((DataElement) element);
                }
            }

            if (itemType == typeof(GroupElement))
            {
                foreach (var element in elementList)
                {
                    groupElements.Add((GroupElement) element);
                }
            }
        }

        return parent.NestedElements
            .Where(c => c.ParentId == parent.Id)
            .Select(x => new EformReportElementModel()
            {
                Id = x.Id,
                ElementId = x.ElementId,
                Label = elements.Where(y => y.Id == x.ElementId)
                    .Select(y => y.Label)
                    .FirstOrDefault(),
                ElementList = GetReportElementsList(dbContext, x,
                    groupElements.Where(y => y.Id == x.ElementId)
                        .Select(y => new List<object>(y.ElementList))
                        .FirstOrDefault()),
                DataItemList = GetReportDataItemList(dbContext, x, null,
                    dataElements.Where(y => y.Id == x.ElementId)
                        .Select(y => new List<object>(y.DataItemList))
                        .FirstOrDefault())
            }).ToList();
    }

    private static List<EformReportDataItemModel> GetReportDataItemList(BaseDbContext dbContext,
        EformReportElement parentElement, EformReportDataItem parentDataItem,
        List<object> dataItemsList)
    {
        if (dataItemsList == null)
        {
            dataItemsList = new List<object>();
        }

        var parentItems = new List<EformReportDataItem>();

        if (parentElement != null)
        {
            parentItems.AddRange(parentElement.DataItems);
        }

        if (parentDataItem != null)
        {
            parentItems.AddRange(parentDataItem.NestedDataItems);
        }

        foreach (var dataItemObject in dataItemsList)
        {
            var item = (DataItem) dataItemObject;
            var eformReportDataItem = parentItems.FirstOrDefault(x => x.DataItemId == item.Id);
            if (eformReportDataItem == null)
            {
                eformReportDataItem = new EformReportDataItem()
                {
                    DataItemId = item.Id,
                    Visibility = true
                };
                if (parentElement != null)
                {
                    eformReportDataItem.EformReportElementId = parentElement.Id;
                }

                if (parentDataItem != null)
                {
                    eformReportDataItem.ParentId = parentDataItem.ParentId;
                }

                dbContext.EformReportDataItems.Add(eformReportDataItem);
                dbContext.SaveChanges();

                eformReportDataItem = dbContext.EformReportDataItems
                    .Include(x => x.NestedDataItems)
                    .ThenInclude(x => x.NestedDataItems)
                    .FirstOrDefault(x => x.Id == eformReportDataItem.Id);

                parentItems.Add(eformReportDataItem);
            }
        }

        var result = new List<EformReportDataItemModel>();
        foreach (var dataItem in parentItems.OrderBy(c => c.Position))
        {
            var model = new EformReportDataItemModel
            {
                Id = dataItem.Id,
                DataItemId = dataItem.DataItemId,
                Position = dataItem.Position,
                Visibility = dataItem.Visibility
            };
            foreach (var dataItemObject in dataItemsList)
            {
                var type = dataItemObject.GetType();
                if (type == typeof(FieldContainer))
                {
                    var item = (FieldContainer) dataItemObject;
                    if (item.Id == dataItem.DataItemId)
                    {
                        model.FieldType = type.ToString().Remove(0, 10);
                        model.Label = item.Label;
                        model.DataItemList = GetReportDataItemList(dbContext, null, dataItem,
                            item.DataItemList.Select(x => (object) x).ToList());
                    }
                }

                if (type == typeof(MultiSelect))
                {
                    var item = (MultiSelect) dataItemObject;
                    if (item.Id == dataItem.DataItemId)
                    {
                        model.FieldType = type.ToString().Remove(0, 10);
                        model.Label = item.Label;
                        foreach (var keyValuePair in item.KeyValuePairList)
                        {
                            model.KeyValuePairList.Add(new EformKeyValuePairModel()
                            {
                                Key = keyValuePair.Key,
                                Value = keyValuePair.Value,
                                DisplayOrder = keyValuePair.DisplayOrder,
                                Selected = keyValuePair.Selected
                            });
                        }
                    }
                }

                if (type == typeof(SingleSelect))
                {
                    var item = (SingleSelect) dataItemObject;
                    if (item.Id == dataItem.DataItemId)
                    {
                        model.FieldType = type.ToString().Remove(0, 10);
                        model.Label = item.Label;
                        foreach (var keyValuePair in item.KeyValuePairList)
                        {
                            model.KeyValuePairList.Add(new EformKeyValuePairModel()
                            {
                                Key = keyValuePair.Key,
                                Value = keyValuePair.Value,
                                DisplayOrder = keyValuePair.DisplayOrder,
                                Selected = keyValuePair.Selected
                            });
                        }
                    }
                }

                // Common fields
                if (type == typeof(Audio)
                    || type == typeof(Comment)
                    || type == typeof(Date)
                    || type == typeof(EntitySearch)
                    || type == typeof(EntitySelect)
                    || type == typeof(None)
                    || type == typeof(Number)
                    || type == typeof(NumberStepper)
                    || type == typeof(Picture)
                    || type == typeof(ShowPdf)
                    || type == typeof(SaveButton)
                    || type == typeof(Signature)
                    || type == typeof(Text)
                    || type == typeof(Timer)
                    || type == typeof(CheckBox))
                {
                    var item = (DataItem) dataItemObject;
                    if (item.Id == dataItem.DataItemId)
                    {
                        model.FieldType = type.ToString().Remove(0, 10);
                        model.Label = item.Label;
                    }
                }
            }

            result.Add(model);
        }

        return result;
    }

    public async Task<OperationDataResult<EformReportFullModel>> GetEformReport(int templateId)
    {
        try
        {
            var result = new EformReportFullModel();
            var core = await _coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();

            var language = await _userService.GetCurrentUserLanguage();
            var template = await core.ReadeForm(templateId, language);
            if (template == null)
            {
                return new OperationDataResult<EformReportFullModel>(false,
                    _localizationService.GetString("TemplateNotFound"));
            }

            var eformReport = await _dbContext.EformReports
                .FirstOrDefaultAsync(x => x.TemplateId == templateId);

            if (eformReport == null)
            {
                eformReport = new EformReport
                {
                    TemplateId = template.Id,
                    IsDateVisible = true,
                    IsWorkerNameVisible = true
                };
                _dbContext.EformReports.Add(eformReport);
                await _dbContext.SaveChangesAsync();
            }

            var reportElements = await _dbContext.EformReportElements
                .Include(x => x.DataItems)
                .ThenInclude(x => x.NestedDataItems)
                .Include(x => x.NestedElements)
                .ThenInclude(x => x.DataItems)
                .ThenInclude(x => x.NestedDataItems)
                .Where(x => x.EformReportId == eformReport.Id)
                .ToListAsync();


            var reportElementsOrdered = new List<EformReportElementModel>();
            foreach (var templateElement in template.ElementList)
            {
                var reportElement = reportElements
                    .FirstOrDefault(p => p.ElementId == templateElement.Id);

                if (reportElement == null)
                {
                    reportElement = new EformReportElement()
                    {
                        EformReportId = eformReport.Id,
                        ElementId = templateElement.Id
                    };
                    _dbContext.EformReportElements.Add(reportElement);
                    await _dbContext.SaveChangesAsync();

                    reportElement = await _dbContext.EformReportElements
                        .Include(x => x.DataItems)
                        .ThenInclude(x => x.NestedDataItems)
                        .Include(x => x.NestedElements)
                        .ThenInclude(x => x.DataItems)
                        .ThenInclude(x => x.NestedDataItems)
                        .Where(x => x.EformReportId == eformReport.Id && x.ElementId == templateElement.Id)
                        .FirstOrDefaultAsync();
                }


                var element = new EformReportElementModel()
                {
                    Id = reportElement.Id,
                    ElementId = reportElement.ElementId,
                    Label = templateElement.Label
                };
                if (templateElement.GetType() == typeof(DataElement))
                {
                    var item = (DataElement) templateElement;
                    var dataItemList = GetReportDataItemList(_dbContext, reportElement, null,
                        item.DataItemList.Select(x => (object) x).ToList());
                    element.DataItemList = dataItemList;
                }

                if (templateElement.GetType() == typeof(GroupElement))
                {
                    var item = (GroupElement) templateElement;
                    var elementList = GetReportElementsList(_dbContext, reportElement,
                        item.ElementList.Select(x => (object) x).ToList());
                    element.ElementList = elementList;
                }

                reportElementsOrdered.Add(element);
            }

            result.EformMainElement = new EformMainElement()
            {
                Id = template.Id,
                Label = template.Label,
                ElementList = reportElementsOrdered
            };
            var eformReportModel = new EformReportModel()
            {
                Id = eformReport.Id,
                TemplateId = eformReport.TemplateId,
                Description = eformReport.Description,
                HeaderImage = eformReport.HeaderImage == null
                    ? string.Empty
                    : Encoding.UTF8.GetString(eformReport.HeaderImage),
                HeaderVisibility = eformReport.HeaderVisibility,
                IsDateVisible = eformReport.IsDateVisible,
                IsWorkerNameVisible = eformReport.IsWorkerNameVisible
            };
            result.EformReport = eformReportModel;

            result.EformMainElement = new EformReportHelper().AddPageBreaks(result.EformMainElement);

            return new OperationDataResult<EformReportFullModel>(true, result);
        }
        catch (Exception e)
        {
            _logger.LogCritical(e, e.Message);
            return new OperationDataResult<EformReportFullModel>(false,
                _localizationService.GetString("ErrorWhileObtainingReportInfo"));
        }
    }

    public async Task<OperationResult> UpdateEformReport(EformReportFullModel requestModel)
    {
        try
        {
            //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            //                {
            //try
            //{
            var eformReport = _dbContext.EformReports
                .FirstOrDefault(x => x.Id == requestModel.EformReport.Id);

            if (eformReport == null)
            {
                return new OperationResult(false,
                    _localizationService.GetString("EformReportNotFound"));
            }

            eformReport.Description = requestModel.EformReport.Description;
            if (!string.IsNullOrEmpty(requestModel.EformReport.HeaderImage))
            {
                eformReport.HeaderImage = Encoding.UTF8.GetBytes(requestModel.EformReport.HeaderImage);
            }

            eformReport.HeaderVisibility = requestModel.EformReport.HeaderVisibility;
            eformReport.IsDateVisible = requestModel.EformReport.IsDateVisible;
            eformReport.IsWorkerNameVisible = requestModel.EformReport.IsWorkerNameVisible;

            _dbContext.EformReports.Update(eformReport);
            await _dbContext.SaveChangesAsync();

            var elementList = requestModel.EformMainElement?.ElementList;
            if (elementList == null)
            {
                return new OperationResult(false,
                    _localizationService.GetString("ElementListNotProvided"));
            }

            var dataItems = ParseElements(elementList);
            if (dataItems.Any())
            {
                var dataItemsIds = dataItems.Select(x => x.Id).ToArray();
                var eformDataItems = await _dbContext.EformReportDataItems
                    .Where(x => dataItemsIds.Contains(x.Id)).ToListAsync();

                foreach (var eformDataItem in eformDataItems)
                {
                    var dataItem = dataItems.FirstOrDefault(x => x.Id == eformDataItem.Id);
                    if (dataItem != null)
                    {
                        eformDataItem.Position = dataItem.Position;
                        eformDataItem.Visibility = dataItem.Visibility;
                        _dbContext.EformReportDataItems.Update(eformDataItem);
                    }
                }

                await _dbContext.SaveChangesAsync();
            }

            //transaction.Commit();
            //}
            //catch (Exception)
            //{
            //transaction.Rollback();
            //    throw;
            //}
            //}

            return new OperationResult(true,
                _localizationService.GetString("ReportUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            _logger.LogCritical(e, e.Message);
            return new OperationResult(false,
                _localizationService.GetString("ErrorWhileUpdatingReport"));
        }
    }

    public List<EformReportDataItemModel> ParseDataItems(List<EformReportDataItemModel> dataItemModels)
    {
        var list = new List<EformReportDataItemModel>();
        for (var i = 0; i < dataItemModels.Count; i++)
        {
            var dataItem = dataItemModels[i];
            dataItem.Position = i;
            list.Add(dataItem);
            if (dataItem.DataItemList.Any())
            {
                list.AddRange(ParseDataItems(dataItem.DataItemList));
            }
        }

        return list;
    }

    public List<EformReportDataItemModel> ParseElements(List<EformReportElementModel> elementsModels)
    {
        var list = new List<EformReportDataItemModel>();

        foreach (var elementsModel in elementsModels)
        {
            if (elementsModel.DataItemList.Any())
            {
                list.AddRange(ParseDataItems(elementsModel.DataItemList));
            }

            if (elementsModel.ElementList.Any())
            {
                list.AddRange(ParseElements(elementsModel.ElementList));
            }
        }

        return list;
    }
}