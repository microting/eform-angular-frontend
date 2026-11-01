namespace eFormAPI.Web.Infrastructure.Models.Auth;

using Microting.eFormApi.BasePn.Infrastructure.Models.API;

/// <summary>The password was right, but the account needs a second factor and the request carried none.
/// Not a failed guess, so the login brake does not count it. Serialises exactly like its base type.</summary>
public sealed class SecondFactorRequiredResult(string message) : OperationDataResult<EformAuthorizeResult>(false, message);
