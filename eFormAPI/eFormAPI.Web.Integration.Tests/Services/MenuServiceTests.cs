/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using NUnit.Framework;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Consts;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class MenuServiceTests : DbTestFixture
    {
        private ILogger<MenuService> _logger;
        private IClaimsService _claimsService;
        private IUserService _userService;
        private IServiceProvider _serviceProvider;
        private ILocalizationService _localizationService;
        private MenuService _menuService;

        public override void DoSetup()
        {
            _logger = Substitute.For<ILogger<MenuService>>();
            _claimsService = Substitute.For<IClaimsService>();
            _userService = Substitute.For<IUserService>();
            _serviceProvider = Substitute.For<IServiceProvider>();
            _localizationService = Substitute.For<ILocalizationService>();

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());

            _menuService = new MenuService(
                _logger,
                DbContext,
                _claimsService,
                _userService,
                _serviceProvider,
                _localizationService);
        }

        [Test]
        public void MenuService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_menuService, Is.Not.Null);
        }

        private MenuItem AddItem(string name, int? parentId, int? pluginId, int position)
        {
            int? templateId = null;
            if (parentId != null)
            {
                var template = new MenuTemplate { Name = name, E2EId = name, DefaultLink = "/" + name, EformPluginId = pluginId };
                DbContext.MenuTemplates.Add(template);
                DbContext.SaveChanges();
                templateId = template.Id;
            }
            var item = new MenuItem
            {
                Name = name, E2EId = name, Link = "/" + name, Position = position, ParentId = parentId,
                MenuTemplateId = templateId,
                Type = parentId == null ? MenuItemTypeEnum.Dropdown : MenuItemTypeEnum.Link,
            };
            DbContext.MenuItems.Add(item);
            DbContext.SaveChanges();
            DbContext.MenuItemTranslations.Add(new MenuItemTranslation
                { MenuItemId = item.Id, Name = name, LocaleName = LocaleNames.English, Language = "English" });
            DbContext.SaveChanges();
            return item;
        }

        [TestCase("kanban", new[] { "PluginOnlyTest-Boards" })] // the dropdown also holds a main-app link (Sites)
        [TestCase(EformRole.Admin, new[] { "PluginOnlyTest-Boards", "PluginOnlyTest-Sites" })]
        public async Task GetCurrentUserMenu_MixedDropdown_PluginOnlyUserGetsOnlyItsPluginLinks(string role, string[] expected)
        {
            var plugin = new EformPlugin { PluginId = "plugin-only-test-pn", ConnectionString = "", Status = 1 };
            DbContext.EformPlugins.Add(plugin);
            DbContext.SaveChanges();
            var dropdown = AddItem("PluginOnlyTest-Dropdown", null, null, 9000);
            AddItem("PluginOnlyTest-Boards", dropdown.Id, plugin.Id, 1);
            AddItem("PluginOnlyTest-Sites", dropdown.Id, null, 2);
            var created = DbContext.MenuItems.Where(x => x.Name.StartsWith("PluginOnlyTest-")).Select(x => x.Id).ToList();
            try
            {
                _userService.Role.Returns(role);
                _userService.IsInRole(Arg.Any<string>()).Returns(ci => ci.Arg<string>() == role);
                _userService.GetCurrentUserLocale().Returns(LocaleNames.English);
                _userService.GetCurrentUserAsync().Returns(new EformUser { Id = 987654 });
                _claimsService.GetUserClaimsNames(Arg.Any<int>()).Returns(new List<string>());

                var result = await _menuService.GetCurrentUserMenu();

                Assert.That(result.Success, Is.True, result.Message);
                var kept = result.Model.LeftMenu.Single(x => x.E2EId == "PluginOnlyTest-Dropdown");
                Assert.That(kept.MenuItems.Select(x => x.E2EId), Is.EqualTo(expected),
                    string.Join(",", kept.MenuItems.Select(x => $"{x.E2EId}/{x.Name}")));
                if (role == "kanban")
                {
                    Assert.That(result.Model.LeftMenu.SelectMany(x => x.MenuItems.Select(c => c.E2EId).Prepend(x.E2EId)),
                        Has.None.EqualTo("PluginOnlyTest-Sites"));
                }
            }
            finally
            {
                // ClearDb truncates another schema, so remove the rows here.
                DbContext.MenuItemTranslations.RemoveRange(DbContext.MenuItemTranslations.Where(x => created.Contains(x.MenuItemId)));
                DbContext.MenuItems.RemoveRange(DbContext.MenuItems.Where(x => created.Contains(x.Id)));
                DbContext.SaveChanges();
                DbContext.MenuTemplates.RemoveRange(DbContext.MenuTemplates.Where(x => x.Name.StartsWith("PluginOnlyTest-")));
                DbContext.EformPlugins.Remove(plugin);
                DbContext.SaveChanges();
            }
        }
    }
}
