using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Menu
{
    public class MenuModel
    {
        public List<MenuItemModel> LeftMenu { get; set; }
            = new List<MenuItemModel>();

        public List<MenuItemModel> RightMenu { get; set; }
            = new List<MenuItemModel>();
    }
}
