using Rebus.Bus;

namespace eFormAPI.BasePn.Services
{
    public interface IEFormCoreService
    {
        eFormCore.Core GetCore();
        IBus Bus { get; }
    }
}