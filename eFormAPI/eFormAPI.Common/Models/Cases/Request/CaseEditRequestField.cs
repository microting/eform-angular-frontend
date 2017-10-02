using System.Collections.Generic;

namespace eFormAPI.Common.Models.Cases.Request
{
    public class CaseEditRequestField
    {
        public string FieldType { get; set; }
        public List<CaseEditRequestFieldValue> FieldValues { get; set; }
    }
}