using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Const;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Reports;
using eFormShared;

namespace eFormAPI.Web.Infrastructure.Helpers
{
    public class EformReportHelper
    {
        private int TotalSize { get; set; } = EformReportConst.HeaderSize;
        public EformMainElement AddPageBreaks(EformMainElement mainElement)
        {
            mainElement.ElementList = AddPageBreaksToElements(mainElement.ElementList);


            return mainElement;
        }

        private List<EformReportElementModel> AddPageBreaksToElements(List<EformReportElementModel> eformElements)
        {
            foreach (var element in eformElements)
            {
                if (element.ElementList.Any())
                {
                    element.ElementList = AddPageBreaksToElements(element.ElementList);
                }

                if (element.DataItemList.Any())
                {
                    element.DataItemList = AddPageBreaksToDataItems(element.DataItemList);
                }
            }


            return eformElements;
        }

        private List<EformReportDataItemModel> AddPageBreaksToDataItems(
            List<EformReportDataItemModel> dataItemList)
        {
            foreach (var dataItem in dataItemList)
            {
                // Check field type
                if (dataItem.FieldType == Constants.FieldTypes.MultiSelect)
                {
                    foreach (var keyValuePair in dataItem.KeyValuePairList)
                    {
                        TotalSize += EformReportConst.ElementSize;
                    }
                }
                else
                {
                    TotalSize += EformReportConst.ElementSize;
                }

                // Add spacing
                if (TotalSize % EformReportConst.TotalPageSize == 0)
                {
                    dataItem.IsNewPageItem = true;
                }

                // Check if it's recursive
                if (dataItem.DataItemList.Any())
                {
                    dataItem.DataItemList = AddPageBreaksToDataItems(dataItem.DataItemList);
                }

            }
            return dataItemList;
        }
    }
}
