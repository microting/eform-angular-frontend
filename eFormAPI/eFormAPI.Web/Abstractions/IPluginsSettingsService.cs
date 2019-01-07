using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Plugins;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public interface IPluginsSettingsService
    {
        Task<OperationDataResult<PluginsSettingsModel>> GetPlugins(PluginsSettingsRequestModel requestModel);
        Task<OperationResult> UpdatePluginSettings(PluginsSettingsUpdateModel updateModel);
    }
}