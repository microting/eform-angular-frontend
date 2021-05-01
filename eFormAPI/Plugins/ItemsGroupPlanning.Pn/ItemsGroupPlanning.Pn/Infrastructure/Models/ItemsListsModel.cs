namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using System.Collections.Generic;

    public class ItemsListsModel
    {
        public int Total { get; set; }
        public List<ItemsListPnModel> Lists { get; set; }

        public ItemsListsModel()
        {
            Lists = new List<ItemsListPnModel>();
        }
    }
}