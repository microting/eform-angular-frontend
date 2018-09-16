using System.Threading.Tasks;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Settings.Admin;
using eFormAPI.Common.Models.Settings.Initial;

namespace eFormAPI.Core.Abstractions
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