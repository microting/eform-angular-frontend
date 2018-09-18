using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace eFormAPI.BasePn
{
    public interface IPlugin
    {
        string GetName();
    }
}