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

namespace ItemsPlanning.Pn.Infrastructure.Models.Planning
{
    using System.Collections.Generic;

    public class PlanningCaseResultListModel
    {
        public int Total { get; set; }

        public List<PlanningCaseResultModel> Items { get; set; }
            = new List<PlanningCaseResultModel>();

        public bool FieldEnabled1 { get; set; }

        public bool FieldEnabled2 { get; set; }

        public bool FieldEnabled3 { get; set; }

        public bool FieldEnabled4 { get; set; }

        public bool FieldEnabled5 { get; set; }

        public bool FieldEnabled6 { get; set; }

        public bool FieldEnabled7 { get; set; }

        public bool FieldEnabled8 { get; set; }

        public bool FieldEnabled9 { get; set; }

        public bool FieldEnabled10 { get; set; }

        public bool LabelEnabled { get; set; }

        public bool DescriptionEnabled { get; set; }

        public bool DeployedAtEnabled { get; set; }

        public bool DoneAtEnabled { get; set; }

        public bool DoneByUserNameEnabled { get; set; }

        public bool UploadedDataEnabled { get; set; }

        public bool ItemNumberEnabled { get; set; }

        public bool LocationCodeEnabled { get; set; }

        public bool BuildYearEnabled { get; set; }

        public bool TypeEnabled { get; set; }

        public bool NumberOfImagesEnabled { get; set; }

        public string FieldName1 { get; set; }

        public string FieldName2 { get; set; }

        public string FieldName3 { get; set; }

        public string FieldName4 { get; set; }

        public string FieldName5 { get; set; }

        public string FieldName6 { get; set; }

        public string FieldName7 { get; set; }

        public string FieldName8 { get; set; }

        public string FieldName9 { get; set; }

        public string FieldName10 { get; set; }

        public int SdkeFormId { get; set; }
    }
}