using System;
using System.Collections.Generic;
using System.Linq;
using eFormAPI.Common.Models.Cases.Request;

namespace eFormAPI.Web.Infrastructure.Helpers
{
    public static class CaseUpdateHelper
    {
        public static List<string> GetStatusByEditRequest(CaseEditRequest editRequest)
        {
            var list = new List<string>();
            switch (editRequest.Status)
            {
                case "approved":
                    list.Add($"{editRequest.Id}|approved");
                    break;
                case "not_approved":
                    list.Add($"{editRequest.Id}|not_approved");
                    break;
                case "review":
                    list.Add($"{editRequest.Id}|review");
                    break;
            }
            return list;
        }

        public static List<string> GetCheckList(CaseEditRequest editRequest)
        {
            var list = new List<string>();
            list.AddRange(GetStatusByEditRequest(editRequest));
            editRequest?.ElementList?.ForEach(edit => { list.AddRange(GetCheckList(edit)); });
            return list;
        }


        public static List<string> GetFieldValuesByRequestField(CaseEditRequestField editRequestField)
        {
            var list = new List<string>();

            switch (editRequestField.FieldType)
            {
                case "CheckBox":
                    var checkBoxfirst = editRequestField?.FieldValues?.First();
                    if (checkBoxfirst?.Value != null && checkBoxfirst?.FieldId != null)
                    {
                        string val = $"{checkBoxfirst.FieldId}|{checkBoxfirst.Value.ToString()}";
                        list.Add(val);
                    }
                    break;
                case "Comment":
                    var commentFirst = editRequestField?.FieldValues?.First();
                    if (commentFirst?.Value != null && commentFirst?.FieldId != null)
                    {
                        string val = $"{commentFirst.FieldId}|{commentFirst.Value.ToString()}";
                        list.Add(val);
                    }
                    break;
                case "Number":
                    var numberFirst = editRequestField?.FieldValues?.First();
                    if (numberFirst?.Value != null && numberFirst?.FieldId != null)
                    {
                        string val = $"{numberFirst.FieldId}|{numberFirst.Value.ToString()}";
                        list.Add(val);
                    }
                    break;
                case "Text":
                    var textFirst = editRequestField?.FieldValues?.First();
                    if (textFirst?.Value != null && textFirst?.FieldId != null)
                    {
                        string val = $"{textFirst.FieldId}|{textFirst.Value.ToString()}";
                        list.Add(val);
                    }
                    break;
                case "Date":
                    var dateFirst = editRequestField?.FieldValues?.First();
                    if (dateFirst?.Value != null && dateFirst?.FieldId != null)
                    {
                        try
                        {
                            DateTime currentDate = (DateTime)dateFirst.Value;
                            if (currentDate != null)
                            {
                                string val = $"{dateFirst.FieldId}|{currentDate:yyyy-MM-dd}";
                                list.Add(val);
                            }
                        }
                        catch
                        {
                            // ignored
                        }
                    }
                    break;
                case "SingleSelect":
                    var singleFirst = editRequestField?.FieldValues?.First();
                    if (singleFirst?.Value != null && singleFirst?.FieldId != null)
                    {
                        string val = $"{singleFirst.FieldId}|{singleFirst.Value.ToString()}";
                        list.Add(val);
                    }
                    break;
                case "MultiSelect":
                    var multiFirst = editRequestField?.FieldValues?.First();
                    if (multiFirst?.Value != null && multiFirst?.FieldId != null)
                    {
                        string val = $"{multiFirst.FieldId}|{multiFirst.Value.ToString()}";
                        list.Add(val);
                    }
                    break;
            }
            return list;
        }


        public static List<string> GetFieldList(CaseEditRequest editRequest)
        {
            var list = new List<string>();
            // case 1 (It is field list)
            editRequest.Fields.ForEach(field => { list.AddRange(GetFieldValuesByRequestField(field)); });
            // case 2 (It is group field list)
            editRequest.GroupFields.ForEach(fields =>
            {
                fields.Fields.ForEach(field => { list.AddRange(GetFieldValuesByRequestField(field)); });
            });
            // case 3 (It is element list)
            editRequest?.ElementList?.ForEach(edit => { list.AddRange(GetFieldList(edit)); });
            return list;
        }
    }
}