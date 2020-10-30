using eFormAPI.Web.Infrastructure.Const;
using eFormAPI.Web.Infrastructure.Database.Entities.Menu;
using eFormAPI.Web.Services.PluginsManagement;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eFormAPI.Web.Infrastructure
{
    public static class RightMenuStorage
    {
        public static List<PluginMenuItemModel> GetRightMenu()
        {
            return new List<PluginMenuItemModel>()
                {
                   new PluginMenuItemModel
                {
                   E2EId = "sign-out-dropdown",
                   Name = "user",
                   Type = MenuItemTypeEnum.Dropdown,
                   Link = "",
                   Position = 0,
                   ChildItems = new List<PluginMenuItemModel>()
                    {
                        new PluginMenuItemModel
                        {
                            E2EId = "user-management-menu",
                            Name = "User Management",
                            Type = MenuItemTypeEnum.Link,
                            Link = "/account-management/users",
                            Position = 0,
                            MenuTemplate = new PluginMenuTemplateModel
                            {
                                DefaultLink =  "/account-management/users",
                                E2EId = "user-management-menu",
                                Permissions = new List<PluginMenuTemplatePermissionModel>
                                {
                                    new PluginMenuTemplatePermissionModel
                                    {
                                        ClaimName = AuthConsts.EformClaims.UserManagementClaims.Read,
                                        PermissionName = "Read",
                                        PermissionTypeName = "User management",
                                    },
                                    new PluginMenuTemplatePermissionModel
                                    {
                                        ClaimName = AuthConsts.EformClaims.UserManagementClaims.Create,
                                        PermissionName = "Create",
                                        PermissionTypeName = "User management",
                                    },
                                    new PluginMenuTemplatePermissionModel
                                    {
                                        ClaimName = AuthConsts.EformClaims.UserManagementClaims.Delete,
                                        PermissionName = "Delete",
                                        PermissionTypeName = "User management",
                                    },
                                    new PluginMenuTemplatePermissionModel
                                    {
                                        ClaimName = AuthConsts.EformClaims.UserManagementClaims.Update,
                                        PermissionName = "Update",
                                        PermissionTypeName = "User management",
                                    }
                                }
                            },
                            Translations = new List<PluginMenuTranslationModel>
                            {
                                new PluginMenuTranslationModel
                                {
                                    Name = "User Management",
                                    LocaleName = LocaleNames.English,
                                    Language = LanguageNames.English,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Brugeradministration",
                                    LocaleName = LocaleNames.Danish,
                                    Language = LanguageNames.Danish,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Benutzerverwaltung", 
                                    LocaleName = LocaleNames.German,
                                    Language = LanguageNames.German,
                                },
                            }
                        },
                        new PluginMenuItemModel
                        {
                            E2EId = "settings",
                            Name = "Settings",
                            Type = MenuItemTypeEnum.Link,
                            Link = "/account-management/settings",
                            Position = 1,
                            MenuTemplate = new PluginMenuTemplateModel
                            {
                                 DefaultLink =   "/account-management/settings",
                                 E2EId = "settings",
                            },
                            Translations = new List<PluginMenuTranslationModel>
                            {
                                new PluginMenuTranslationModel
                                {
                                    Name = "Settings",
                                    LocaleName = LocaleNames.English,
                                    Language = LanguageNames.English,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Indstillinger", 
                                    LocaleName = LocaleNames.Danish,
                                    Language = LanguageNames.Danish,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Einstellungen", 
                                    LocaleName = LocaleNames.German,
                                    Language = LanguageNames.German,
                                },
                            }
                        },
                        new PluginMenuItemModel
                        {
                            E2EId = "security",
                            Name = "Security",
                            Type = MenuItemTypeEnum.Link,
                            Link = "/security",
                            Position = 2,
                            MenuTemplate = new PluginMenuTemplateModel
                            {
                                DefaultLink = "/security",
                                E2EId = "security",
                            },
                            Translations = new List<PluginMenuTranslationModel>
                            {
                                new PluginMenuTranslationModel
                                {
                                    Name = "Security",
                                    LocaleName = LocaleNames.English,
                                    Language = LanguageNames.English,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Sikkerhed", 
                                    LocaleName = LocaleNames.Danish,
                                    Language = LanguageNames.Danish,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Sicherheit", 
                                    LocaleName = LocaleNames.German,
                                    Language = LanguageNames.German,
                                },
                            }
                        },
                        new PluginMenuItemModel
                        {
                            E2EId =  "change-password",
                            Name = "Change password",
                            Type = MenuItemTypeEnum.Link,
                            Link = "/account-management/change-password",
                            Position = 3,
                            MenuTemplate = new PluginMenuTemplateModel
                            {
                                DefaultLink = "/account-management/change-password",
                                E2EId =  "change-password",
                            },
                            Translations = new List<PluginMenuTranslationModel>
                            {
                                new PluginMenuTranslationModel
                                {
                                    Name = "Change password",
                                    LocaleName = LocaleNames.English,
                                    Language = LanguageNames.English,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Skift adgangskode", 
                                    LocaleName = LocaleNames.Danish,
                                    Language = LanguageNames.Danish,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Passwort ändern", 
                                    LocaleName = LocaleNames.German,
                                    Language = LanguageNames.German,
                                },
                            }
                        },
                        new PluginMenuItemModel
                        {
                            E2EId = "sign-out",
                            Name = "Logout",
                            Type = MenuItemTypeEnum.Link,
                            Link = "/auth/sign-out",
                            Position = 4,
                            MenuTemplate = new PluginMenuTemplateModel
                            {
                                DefaultLink = "/auth/sign-out",
                                E2EId = "sign-out",
                            },
                            Translations = new List<PluginMenuTranslationModel>
                            {
                                new PluginMenuTranslationModel
                                {
                                    Name = "Logout",
                                    LocaleName = LocaleNames.English,
                                    Language = LanguageNames.English,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Log ud",
                                    LocaleName = LocaleNames.Danish,
                                    Language = LanguageNames.Danish,
                                },
                                new PluginMenuTranslationModel
                                {
                                    Name = "Abmelden",
                                    LocaleName = LocaleNames.German,
                                    Language = LanguageNames.German,
                                },
                            }
                        },
                    }
                },
                };
        }
    }
}
