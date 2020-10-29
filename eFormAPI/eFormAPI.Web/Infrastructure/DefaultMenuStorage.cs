using eFormAPI.Web.Infrastructure.Const;
using eFormAPI.Web.Infrastructure.Database.Entities.Menu;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eFormAPI.Web.Infrastructure
{
    public static class DefaultMenuStorage
    {
        public static List<MenuItem> GetDefaultMenu()
        {
            return new List<MenuItem>()
            {
                new MenuItem
                {
                    Id = 1,
                    Name = "My Eforms",
                    Link = "/",
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                    Type = MenuItemTypeEnum.Link,
                    Position = 0,
                },
                new MenuItem
                {
                    Id = 2,
                    Name = "Device Users",
                    Link = "/device-users",
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                    Type = MenuItemTypeEnum.Link,
                    Position = 1,
                },
                new MenuItem
                {
                    Id = 3, 
                    Name = "Advanced",
                    Link = "",
                    MenuTemplateId = MenuTemplateIds.Advanced,
                    Type = MenuItemTypeEnum.Dropdown,
                    Position = 2,
                },
                new MenuItem
                {
                    Id = 4,
                    Name = "Sites",
                    Link = "/advanced/sites",
                    MenuTemplateId = MenuTemplateIds.Sites,
                    Type = MenuItemTypeEnum.Link,
                    Position = 0,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 5,
                    Name = "Workers",
                    Link = "/advanced/workers",
                    MenuTemplateId = MenuTemplateIds.Workers,
                    Type = MenuItemTypeEnum.Link,
                    Position = 1,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 6,
                    Name = "Units",
                    Link = "/advanced/units",
                    MenuTemplateId = MenuTemplateIds.Units,
                    Type = MenuItemTypeEnum.Link,
                    Position = 2,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 7,
                    Name = "Searchable List",
                    Link = "/advanced/entity-search",
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                    Type = MenuItemTypeEnum.Link,
                    Position = 3,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 8,
                    Name = "Selectable List",
                    Link = "/advanced/entity-select",
                    MenuTemplateId = MenuTemplateIds.SelectableList,
                    Type = MenuItemTypeEnum.Link,
                    Position = 4,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 9,
                    Name = "Application Settings",
                    Link = "/advanced/application-settings",
                    MenuTemplateId = MenuTemplateIds.ApplicationSettings,
                    Type = MenuItemTypeEnum.Link,
                    Position = 6,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 10,
                    Name = "Plugin Settings",
                    Link = "/advanced/plugins-settings",
                    MenuTemplateId = MenuTemplateIds.PluginsSettings,
                    Type = MenuItemTypeEnum.Link,
                    Position = 8,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 11,
                    Name = "Folders",
                    Link = "/advanced/folders",
                    MenuTemplateId = MenuTemplateIds.Folders,
                    Type = MenuItemTypeEnum.Link,
                    Position = 5,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 12,
                    Name = "Email Recipients",
                    Link = "/email-recipients",
                    MenuTemplateId = MenuTemplateIds.EmailRecipients,
                    Type = MenuItemTypeEnum.Link,
                    Position = 7,
                    ParentId = 3,
                }
            };
        }
    }
}
