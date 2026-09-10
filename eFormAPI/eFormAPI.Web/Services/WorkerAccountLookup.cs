using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;

namespace eFormAPI.Web.Services;

/// <summary>
/// "Live property worker" means an SDK Worker with this email that is not removed —
/// the same test AdminService.Read uses for IsDeviceUser, so the two agree on who is a
/// worker.
/// </summary>
public class WorkerAccountLookup(IEFormCoreService coreHelper) : IWorkerAccountLookup
{
    public async Task<bool> IsLiveWorkerAsync(string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return false;
        }

        var core = await coreHelper.GetCore();
        await using var sdkDbContext = core.DbContextHelper.GetDbContext();
        return await sdkDbContext.Workers.AnyAsync(x => x.Email == email
            && x.WorkflowState != Constants.WorkflowStates.Removed);
    }
}
