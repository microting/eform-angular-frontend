using System;
using System.Linq;
using System.Net;
using System.Web.Http;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using eFormCore;
using EformBase.Pn.Infrastructure.Installers;
using NLog;
using Rebus.Bus;

namespace EformBase.Pn.Infrastructure
{
    public class EFormCoreHelper
    {
        private Core _core;
        private readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private IWindsorContainer container;
        public IBus bus;

        public Core GetCore()
        {
            string[] lines;
            try
            {
                lines =
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
            var running = false;
            _core.HandleEventException += EventException;

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
            Logger.Error("Core is not running");
            throw new Exception("Core is not running");
        }

        #region events

        public void EventException(object sender, EventArgs args)
        {
            try
            {
                Logger.Trace(sender + Environment.NewLine);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("bin") && ex.Message.Contains("log.txt"))
                {
                    System.IO.Directory.CreateDirectory(
                        System.Web.Hosting.HostingEnvironment.MapPath("~/bin/log/log.txt"));
                }
                EventException(ex, EventArgs.Empty);
            }
        }

        #endregion
    }
}