namespace eFormAPI.Web.Infrastructure.Models.Cases.Request
{
    public class CaseEditRequestFieldValue
    {
        public dynamic Value { get; set; }
        public int FieldId { get; set; }
        public string FieldType { get; set; }
    }
}