namespace Microting.eFormApi.BasePn.Infrastructure.Models.SelectableList
{
    public class AdvEntitySelectableGroupListRequestModel
    {
        public string Sort { get; set; }
        public string NameFilter { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool IsSortDsc { get; set; }
    }
}