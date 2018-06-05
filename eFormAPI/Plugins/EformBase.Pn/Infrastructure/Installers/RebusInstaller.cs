using System;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Rebus.Config;

namespace EformBase.Pn.Infrastructure.Installers
{
    public class RebusInstaller : IWindsorInstaller
    {
        private readonly string connectionString;

        public RebusInstaller(string connectionString)
        {
            if (string.IsNullOrEmpty(connectionString)) throw new ArgumentNullException(nameof(connectionString));
            this.connectionString = connectionString;
        }

        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            Configure.With(new CastleWindsorContainerAdapter(container))
                .Logging(l => l.ColoredConsole())
                .Transport(t => t.UseSqlServer(connectionStringOrConnectionStringName: connectionString,
                    tableName: "Rebus", inputQueueName: "angular-input"))
                .Options(o =>
                {
                    o.SetMaxParallelism(1);
                    o.SetNumberOfWorkers(1);
                })
                .Start();
        }
    }
}