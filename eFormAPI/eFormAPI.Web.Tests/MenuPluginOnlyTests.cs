using System.Linq;
using eFormAPI.Web.Services;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using NSubstitute;
using System.Collections.Generic;
using MenuItemModel = eFormAPI.Web.Infrastructure.Models.Menu.MenuItemModel;
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

    private static MenuItemModel Child(params string[] guards) => new() { Guards = guards.ToList() };

    [Test]
    public void DropdownGuards_AreTheDistinctUnionOfTheChildrensGuards()
    {
        var guards = MenuService.DropdownGuards([Child("a"), Child("b", "a")]);

        Assert.That(guards, Is.EqualTo(new[] { "a", "b" }));
    }

    [Test]
    public void DropdownGuards_AreEmptyWhenAnyChildIsUnguarded()
    {
        Assert.That(MenuService.DropdownGuards([Child("a"), Child()]), Is.Empty);
    }

    private static IUserService User(string role)
    {
        var user = Substitute.For<IUserService>();
        user.Role.Returns(role);
        user.IsInRole(Arg.Any<string>()).Returns(ci => role != null && ci.Arg<string>() == role);
        return user;
    }

    [TestCase("kanban", true)]
    [TestCase(EformRole.Admin, false)]
    [TestCase(EformRole.User, false)]
    [TestCase(null, false)] // a roleless user keeps the full menu, as before
    [TestCase("", false)]
    public void IsPluginOnly_NeedsARoleThatIsNeitherAdminNorUser(string role, bool expected)
    {
        Assert.That(MenuService.IsPluginOnly(User(role)), Is.EqualTo(expected));
    }
}
