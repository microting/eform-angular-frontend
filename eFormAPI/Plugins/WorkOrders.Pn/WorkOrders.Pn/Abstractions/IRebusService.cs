using Rebus.Bus;
using System.Threading.Tasks;

namespace WorkOrders.Pn.Abstractions
{
    public interface IRebusService
    {
        Task Start(string connectionString);
        IBus GetBus();
    }
}
