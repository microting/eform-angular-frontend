using System.Linq;
using eFormAPI.Web.Services;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;
using NUnit.Framework;

namespace eFormAPI.Web.Tests;

[TestFixture]
public class MenuPluginOnlyTests
{
    [Test]
    public void KeepPluginItemsOnly_KeepsPluginLinksAndTheirDropdown()
    {
        var myEforms = new MenuItem { Id = 1, Name = "My eForms", MenuTemplate = new MenuTemplate { EformPluginId = null } };
        var advanced = new MenuItem { Id = 2, Name = "Advanced", MenuTemplate = null };
        var sites = new MenuItem { Id = 3, Name = "Sites", ParentId = 2, MenuTemplate = new MenuTemplate { EformPluginId = null } };
        var kanban = new MenuItem { Id = 4, Name = "Dropdown", MenuTemplate = null };
        var boards = new MenuItem { Id = 5, Name = "Boards", ParentId = 4, MenuTemplate = new MenuTemplate { EformPluginId = 9 } };

        var kept = MenuService.KeepPluginItemsOnly([myEforms, advanced, sites, kanban, boards]);

        Assert.That(kept.Select(i => i.Id), Is.EquivalentTo(new[] { 4, 5 }));
    }

    [Test]
    public void KeepPluginItemsOnly_KeepsTopLevelPluginLink()
    {
        var myEforms = new MenuItem { Id = 1, Name = "My eForms", MenuTemplate = new MenuTemplate { EformPluginId = null } };
        var boards = new MenuItem { Id = 2, Name = "Boards", MenuTemplate = new MenuTemplate { EformPluginId = 9 } };

        var kept = MenuService.KeepPluginItemsOnly([myEforms, boards]);

        Assert.That(kept.Select(i => i.Id), Is.EquivalentTo(new[] { 2 }));
    }
}
