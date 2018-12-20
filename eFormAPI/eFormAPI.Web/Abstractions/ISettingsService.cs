using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Admin;
using Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Initial;

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
        OperationResult ResetLoginPageSettings();
        OperationResult ResetPageHeaderSettings();
        OperationResult UpdateAdminSettings(AdminSettingsModel adminSettingsModel);
        Task<OperationResult> UpdateConnectionString(InitialSettingsModel initialSettingsModel);
    }
}