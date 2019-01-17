using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Reports;
using eFormData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class EformReportsService : IEformReportsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly BaseDbContext _dbContext;
        private readonly ILogger<EformReportsService> _logger;

        public EformReportsService(
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            BaseDbContext dbContext,
            ILogger<EformReportsService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _dbContext = dbContext;
            _logger = logger;
        }

        private static List<EformReportElementsModel> GetReportElementsList(
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
                .Select(x => new EformReportElementsModel()
                {
                    Id = x.Id,
                    ElementId = x.ElementId,
                    Label = elements.Where(y => y.Id == x.ElementId)
                        .Select(y => y.Label)
                        .FirstOrDefault(),
                    ElementList = GetReportElementsList(x,
                        (List<object>) groupElements.Where(y => y.Id == x.ElementId)
                            .Select(y => (object) y.ElementList)
                            .FirstOrDefault()),
                    DataItemList = GetReportDataItemList(x, null,
                        (List<object>) dataElements.Where(y => y.Id == x.ElementId)
                            .Select(y => (object) y.DataItemList)
                            .FirstOrDefault()),
                }).ToList();
        }

        private static List<EformReportDataItemModel> GetReportDataItemList(
            EformReportElement parentElement, EformReportDataItem parentDataItem,
            List<object> dataItemsList)
        {
            var parentItems = new List<EformReportDataItem>();

            if (parentElement != null)
            {
                parentItems.AddRange(parentElement.DataItems);
            }

            if (parentDataItem != null)
            {
                parentItems.AddRange(parentDataItem.NestedDataItems);
            }

            var result = new List<EformReportDataItemModel>();
            foreach (var dataItem in parentItems.OrderBy(c => c.Position))
            {
                var model = new EformReportDataItemModel
                {
                    Id = dataItem.Id,
                    DataItemId = dataItem.DataItemId,
                    Position = dataItem.Position,
                    Visibility = dataItem.Visibility,
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
                            model.DataItemList = GetReportDataItemList(null, dataItem,
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
                                    Selected = keyValuePair.Selected,
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
                                    Selected = keyValuePair.Selected,
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
                var core = _coreHelper.GetCore();
                MainElement template = core.TemplateRead(templateId);
                if (template == null)
                {
                    return new OperationDataResult<EformReportFullModel>(false,
                        _localizationService.GetString(""));
                }

                var eformReport = await _dbContext.EformReports
                    .Where(x => x.TemplateId == templateId)
                    .Select(x => new EformReportModel()
                    {
                        Id = x.Id,
                        TemplateId = x.TemplateId,
                        Description = x.Description,
                        HeaderImage = x.HeaderImage == null ? string.Empty : Encoding.UTF8.GetString(x.HeaderImage),
                        HeaderVisibility = x.HeaderVisibility,
                        IsDateVisible = x.IsDateVisible,
                        IsWorkerNameVisible = x.IsWorkerNameVisible,
                    }).FirstOrDefaultAsync();

                if (eformReport == null)
                {
                    return new OperationDataResult<EformReportFullModel>(true, result);
                }

                var reportElements = await _dbContext.EformReportElements
                    .Include(x => x.DataItems)
                    .ThenInclude(x => x.NestedDataItems)
                    .Include(x => x.NestedElements)
                    .ThenInclude(x => x.DataItems)
                    .ThenInclude(x => x.NestedDataItems)
                    .Where(x => x.EformReportId == eformReport.Id)
                    .ToListAsync();


                var reportElementsOrdered = new List<EformReportElementsModel>();
                foreach (var templateElement in template.ElementList)
                {
                    var reportElement = reportElements
                        .FirstOrDefault(p => p.ElementId == templateElement.Id);
                    if (reportElement != null)
                    {
                        var element = new EformReportElementsModel()
                        {
                            Id = reportElement.Id,
                            ElementId = reportElement.ElementId,
                            Label = reportElement.ElementId.ToString(),
                        };
                        if (templateElement.GetType() == typeof(DataElement))
                        {
                            var item = (DataElement) templateElement;
                            var dataItemList = GetReportDataItemList(reportElement, null,
                                item.DataItemList.Select(x => (object) x).ToList());
                            element.DataItemList = dataItemList;
                        }

                        if (templateElement.GetType() == typeof(GroupElement))
                        {
                            var item = (GroupElement) templateElement;
                            var elementList = GetReportElementsList(reportElement,
                                item.ElementList.Select(x => (object) x).ToList());
                            element.ElementList = elementList;
                        }

                        reportElementsOrdered.Add(element);
                    }
                }

                result.EformMainElement = new EformMainElement()
                {
                    Id = template.Id,
                    Label = template.Label,
                    ElementList = reportElementsOrdered
                };

                result.EformReport = eformReport;
                return new OperationDataResult<EformReportFullModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogCritical(e, e.Message);
                return new OperationDataResult<EformReportFullModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> UpdateEformReport(EformReportFullModel requestModel)
        {
            try
            {
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    var eformReport = _dbContext.EformReports
                        .FirstOrDefault(x => x.Id == requestModel.EformReport.Id);

                    if (eformReport == null)
                    {
                        return new OperationResult(false,
                            _localizationService.GetString(""));
                    }

                    eformReport.Description = requestModel.EformReport.Description;
                    if (!string.IsNullOrEmpty(requestModel.EformReport.HeaderImage))
                    {
                        eformReport.HeaderImage = Encoding.UTF8.GetBytes(requestModel.EformReport.HeaderImage);
                    }

                    eformReport.HeaderVisibility = requestModel.EformReport.HeaderVisibility;
                    eformReport.IsDateVisible = requestModel.EformReport.IsDateVisible;
                    eformReport.IsWorkerNameVisible = requestModel.EformReport.IsWorkerNameVisible;
                    //         eformReport.ReportElements


                    transaction.Commit();
                }

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.LogCritical(e, e.Message);
                return new OperationResult(false,
                    _localizationService.GetString(""));
            }
        }
    }
}