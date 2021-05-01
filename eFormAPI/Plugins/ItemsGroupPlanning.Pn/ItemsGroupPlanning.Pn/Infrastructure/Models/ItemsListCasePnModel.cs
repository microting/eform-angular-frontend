namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using System.Collections.Generic;

    public class ItemsListCasePnModel
    {
        public int Total { get; set; }
        public List<ItemsListPnItemCaseModel> Items { get; set; }
            = new List<ItemsListPnItemCaseModel>();
    }
}