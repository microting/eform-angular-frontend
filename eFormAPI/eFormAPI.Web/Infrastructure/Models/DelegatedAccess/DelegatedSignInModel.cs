namespace eFormAPI.Web.Infrastructure.Models.DelegatedAccess;

/// <summary>
/// Request body of <c>POST api/auth/delegated</c>. The assertion is credential-equivalent,
/// so it is only ever bound from the request body, never from the query string or route.
/// </summary>
public sealed class DelegatedSignInModel
{
    public string Assertion { get; set; } = "";
}
