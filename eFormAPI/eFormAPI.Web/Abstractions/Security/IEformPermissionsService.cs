using System.Threading.Tasks;

namespace eFormAPI.Web.Abstractions.Security
{
    public interface IEformPermissionsService
    {
        Task<bool> CheckEform(int eformId, string claimName);
    }
}