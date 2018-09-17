using System.Collections.Generic;

namespace eFormAPI.BasePn.Models.Cases.Request
{
    public class CaseEditRequestField
    {
        public string FieldType { get; set; }
        public List<CaseEditRequestFieldValue> FieldValues { get; set; }
    }
}