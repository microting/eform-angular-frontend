using System.Threading.Tasks;

namespace eFormAPI.Web.Services.Security
{
    public interface IEformPermissionsService
    {
        Task<bool> CheckEform(int eformId, string claimName);
    }
}