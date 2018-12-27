using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Settings.Admin;
using eFormAPI.Web.Infrastructure.Models.Settings.Initial;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions
{
    public interface ISettingsService
    {
        OperationResult ConnectionStringExist();
        OperationDataResult<AdminSettingsModel> GetAdminSettings();
        OperationDataResult<string> GetDefaultLocale();
        OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings();
        OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings();
        OperationDataResult<string> GetAssemblyVersion();
        OperationDataResult<string> GetApplicationHostOs();
        Task<OperationResult> ResetLoginPageSettings();
        Task<OperationResult> ResetPageHeaderSettings();
        Task<OperationResult> UpdateAdminSettings(AdminSettingsModel adminSettingsModel);
        Task<OperationResult> UpdateConnectionString(InitialSettingsModel initialSettingsModel);
    }
}