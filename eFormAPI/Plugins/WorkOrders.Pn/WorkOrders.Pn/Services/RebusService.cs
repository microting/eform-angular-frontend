using Castle.Windsor;
using eFormCore;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.WorkOrderBase.Infrastructure.Data;
using Microting.WorkOrderBase.Infrastructure.Data.Factories;
using Rebus.Bus;
using System.Threading.Tasks;
using WorkOrders.Pn.Abstractions;
using WorkOrders.Pn.Infrastructure.Helpers;
using WorkOrders.Pn.Installers;

namespace WorkOrders.Pn.Services
{
    public class RebusService : IRebusService
    {
        private IBus _bus;
        private IWindsorContainer _container;
        private string _connectionString;
        private readonly IWorkOrdersLocalizationService _workOrdersLocalizationService;
        private readonly IEFormCoreService _coreHelper;

        public RebusService(IEFormCoreService coreHelper,
            IWorkOrdersLocalizationService workOrdersLocalizationService)
        {
            _coreHelper = coreHelper;
            _workOrdersLocalizationService = workOrdersLocalizationService;
        }

        public async Task Start(string connectionString)
        {
            _connectionString = connectionString;
            _container = new WindsorContainer();
            _container.Install(new RebusHandlerInstaller(),
                new RebusInstaller(connectionString, 1, 1));

            Core core = await _coreHelper.GetCore();
            DbContextHelper dbContextHelper = new DbContextHelper(connectionString);
            _container.Register(Castle.MicroKernel.Registration.Component.For<Core>().Instance(core));
            _container.Register(Castle.MicroKernel.Registration.Component.For<DbContextHelper>().Instance(dbContextHelper));
            _container.Register(Castle.MicroKernel.Registration.Component.For<IWorkOrdersLocalizationService>().Instance(_workOrdersLocalizationService));
            _bus = _container.Resolve<IBus>();
        }

        public IBus GetBus()
        {
            return _bus;
        }

        private WorkOrderPnDbContext GetContext()
        {
            WorkOrderPnContextFactory contextFactory = new WorkOrderPnContextFactory();
            return contextFactory.CreateDbContext(new[] { _connectionString });
        }
    }
}
