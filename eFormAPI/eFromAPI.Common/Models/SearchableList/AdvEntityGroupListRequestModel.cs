namespace eFromAPI.Common.Models.SearchableList
{
    public class AdvEntityGroupListRequestModel
    {
        public string Sort { get; set; }
        public string NameFilter { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool IsSortDsc { get; set; }
    }
}
