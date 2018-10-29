using System;
using System.Collections.Generic;

namespace eFormAPI.Web.Services
{

    public class MenuItem
    {
        public string Name { get; set; }

        public List<MenuItem> MenuItems { get; set; }
    }

    public class MenuModel
    {
        public List<MenuItem> MenuItems { get; set; }
    }

    public class MenuService
    {
        public MenuModel GetCurrentUserMenu()
        {
            try
            {
                return null;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}