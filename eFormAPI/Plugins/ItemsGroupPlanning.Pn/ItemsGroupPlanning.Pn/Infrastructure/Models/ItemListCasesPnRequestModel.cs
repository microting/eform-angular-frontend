namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using System;

    public class ItemListCasesPnRequestModel
    {
        public string NameFilter { get; set; }
        public string Sort { get; set; }
        public int PageIndex { get; set; }
        public int Offset { get; set; }
        public bool IsSortDsc { get; set; }
        public int PageSize { get; set; }
        public int ListId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}