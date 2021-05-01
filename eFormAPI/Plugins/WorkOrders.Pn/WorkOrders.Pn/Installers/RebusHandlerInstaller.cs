using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Rebus.Handlers;
using ServiceWorkOrdersPlugin.Handlers;
using WorkOrders.Pn.Handlers;
using WorkOrders.Pn.Messages;

namespace WorkOrders.Pn.Installers
{
    public class RebusHandlerInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<IHandleMessages<eFormCaseUpdated>>().ImplementedBy<eFormCaseUpdatedHandler>().LifestyleTransient());
            container.Register(Component.For<IHandleMessages<SiteAdded>>().ImplementedBy<SiteAddedHandler>().LifestyleTransient());
        }
    }
}
