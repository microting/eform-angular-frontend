using System.Threading.Tasks;

namespace eFormAPI.Web.Abstractions;

/// <summary>
/// Whether an account belongs to a live property worker. Behind an interface so the
/// password-reset rules that depend on it can be tested without an SDK database.
/// </summary>
public interface IWorkerAccountLookup
{
    Task<bool> IsLiveWorkerAsync(string email);
}
