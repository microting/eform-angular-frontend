using System;
using System.Configuration;
using System.Linq;
using System.Net;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using eFormAPI.Core.Helpers.WritableOptions;
using eFormAPI.Core.Services.Identity;
using eFormCore;
using eFormCore.Installers;
using eFormData;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Rebus.Bus;

namespace eFormAPI.Core.Services
{
    public class EFormCoreService : IEFormCoreService
    {
        private readonly IWritableOptions<ConnectionStrings> _connectionStrings;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private eFormCore.Core _core;
        private readonly ILogger<EFormCoreService> _logger;
        private IWindsorContainer _container;
        public IBus Bus;

        public EFormCoreService(IWritableOptions<ConnectionStrings> connectionStrings,
            ILogger<EFormCoreService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _connectionStrings = connectionStrings;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public eFormCore.Core GetCore()
        {
            try
            {
                var connectionString = _connectionStrings.Value.SdkConnection;
                if (string.IsNullOrEmpty(connectionString))
                {
                    throw new Exception();
                }
            }
            catch (Exception)
            {
                // 


                _httpContextAccessor.HttpContext.Response.OnStarting(async () =>
                {
                    _httpContextAccessor.HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                    await _httpContextAccessor.HttpContext.Response.Body.FlushAsync();
                });
                //  throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

            _core = new eFormCore.Core();
            var connectionStr = _connectionStrings.Value.SdkConnection;
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
                _container = new WindsorContainer();
                _container.Register(Component.For<eFormCore.Core>().Instance(_core));
                _container.Install(new RebusHandlerInstaller(),
                    new RebusInstaller(_connectionStrings.Value.DefaultConnection, 1, 1)); // TODO 1,1 parameters
                this.Bus = _container.Resolve<IBus>();
                return _core;
            }

            _logger.LogError("Core is not running");
            throw new Exception("Core is not running");
        }
    }
}