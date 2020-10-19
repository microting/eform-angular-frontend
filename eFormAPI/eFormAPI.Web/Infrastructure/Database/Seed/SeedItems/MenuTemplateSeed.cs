namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    using Const;
    using Entities.Menu;
    using Microsoft.EntityFrameworkCore;

    public static class MenuTemplateSeed
    {
        public static ModelBuilder AddDefaultTemplates(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuTemplate>().HasData(
                new MenuTemplate
                {
                    Id = MenuTemplateIds.MyEforms,
                    E2EId = "my-eforms",
                    Link = "/",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.DeviceUsers,
                    E2EId = "device-users",
                    Link = "/device-users",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Advanced,
                    E2EId = "advanced",
                    Link = "",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Sites,
                    E2EId = "sites",
                    Link = "/advanced/sites",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Workers,
                    E2EId = "workers",
                    Link = "/advanced/workers",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Units,
                    E2EId = "units",
                    Link = "/advanced/units",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.SearchableList,
                    E2EId = "search",
                    Link = "/advanced/entity-search",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.SelectableList,
                    E2EId = "selectable-list",
                    Link = "/advanced/entity-select",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.ApplicationSettings,
                    E2EId = "application-settings",
                    Link = "/application-settings",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.PluginsSettings,
                    E2EId = "plugins-settings",
                    Link = "/plugins-settings",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Folders,
                    E2EId = "folders",
                    Link = "/advanced/folders",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.EmailRecipients,
                    E2EId = "email-recipients",
                    Link = "/email-recipients",
                }
            );
            return modelBuilder;
        }
    }
}