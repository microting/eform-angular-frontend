namespace eFormAPI.Common.Models.Cases.Request
{
    public class CaseEditRequestFieldValue
    {
        public dynamic Value { get; set; }
        public int FieldId { get; set; }
        public string FieldType { get; set; }
    }
}