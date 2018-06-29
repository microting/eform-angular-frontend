using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Linq;
using Castle.Core.Internal;
using eFormAPI.Web.Infrastructure.Attributes;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Identity;
using eFormAPI.Web.Infrastructure.Identity.Providers;
using EformBase.Pn.Infrastructure.Data;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace eFormAPI.Web
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit https://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(BaseDbContext.Create);
            app.CreatePerOwinContext<EformUserManager>(EformUserManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                ExpireTimeSpan = TimeSpan.FromDays(1)
            });
            // app.UseExternalSignInCookie(OAuthOptions DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/api/auth/token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/auth/external-login"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

            // Culture
            app.Use(typeof(LocaleMiddleware));

            // Load Plugins
            var assemblies = PluginHelper.GetPluginAssemblies();
            // Migrate databases
            foreach (var assembly in assemblies)
            {
                var contextList = assembly.GetTypes().Where(x => x.BaseType?.Name == nameof(DbContext)).ToList();
                foreach (var dbContextType in contextList)
                {
                    var dbContext = dbContextType.CreateInstance<DbContext>();
                    var migrationConfigurationType = assembly.GetTypes()
                        .FirstOrDefault(x => x.Name == "PnMigrationConfiguration");
                    // migrate DB
                    try
                    {
                        var connectionString = dbContext.Database.Connection.ConnectionString;
                        var migrationConfiguration = migrationConfigurationType
                            .CreateInstance<DbMigrationsConfiguration>();
                        migrationConfiguration.TargetDatabase =
                            new DbConnectionInfo(connectionString, "System.Data.SqlClient");
                        migrationConfiguration.AutomaticMigrationsEnabled = true;
                        var migrator = new DbMigrator(migrationConfiguration);
                        migrator.Update();
                    }
                    catch (Exception exception)
                    {
                        throw new Exception($"Error while migrating plugins DB: {exception.Message}");
                    }
                }
            }


            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");

            //app.UseFacebookAuthentication(
            //    appId: "",
            //    appSecret: "");

            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "",
            //    ClientSecret = ""
            //});
        }
    }
}