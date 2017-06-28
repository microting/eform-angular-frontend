using System.Collections.Generic;

namespace eFromAPI.Common.Models.Cases.Request
{
    public class CaseEditRequestField
    {
        public string FieldType { get; set; }
        public List<CaseEditRequestFieldValue> FieldValues { get; set; }
    }
}