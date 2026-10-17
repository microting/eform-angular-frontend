using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions;

/// <summary>
/// The external-account links this installation holds in its Identity UserLogins table.
///
/// A link records, against a local account's own row, "this account is linked to
/// my.microting.com user &lt;id&gt;". It is purely a consent signal about identity: NOTHING in
/// the login path reads it, and deleting every row changes no login. A local admin may
/// delete any of them unilaterally and must never need my.microting.com's cooperation to
/// do so.
///
/// Every operation filters by LoginProvider. The schema already carries OAuth columns, so
/// a future Google login would write to the same table, and a read that did not filter
/// could mistake its row for ours.
/// </summary>
public interface IExternalUserLinkService
{
    /// <summary>All links for <paramref name="loginProvider"/> on this installation,
    /// ordered by UserId. This is the read the fan-out's confirmation step and the
    /// plugin's reconciliation both use — and the capability probe's target.</summary>
    Task<OperationDataResult<List<ExternalUserLinkRow>>> GetLinks(string loginProvider);

    /// <summary>One link by its primary key. Fails (rather than returning null) when
    /// absent.</summary>
    Task<OperationDataResult<ExternalUserLinkRow>> GetLinkByKey(string loginProvider, string providerKey);

    /// <summary>Creates one link. Refuses a target of user Id 1, a provider key already
    /// held on this installation, and a target that already holds one of our links.</summary>
    Task<OperationResult> CreateLink(CreateExternalUserLinkModel model);

    /// <summary>Removes one link. Idempotent: removing an absent link succeeds.</summary>
    Task<OperationResult> DeleteLink(DeleteExternalUserLinkModel model);
}
