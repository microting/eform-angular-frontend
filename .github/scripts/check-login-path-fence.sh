#!/usr/bin/env bash
#
# Two gates for the cross-tenant password-sync work.
#
# GATE 1 — NO RUNTIME BINDING (requirement 1 of the design).
# Tenant login stays email-or-username plus password, verified locally by that tenant's
# own Identity stack. If my.microting.com disappeared permanently, every tenant login
# must keep working, with the same passwords, forever. The login path may therefore never
# mention the external-login API or the link table, so a later change to "look up the
# link during login" is a violation by construction rather than by judgement.
#
# Implemented as a GREP fence rather than the design's diff allowlist because Startup.cs
# legitimately needs one DI registration line for the link service, and
# AuthServiceCollectionExtensions.cs may legitimately gain a policy. Mentioning the link
# API is the thing that matters, and this catches it in both files regardless of diff.
#
# GATE 2 — THE FROZEN GUARD BLOCK.
# AccountService's target-guard block is byte-frozen by decision: it is never refactored,
# extracted, re-indented or reworded. The link-targeted path has its own second copy of
# the same rules, and PasswordTargetGuardAgreementTests keeps the two in agreement. If
# this gate fails, revert the block — do NOT update the hash below.
set -euo pipefail

BASE="${1:-origin/master}"
WEB="eFormAPI/eFormAPI.Web"
ACCOUNT_SERVICE="$WEB/Services/AccountService.cs"

# SHA-256 of AccountService.cs's target-guard block: 37 lines, 1921 bytes, LF endings.
FROZEN_GUARD_SHA256='02143d23591238ae29b792afbd0cf96f293aebc6c1417f6db4ed3225dd1d39db'

# Files that must never MENTION the link API.
FENCED=(
  "$WEB/Services/AuthService.cs"
  "$WEB/Services/UserService.cs"
  "$WEB/Hosting/Security/ClaimsTransformer.cs"
  "$WEB/Hosting/Security/AuthServiceCollectionExtensions.cs"
  "$WEB/Startup.cs"
)

# Files that must additionally be byte-unchanged: the pure login path needs no edit at
# all for this feature. Startup.cs and AuthServiceCollectionExtensions.cs are absent
# here on purpose; they are still grep-fenced above.
FROZEN=(
  "$WEB/Services/AuthService.cs"
  "$WEB/Services/UserService.cs"
  "$WEB/Hosting/Security/ClaimsTransformer.cs"
)

FORBIDDEN='FindByLoginAsync|GetLoginsAsync|AddLoginAsync|RemoveLoginAsync|UserLoginInfo|IdentityUserLogin|UserLogins|ExternalLoginProviders|ExternalUserLink|SetLinkedAccountPassword'

# The ONE permitted mention in the whole fenced set: Startup.cs's DI registration for the
# link service. Scoped two ways so the allowance cannot widen into a general excuse:
#   1. it is only consulted for ONE file, $ALLOWED_FILE — a mention in AuthService.cs,
#      UserService.cs, ClaimsTransformer.cs or AuthServiceCollectionExtensions.cs is a
#      violation whatever it says;
#   2. it is anchored to the WHOLE line (grep -n prefix, then end-of-line), so nothing
#      can ride along on the excused line. `AddScoped<...>(); FindByLoginAsync(...)` on
#      one line still fails.
ALLOWED_FILE="$WEB/Startup.cs"
ALLOWED_LINE='^[0-9]+:[[:space:]]*services\.AddScoped<IExternalUserLinkService, ExternalUserLinkService>\(\);$'

# shasum on macOS, sha256sum on the CI runners.
sha256_of_stdin() {
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256
  else
    sha256sum
  fi | cut -d" " -f1
}

status=0

# ---------------- GATE 1 ----------------
for file in "${FENCED[@]}"; do
  if [ ! -f "$file" ]; then
    echo "FENCE ERROR: fenced file is missing from the tree: $file" >&2
    status=1
    continue
  fi

  hits="$(grep -nE "$FORBIDDEN" "$file" || true)"
  if [ "$file" = "$ALLOWED_FILE" ] && [ -n "$hits" ]; then
    hits="$(printf '%s\n' "$hits" | grep -vE "$ALLOWED_LINE" || true)"
  fi

  if [ -n "$hits" ]; then
    printf '%s\n' "$hits" >&2
    echo "FENCE VIOLATION: $file mentions the external-login link API." >&2
    echo "  The login path must never consult a link. See the design's requirement 1." >&2
    status=1
  fi
done

if git rev-parse --verify --quiet "$BASE" >/dev/null; then
  for file in "${FROZEN[@]}"; do
    if ! git diff --quiet "$BASE" -- "$file"; then
      echo "FENCE VIOLATION: $file changed against $BASE." >&2
      echo "  The login path needs no change for this feature. See the design's requirement 1." >&2
      status=1
    fi
  done
elif [ -n "${CI:-}" ]; then
  # In CI an unresolvable base ref is a DROPPED GATE, not a degraded convenience: a
  # checkout without fetch-depth: 0, or a renamed base branch, would otherwise let a
  # change to the pure login-path files ride through on a green tick, because the only
  # sub-gate that reads the base would simply not run. Fail loudly instead.
  echo "FENCE VIOLATION: $BASE could not be resolved, so the byte-unchanged gate on the" >&2
  echo "  pure login-path files did not run." >&2
  echo "  Fetch the base ref (actions/checkout with fetch-depth: 0) or pass a resolvable" >&2
  echo "  base as \$1. A skipped gate is not a passed gate." >&2
  status=1
else
  # Local runs only. The grep gate and the frozen-hash gate are base-independent, so a
  # developer with no origin/master still gets both of them; CI gets all three.
  echo "FENCE NOTE: $BASE is not available; ran the grep fence only." >&2
fi

# ---------------- GATE 2 ----------------
# Extract the block by content, not by line number: unrelated edits above it shift the
# lines, so a line-range check would false-alarm — hashing the stale range 221-257 after
# an upstream comment moved the block three lines down produced a different hash for a
# byte-identical block. Start at the primary-admin guard; stop at the first closing brace
# at method-body indentation AFTER the more-privileged-account refusal, which is the end
# of the MayResetAnyNonAdmin block.
if [ ! -f "$ACCOUNT_SERVICE" ]; then
  echo "FENCE ERROR: $ACCOUNT_SERVICE is missing from the tree" >&2
  status=1
else
  # The anchor line is deliberately DUPLICATED in this file: the byte-frozen copy in
  # AdminChangePassword, and the link path's own copy of the same rules in
  # EvaluateLinkedTargetGuards. Assert the count, so a third paste or a deleted copy
  # fails on its own terms instead of silently changing which block gets hashed.
  anchors="$(grep -cE '^        if \(user\.Id == 1 && userService\.UserId != 1\)$' "$ACCOUNT_SERVICE" || true)"
  if [ "$anchors" -ne 2 ]; then
    echo "FENCE VIOLATION: expected exactly 2 target-guard anchor lines in" >&2
    echo "  $ACCOUNT_SERVICE, found $anchors." >&2
    echo "  One is the byte-frozen copy in AdminChangePassword, the other is the" >&2
    echo "  link-targeted path's own copy in EvaluateLinkedTargetGuards. Neither may be" >&2
    echo "  removed, and a third copy of these rules must not exist." >&2
    status=1
  fi

  block="$(
    awk '
      # Gate the anchor on the signature of AdminChangePassword, which occurs exactly
      # once, so the extraction can only ever start at the FROZEN copy no matter how the
      # members are ordered. Without this, moving EvaluateLinkedTargetGuards above
      # AdminChangePassword would start the extraction at the wrong anchor.
      /public async Task<OperationResult> AdminChangePassword/ { inmethod = 1 }
      inmethod && /^        if \(user\.Id == 1 && userService\.UserId != 1\)$/ { inblock = 1 }
      inblock { print }
      # Scoped to the block. Unscoped, ANY line of the file naming this key - a comment
      # above the block included - set the tail flag early and collapsed the extraction
      # to a few lines, reporting a byte-identical block as changed and telling the
      # maintainer to revert something that never moved.
      inblock && /YouCantSetPasswordForMorePrivilegedAccount/ { tail = 1 }
      inblock && tail && /^        \}$/ { exit }
    ' "$ACCOUNT_SERVICE"
  )"

  # An empty extraction is itself a violation, and a loud one: editing the anchor line
  # would stop the block matching at all, and hashing nothing would otherwise produce a
  # stable wrong answer rather than a complaint.
  # wc -l, not grep -c . : the block contains four intentional blank lines.
  block_lines="$(printf '%s\n' "$block" | wc -l | tr -d ' ')"
  if [ "$block_lines" -ne 37 ]; then
    echo "FENCE VIOLATION: could not extract the 37-line target-guard block from" >&2
    echo "  $ACCOUNT_SERVICE (got $block_lines lines)." >&2
    echo "  Its first line must be exactly:" >&2
    echo "      if (user.Id == 1 && userService.UserId != 1)" >&2
    echo "  at 8 spaces of indentation. Revert whatever changed." >&2
    status=1
  fi

  actual_sha="$(printf '%s\n' "$block" | sha256_of_stdin)"

  if [ "$actual_sha" != "$FROZEN_GUARD_SHA256" ]; then
    echo "FENCE VIOLATION: AccountService's target-guard block is not byte-frozen." >&2
    echo "  expected sha256: $FROZEN_GUARD_SHA256" >&2
    echo "  actual   sha256: $actual_sha" >&2
    echo "  Revert the block. Do NOT update the expected hash — that is the one edit" >&2
    echo "  this gate exists to stop. The link-targeted path has its own copy of these" >&2
    echo "  rules, and PasswordTargetGuardAgreementTests keeps the two in agreement." >&2
    status=1
  fi
fi

if [ "$status" -eq 0 ]; then
  echo "Login-path fence: clean."
  echo "Frozen guard block: byte-identical ($FROZEN_GUARD_SHA256)."
fi

exit "$status"
