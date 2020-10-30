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
                    E2EId = "my-eforms",
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                    Type = MenuItemTypeEnum.Link,
                    Position = 0,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 1,
                            Name = "My eForms",
                            MenuItemId = MenuTemplateIds.MyEforms,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 14,
                            Name = "Mine eForms",
                            MenuItemId = MenuTemplateIds.MyEforms,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 27,
                            Name = "Meine eForms",
                            MenuItemId = MenuTemplateIds.MyEforms,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 2,
                    Name = "Device Users",
                    Link = "/device-users",
                    E2EId = "device-users",
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                    Type = MenuItemTypeEnum.Link,
                    Position = 1,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 2,
                            Name = "Device Users",
                            MenuItemId = MenuTemplateIds.DeviceUsers,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                             Id = 15,
                             Name = "Enhedsbrugere",
                             MenuItemId = MenuTemplateIds.DeviceUsers,
                             Language = LanguageNames.Danish,
                             LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 28,
                            Name = "Gerätebenutzer ",
                            MenuItemId = MenuTemplateIds.DeviceUsers,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 3, 
                    Name = "Dropdown",
                    Link = "",
                    E2EId = "advanced",
                    MenuTemplateId = MenuTemplateIds.Advanced,
                    Type = MenuItemTypeEnum.Dropdown,
                    Position = 2,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 3,
                            Name = "Advanced",
                            MenuItemId = MenuTemplateIds.Advanced,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 16,
                            Name = "Avanceret",
                            MenuItemId = MenuTemplateIds.Advanced,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 29,
                            Name = "Fortgeschritten",
                            MenuItemId = MenuTemplateIds.Advanced,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 4,
                    Name = "Sites",
                    Link = "/advanced/sites",
                    E2EId = "sites",
                    MenuTemplateId = MenuTemplateIds.Sites,
                    Type = MenuItemTypeEnum.Link,
                    Position = 0,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 4,
                            Name = "Sites",
                            MenuItemId = MenuTemplateIds.Sites,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 17,
                            Name = "Lokationer",
                            MenuItemId = MenuTemplateIds.Sites,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 30,
                            Name = "Standorte",
                            MenuItemId = MenuTemplateIds.Sites,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 5,
                    Name = "Workers",
                    Link = "/advanced/workers",
                    E2EId = "workers",
                    MenuTemplateId = MenuTemplateIds.Workers,
                    Type = MenuItemTypeEnum.Link,
                    Position = 1,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 5,
                            Name = "Workers",
                            MenuItemId = MenuTemplateIds.Workers,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 18,
                            Name = "Medarbejder",
                            MenuItemId = MenuTemplateIds.Workers,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 31,
                            Name = "Mitarbeiter",
                            MenuItemId = MenuTemplateIds.Workers,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 6,
                    Name = "Units",
                    Link = "/advanced/units",
                    E2EId = "units",
                    MenuTemplateId = MenuTemplateIds.Units,
                    Type = MenuItemTypeEnum.Link,
                    Position = 2,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 6,
                            Name = "Units",
                            MenuItemId = MenuTemplateIds.Units,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 19,
                            Name = "Enheder",
                            MenuItemId = MenuTemplateIds.Units,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 32,
                            Name = "Einheiten",
                            MenuItemId = MenuTemplateIds.Units,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 7,
                    Name = "Searchable List",
                    Link = "/advanced/entity-search",
                    E2EId = "search",
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                    Type = MenuItemTypeEnum.Link,
                    Position = 3,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 7,
                            Name = "Searchable List",
                            MenuItemId = MenuTemplateIds.SearchableList,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 20,
                            Name = "Søgbar Lister",
                            MenuItemId = MenuTemplateIds.SearchableList,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 33,
                            Name = "Durchsuchbare Listen",
                            MenuItemId = MenuTemplateIds.SearchableList,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 8,
                    Name = "Selectable List",
                    Link = "/advanced/entity-select",
                    E2EId = "selectable-list",
                    MenuTemplateId = MenuTemplateIds.SelectableList,
                    Type = MenuItemTypeEnum.Link,
                    Position = 4,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 8,
                            Name = "Selectable list",
                            MenuItemId = MenuTemplateIds.SelectableList,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 21,
                            Name = "Valgbar Liste",
                            MenuItemId = MenuTemplateIds.SelectableList,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 34,
                            Name = "Auswählbare Liste",
                            MenuItemId = MenuTemplateIds.SelectableList,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 9,
                    Name = "Application Settings",
                    Link = "/advanced/application-settings",
                    E2EId = "application-settings",
                    MenuTemplateId = MenuTemplateIds.ApplicationSettings,
                    Type = MenuItemTypeEnum.Link,
                    Position = 6,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 9,
                            Name = "Application Settings",
                            MenuItemId = MenuTemplateIds.ApplicationSettings,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 22,
                            Name = "Applikationsindstillinger",
                            MenuItemId = MenuTemplateIds.ApplicationSettings,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 35,
                            Name = "Anwendungseinstellungen",
                            MenuItemId = MenuTemplateIds.ApplicationSettings,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 10,
                    Name = "Plugin Settings",
                    Link = "/plugins-settings",
                    E2EId = "plugins-settings",
                    MenuTemplateId = MenuTemplateIds.PluginsSettings,
                    Type = MenuItemTypeEnum.Link,
                    Position = 8,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 10,
                            Name = "Plugins Settings",
                            MenuItemId = MenuTemplateIds.PluginsSettings,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 23,
                            Name = "Plugins",
                            MenuItemId = MenuTemplateIds.PluginsSettings,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 36,
                            Name = "Plugins",
                            MenuItemId = MenuTemplateIds.PluginsSettings,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 11,
                    Name = "Folders",
                    Link = "/advanced/folders",
                    E2EId = "folders",
                    MenuTemplateId = MenuTemplateIds.Folders,
                    Type = MenuItemTypeEnum.Link,
                    Position = 5,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 11,
                            Name = "Folders",
                            MenuItemId = MenuTemplateIds.Folders,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 24,
                            Name = "Folders",
                            MenuItemId = MenuTemplateIds.Folders,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 37,
                            Name = "Folders",
                            MenuItemId = MenuTemplateIds.Folders,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 12,
                    Name = "Email Recipients",
                    Link = "/email-recipients",
                    E2EId = "email-recipients",
                    MenuTemplateId = MenuTemplateIds.EmailRecipients,
                    Type = MenuItemTypeEnum.Link,
                    Position = 7,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 12,
                            Name = "Email Recipients",
                            MenuItemId = MenuTemplateIds.EmailRecipients,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 25,
                            Name = "E-mail-modtagere",
                            MenuItemId = MenuTemplateIds.EmailRecipients,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 38,
                            Name = "E-Mail-Empfänger",
                            MenuItemId = MenuTemplateIds.EmailRecipients,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                },
                new MenuItem
                {
                    Id = 13,
                    Name = "Menu Editor",
                    Link = "/advanced/navigation-menu",
                    E2EId = "menu-editor",
                    MenuTemplateId = MenuTemplateIds.MenuEditor,
                    Type = MenuItemTypeEnum.Link,
                    Position = 9,
                    ParentId = 3,
                    Translations = new List<MenuItemTranslation>
                    {
                        new MenuItemTranslation
                        {
                            Id = 13,
                            Name = "Menu Editor",
                            MenuItemId = MenuTemplateIds.MenuEditor,
                            Language = LanguageNames.English,
                            LocaleName = LocaleNames.English,
                        },
                        new MenuItemTranslation
                        {
                            Id = 26,
                            Name = "Menu Editor",
                            MenuItemId = MenuTemplateIds.MenuEditor,
                            Language = LanguageNames.Danish,
                            LocaleName = LocaleNames.Danish,
                        },
                        new MenuItemTranslation
                        {
                            Id = 39,
                            Name = "Menü-Editor",
                            MenuItemId = MenuTemplateIds.MenuEditor,
                            Language = LanguageNames.German,
                            LocaleName = LocaleNames.German,
                        }
                    }
                }
            };
        }
    }
}
