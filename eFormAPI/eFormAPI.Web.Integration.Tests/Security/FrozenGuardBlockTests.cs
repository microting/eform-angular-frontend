using System;
using System.IO;
using System.Linq;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Security;

/// <summary>
/// AccountService's target-guard block is BYTE-FROZEN.
///
/// Not refactored, not extracted, not re-indented, not reworded. The block has survived
/// several security reviews in exactly this form, and the decision — recorded as D-D in
/// the implementation plan — is that no refactor, however safe-looking, is worth
/// reopening it. The link-targeted path therefore carries its own SECOND COPY of the same
/// rules (AccountService.EvaluateLinkedTargetGuards), and
/// PasswordTargetGuardAgreementTests is what keeps the two copies in agreement.
///
/// The block is located by its CONTENT, never by line number. Hashing a stale line range
/// is how a byte-identical block gets reported as changed: the range 221-257 was correct
/// until upstream inserted a comment above the block, after which the same 37 bytes-for-
/// bytes lines sat at 224-260 and the stale range hashed to something else entirely.
///
/// If this test fails, the fix is to revert whatever changed inside the block — NOT to
/// update the expected text below. Updating it is the one edit this test exists to stop.
/// The same block is pinned independently by SHA-256 in
/// .github/scripts/check-login-path-fence.sh, so the gate still bites when this test
/// project does not build.
/// </summary>
[TestFixture]
public class FrozenGuardBlockTests
{
    /// <summary>
    /// AccountService.cs's target-guard block as of the branch base, verbatim: 37 lines,
    /// 1921 bytes, LF endings, no trailing whitespace,
    /// SHA-256 02143d23591238ae29b792afbd0cf96f293aebc6c1417f6db4ed3225dd1d39db.
    /// </summary>
    internal const string ExpectedGuardBlock =
        """
                if (user.Id == 1 && userService.UserId != 1)
                {
                    return new OperationResult(false, localizationService.GetString("CantEditPrimaryAdminUser"));
                }

                var callerIsAdmin = caller.IsInRole(EformRole.Admin);
                if (!callerIsAdmin && await userManager.IsInRoleAsync(user, EformRole.Admin))
                {
                    return new OperationResult(false, localizationService.GetString("YouCantViewChangeOrDeleteAdmin"));
                }

                // A non-admin changes their own password through change-password, which requires
                // the current one; this route would skip that check.
                if (!callerIsAdmin && user.Id == userService.UserId)
                {
                    return new OperationResult(false, localizationService.GetString("UseChangePasswordForYourOwnAccount"));
                }

                // A caller who reached this route on device_users_update alone manages property
                // workers, so they may reset only a live worker's account. Being a worker is not
                // the same as holding only a worker's rights — a user manager who also logs time
                // is a live worker — so the target must also hold no permission the caller itself
                // lacks, or resetting their password would hand the caller rights it does not have.
                if (!AccountPolicies.MayResetAnyNonAdmin(caller))
                {
                    if (!await workerAccountLookup.IsLiveWorkerAsync(user.Email))
                    {
                        return new OperationResult(false, localizationService.GetString("YouMayOnlySetPasswordsForWorkers"));
                    }

                    var targetClaims = await claimsService.GetUserClaims(user.Id);
                    if (targetClaims.Any(claim => !caller.HasClaim(claim.Type, AuthConsts.ClaimDefaultValue)))
                    {
                        return new OperationResult(false,
                            localizationService.GetString("YouCantSetPasswordForMorePrivilegedAccount"));
                    }
                }
        """;

    private static string AccountServiceSource()
        => File.ReadAllText(Path.Combine(
            RepoRoot(), "eFormAPI", "eFormAPI.Web", "Services", "AccountService.cs"));

    [Test]
    public void TheTargetGuardBlockIsByteIdenticalToItsFrozenForm()
    {
        // Normalise only line endings, so a checkout with autocrlf does not false-alarm.
        // Nothing else is normalised: indentation, spacing and wording are all frozen.
        var source = AccountServiceSource().Replace("\r\n", "\n");
        var expected = ExpectedGuardBlock.Replace("\r\n", "\n");

        Assert.That(source, Does.Contain(expected),
            "AccountService's target-guard block has changed. Revert it — do NOT update "
            + "ExpectedGuardBlock. The block is byte-frozen by decision; the link-targeted "
            + "path has its own copy, and PasswordTargetGuardAgreementTests keeps them in step.");
    }

    [Test]
    public void TheFrozenBlockAppearsExactlyOnce()
    {
        var source = AccountServiceSource().Replace("\r\n", "\n");
        var expected = ExpectedGuardBlock.Replace("\r\n", "\n");

        var occurrences = 0;
        var index = source.IndexOf(expected, StringComparison.Ordinal);
        while (index >= 0)
        {
            occurrences++;
            index = source.IndexOf(expected, index + 1, StringComparison.Ordinal);
        }

        // Two copies of this exact text would mean someone pasted the frozen block into
        // the link-targeted path. The second copy must be written for ITS OWN control
        // flow — it returns a PasswordTargetDecision, not an OperationResult — so an
        // identical paste is a sign the new path is returning the wrong shape.
        Assert.That(occurrences, Is.EqualTo(1),
            "the frozen block must appear exactly once in AccountService.cs");
    }

    // The same invariant the CI fence asserts, stated on this leg too.
    //
    // The block's FIRST line is duplicated by design: once in the frozen copy, once in
    // EvaluateLinkedTargetGuards, whose own rules start with the identical condition. The
    // fence locates the frozen block by that line, so the count is load-bearing — a third
    // paste, or a deleted copy, would change which block the fence hashes. The fence also
    // gates its anchor on the AdminChangePassword signature, so it lands on the frozen
    // copy whatever the member order; this test pins the count the fence relies on.
    [Test]
    public void TheGuardAnchorLineAppearsExactlyTwice()
    {
        var lines = AccountServiceSource().Replace("\r\n", "\n").Split('\n');

        var anchors = lines.Count(line =>
            line == "        if (user.Id == 1 && userService.UserId != 1)");

        Assert.That(anchors, Is.EqualTo(2),
            "exactly two copies of the target rules may exist: the byte-frozen one in "
            + "AdminChangePassword and the link-targeted path's own in "
            + "EvaluateLinkedTargetGuards. A third copy, or a removed copy, changes which "
            + "block .github/scripts/check-login-path-fence.sh hashes.");
    }

    // The frozen block is reached only after the caller-principal check immediately above
    // it, which is equally not edited by any task. Pins that too, so a refactor cannot
    // move the fail-closed check out from in front of the guards.
    [Test]
    public void TheCallerPrincipalCheckStillGuardsTheBlock()
    {
        var source = AccountServiceSource().Replace("\r\n", "\n");

        const string callerRead =
            """
                    var caller = httpContextAccessor.HttpContext?.User;
                    if (caller == null)
                    {
                        return new OperationResult(false, localizationService.GetString("YouMayOnlySetPasswordsForWorkers"));
                    }
            """;

        var expectedCallerRead = callerRead.Replace("\r\n", "\n");
        var expectedBlock = ExpectedGuardBlock.Replace("\r\n", "\n");

        Assert.That(source, Does.Contain(expectedCallerRead));
        Assert.That(source.IndexOf(expectedCallerRead, StringComparison.Ordinal),
            Is.LessThan(source.IndexOf(expectedBlock, StringComparison.Ordinal)),
            "the fail-closed caller-principal check must stay in front of the guards");
    }

    internal static string RepoRoot()
    {
        var dir = new DirectoryInfo(TestContext.CurrentContext.TestDirectory);
        while (dir != null && !Directory.Exists(Path.Combine(dir.FullName, "eFormAPI", "eFormAPI.Web")))
        {
            dir = dir.Parent;
        }

        Assert.That(dir, Is.Not.Null, "could not locate the repository root from the test directory");
        return dir!.FullName;
    }
}
