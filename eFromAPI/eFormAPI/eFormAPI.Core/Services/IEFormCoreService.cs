using eFormCore;
using Rebus.Bus;

namespace eFormAPI.Core.Services
{
    public interface IEFormCoreService
    {
        eFormCore.Core GetCore();
        IBus Bus { get; }
    }
}