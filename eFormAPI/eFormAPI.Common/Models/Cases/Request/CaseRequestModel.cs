namespace eFormAPI.Common.Models.Cases.Response
{
    public class CaseRequestModel
    {
        public string Sort { get; set; }
        public string NameFilter { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int? TemplateId { get; set; }
        public bool IsSortDsc { get; set; }
        public int Offset { get; set; }

        public CaseRequestModel()
        {
            Sort = "";
            NameFilter = "";
            PageSize = 10;
            PageIndex = 0;
            Offset = 0;
        }
    }
}