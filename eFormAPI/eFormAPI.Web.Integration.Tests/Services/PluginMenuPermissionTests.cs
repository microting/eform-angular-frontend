/*
The MIT License (MIT)

Copyright (c) 2007 - 2026 Microting A/S

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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.Settings.Plugins;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.PluginsManagement.MenuItemsLoader;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using eFormAPI.Web.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services
{
    /// <summary>
    /// Several links of one plugin may carry the same claim. Permissions.ClaimName is unique, so the
    /// menu loaders must reuse the permission instead of inserting it once per link.
    /// </summary>
    [TestFixture]
    public class PluginMenuPermissionTests : DbTestFixture
    {
        // Unique per test: the fixture's cleanup does not reach every menu table.
        private string _suffix;

        public override void DoSetup()
        {
            _suffix = Guid.NewGuid().ToString("N")[..8];

            // The fixture truncates Permissions with foreign key checks off, so seeded template links can
            // point at permission ids that a new permission then reuses. Drop those orphans.
            DbContext.MenuTemplatePermissions
                .Where(x => !DbContext.Permissions.Any(p => p.Id == x.PermissionId))
                .ExecuteDelete();

            if (!DbContext.MenuItems.Any(x => x.ParentId == null))
            {
                DbContext.MenuItems.Add(new MenuItem
                {
                    Name = "Anchor", E2EId = "anchor", Link = "/", Type = MenuItemTypeEnum.Link, Position = 0
                });
                DbContext.SaveChanges();
            }
        }

        [Test]
        public void Load_TwoLinksShareAClaim_CreatesOnePermissionLinkedToBoth()
        {
            var claim = $"test_shared_{_suffix}";

            var pluginId = LoadPluginMenu(claim, claim);

            var permissions = DbContext.Permissions.Where(x => x.ClaimName == claim).ToList();
            Assert.That(permissions, Has.Count.EqualTo(1));
            var permissionId = permissions[0].Id;
            var links = DbContext.MenuTemplatePermissions.Where(x => x.PermissionId == permissionId)
                .Select(x => new { x.Id, x.MenuTemplateId, x.MenuTemplate.E2EId, x.MenuTemplate.EformPluginId })
                .ToList();
            Assert.That(links, Has.Count.EqualTo(2), string.Join(", ", links));
            Assert.That(DbContext.MenuItems.Count(x => x.E2EId.StartsWith($"{pluginId}-link-")), Is.EqualTo(2));
        }

        [Test]
        public async Task Remove_TwoLinksShareAClaim_RemovesThePermissionAndItsType()
        {
            var claim = $"test_shared_{_suffix}";
            var pluginId = LoadPluginMenu(claim, claim);

            var result = await Service().RemoveNavigationMenuOfPlugin(pluginId);

            Assert.That(result.Success, Is.True, result.Message);
            Assert.That(DbContext.Permissions.Any(x => x.ClaimName == claim), Is.False);
            Assert.That(DbContext.PermissionTypes.Any(x => x.Name == $"Type {_suffix}"), Is.False);
        }

        [Test]
        public async Task Remove_ClaimSharedWithAnotherPlugin_KeepsThePermissionForIt()
        {
            var claim = $"test_shared_{_suffix}";
            var first = LoadPluginMenu(claim);
            var second = LoadPluginMenu(claim);

            var result = await Service().RemoveNavigationMenuOfPlugin(second);

            Assert.That(result.Success, Is.True, result.Message);
            var permission = DbContext.Permissions.Single(x => x.ClaimName == claim);
            var firstPluginId = DbContext.EformPlugins.Single(x => x.PluginId == first).Id;
            Assert.That(DbContext.MenuTemplatePermissions.Count(x =>
                x.PermissionId == permission.Id && x.MenuTemplate.EformPluginId == firstPluginId), Is.EqualTo(1));
        }

        [Test]
        public void Link_ClaimAlreadyInDatabase_ReusesThePermission()
        {
            var claim = $"test_existing_{_suffix}";
            var existing = new Permission
            {
                ClaimName = claim,
                PermissionName = "Existing",
                PermissionType = new PermissionType { Name = $"Type {_suffix}" }
            };
            DbContext.Permissions.Add(existing);
            DbContext.SaveChanges();
            var templateId = AddTemplate($"template-{_suffix}");

            MenuTemplatePermissionWriter.Link(DbContext, templateId, new[] { PermissionModel(claim) });

            Assert.That(DbContext.Permissions.Count(x => x.ClaimName == claim), Is.EqualTo(1));
            Assert.That(DbContext.MenuTemplatePermissions
                .Any(x => x.MenuTemplateId == templateId && x.PermissionId == existing.Id), Is.True);
        }

        [Test]
        public void Link_TwoNewClaimsOfANewType_CreatesTheTypeOnce()
        {
            var typeName = $"Type {_suffix}";
            var templateId = AddTemplate($"template-{_suffix}");

            MenuTemplatePermissionWriter.Link(DbContext, templateId, new[]
            {
                PermissionModel($"test_a_{_suffix}", typeName),
                PermissionModel($"test_b_{_suffix}", typeName)
            });

            Assert.That(DbContext.PermissionTypes.Count(x => x.Name == typeName), Is.EqualTo(1));
            Assert.That(DbContext.MenuTemplatePermissions.Count(x => x.MenuTemplateId == templateId),
                Is.EqualTo(2));
        }

        private int AddTemplate(string e2eId)
        {
            var template = new MenuTemplate { Name = e2eId, E2EId = e2eId, DefaultLink = "/" };
            DbContext.MenuTemplates.Add(template);
            DbContext.SaveChanges();
            return template.Id;
        }

        private PluginMenuTemplatePermissionModel PermissionModel(string claim, string typeName = null)
        {
            return new PluginMenuTemplatePermissionModel
            {
                ClaimName = claim,
                PermissionName = claim,
                PermissionTypeName = typeName ?? $"Type {_suffix}"
            };
        }

        private PluginMenuItemModel LinkItem(string e2eId, int position, string claim)
        {
            return new PluginMenuItemModel
            {
                E2EId = e2eId,
                Name = e2eId,
                Link = $"/{e2eId}",
                Type = MenuItemTypeEnum.Link,
                Position = position,
                MenuTemplate = new PluginMenuTemplateModel
                {
                    Name = e2eId,
                    E2EId = e2eId,
                    DefaultLink = $"/{e2eId}",
                    Permissions = new List<PluginMenuTemplatePermissionModel> { PermissionModel(claim) }
                }
            };
        }

        /// <summary>Adds a plugin and loads a dropdown whose links all carry the given claims.</summary>
        private string LoadPluginMenu(params string[] claims)
        {
            var pluginId = $"test-plugin-{Guid.NewGuid():N}";
            DbContext.EformPlugins.Add(new EformPlugin { PluginId = pluginId });
            DbContext.SaveChanges();

            var dropdown = new PluginMenuItemModel
            {
                E2EId = $"dropdown-{pluginId}",
                Name = "Dropdown",
                Type = MenuItemTypeEnum.Dropdown,
                Position = 0,
                ChildItems = claims.Select((claim, i) => LinkItem($"{pluginId}-link-{i}", i, claim)).ToList()
            };

            new PluginMenuItemsLoader(DbContext, pluginId).Load(new List<PluginMenuItemModel> { dropdown });
            return pluginId;
        }

        private PluginsManagementService Service()
        {
            var options = Substitute.For<IDbOptions<PluginStoreSettings>>();
            options.Value.Returns(new PluginStoreSettings());
            return new PluginsManagementService(DbContext, Substitute.For<ILocalizationService>(),
                Substitute.For<ILogger<PluginsManagementService>>(), Substitute.For<IHttpClientFactory>(),
                Substitute.For<IServiceProvider>(), options);
        }
    }
}
