namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    public class ItemsListRequestModel
    {
        public string NameFilter { get; set; }
        public string Sort { get; set; }
        public int PageIndex { get; set; }
        public int Offset { get; set; }
        public bool IsSortDsc { get; set; }
        public int PageSize { get; set; }
    }
}