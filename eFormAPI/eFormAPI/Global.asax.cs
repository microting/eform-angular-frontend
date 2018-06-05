using System;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using Castle.Core.Internal;
using eFormAPI.Web.Migrations;

namespace eFormAPI.Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            AutofacConfig.ConfigureContainer();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            // Enable swagger
            if (Debugger.IsAttached)
            {
                SwaggerConfig.Register(GlobalConfiguration.Configuration);
            }

            // Migrations
            try
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (ConnectionStringsSection)configuration.GetSection("connectionStrings");
                var connString = section.ConnectionStrings["eFormMainConnection"].ConnectionString;
                if (!connString.IsNullOrEmpty())
                {
                    var migrationConfiguration = new EformMigrationsConfiguration(connString)
                    {
                        TargetDatabase = new DbConnectionInfo(connString, "System.Data.SqlClient")
                    };
                    var migrator = new DbMigrator(migrationConfiguration);
                    migrator.Update();
                }
            }
            catch (Exception exception)
            {
                throw new Exception($"Error while migrate database: {exception.Message}");
            }
        }

        protected void Application_BeginRequest()
        {
            Context.Response.Cache.SetLastModifiedFromFileDependencies();
        }
    }
}