using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Menu
{
    public class MenuItemModel
    {
        public string Name { get; set; }
        public string Link { get; set; }
        public string E2EId { get; set; }
        public int Position { get; set; }

        public List<MenuItemModel> MenuItems { get; set; }
            = new List<MenuItemModel>();
    }
}