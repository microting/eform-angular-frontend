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


namespace eFormAPI.Web.Infrastructure.Helpers;

using Microting.EformAngularFrontendBase.Infrastructure.Const;
using System.Collections.Generic;
using System.Linq;
using Models.Reports;
using Microting.eForm.Infrastructure.Constants;

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
                for (var i = 0; i < dataItem.KeyValuePairList.Count; i++)
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