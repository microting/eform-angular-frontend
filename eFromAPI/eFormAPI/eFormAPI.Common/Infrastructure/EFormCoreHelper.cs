using System;
using System.Linq;
using System.Net;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using eFormCore;
using eFormCore.Installers;
using Rebus.Bus;

namespace eFormAPI.Common.Infrastructure
{
    public class EFormCoreHelper
    {
        private Core _core;
   //     private readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private IWindsorContainer container;
        public IBus bus;

        public Core GetCore()
        {
            string[] lines = new []{""};
            try
            {
             var  lines = "";
                    System.IO.File.ReadAllLines(System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt"));

                if (string.IsNullOrEmpty(lines[0]))
                {
                    throw new Exception();
                }
            }
            catch (Exception)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }


            var connectionStr = lines.First();

            _core = new Core();
            bool running;

            try
            {
                running = _core.StartSqlOnly(connectionStr);
            }
            catch (Exception)
            {
                AdminTools adminTools = new AdminTools(connectionStr);
                adminTools.MigrateDb();
                adminTools.DbSettingsReloadRemote();
                running = _core.StartSqlOnly(connectionStr);
            }

            if (running)
            {
                container = new WindsorContainer();
                container.Register(Component.For<Core>().Instance(_core));
                container.Install(new RebusHandlerInstaller(), new RebusInstaller(System.Configuration.ConfigurationManager.ConnectionStrings["eFormMainConnection"].ConnectionString));
                this.bus = container.Resolve<IBus>();
                return _core;
            }
       //     Logger.Error("Core is not running");
            throw new Exception("Core is not running");
        }

        #region events

        #endregion
    }
}