using System.Threading.Tasks;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Settings.Admin;
using eFormAPI.BasePn.Models.Settings.Initial;

namespace eFormAPI.BasePn.Abstractions
{
    public interface ISettingsService
    {
        OperationResult ConnectionStringExist();
        OperationDataResult<AdminSettingsModel> GetAdminSettings();
        OperationDataResult<string> GetDefaultLocale();
        OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings();
        OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings();
        OperationResult ResetLoginPageSettings();
        OperationResult ResetPageHeaderSettings();
        OperationResult UpdateAdminSettings(AdminSettingsModel adminSettingsModel);
        Task<OperationResult> UpdateConnectionString(InitialSettingsModel initialSettingsModel);
    }
}