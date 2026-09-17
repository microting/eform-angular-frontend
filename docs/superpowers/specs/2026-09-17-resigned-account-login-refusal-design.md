# Refuse login for resigned accounts

**Date:** 2026-09-17
**Status:** approved design, not yet implemented
**Scope:** web login and the Flutter apps (which use the same endpoints). The legacy
eForm device app is explicitly out of scope — it authenticates against the Microting
cloud with a cloud-minted OTP and has its own working kick-out mechanism.

## Problem

`Resigned` is a **visibility** flag, not an **access** flag. It gates ~15 pickers, lists
and reports, and is read by **zero** authentication or authorisation code: `grep -rni
resigned` over `eFormAPI.Web`, `eFormApi.BasePn` and `eform-angular-frontend-base` returns
nothing. The web host does not know the concept exists.

Consequence, measured on tenant 1012: **all four resigned workers still hold a working
login** — password set, no lockout, "Kun tid" group, and a live device Unit. One of them
resigned seven weeks ago.

| Worker | Resigned | Login | Password | Lockout |
|---|---|---|---|---|
| Erla Zachariasen | 2026-07-30 | Users 9 | set | none |
| Cecilie Krakov Christensen | 2026-01-07 | Users 30 | set | none |
| Camille Myken | 2026-03-12 | Users 42 | set | none |
| Silje Aabenhus Madsen | 2026-09-10 | Users 48 | set | none |

A second problem sits next to it: login failures are fully distinguishable, so the login
box is an account-enumeration oracle. Unknown account returns `User with username
<what you typed> not found`; wrong password returns `Incorrect password.`; lockout returns
`Locked Out. Please, try again after 10 min`. Each is a hard-coded English literal that
the client toasts verbatim (`apiBase.service.ts:253-263`).

## Decision

Give the **login account its own state**, written when someone resigns — rather than
deciding at login time by matching the submitted username to an SDK `Worker` via email.

The email link is the reason. There is no foreign key between `Users` (`*_Angular`) and
the SDK; the join is an email string across two databases, and the codebase says so at
`Startup.cs:484`: *"It is not a perfect solution, but it is the best we can do without
having a direct link between the two."* (`Startup.cs:487`.) It is compared
case-sensitively in some call sites and lowercased in others, and
`FixUserToWorkerLinks()` (`Startup.cs:492-519`)
rewrites `Worker.Email` by **name** match on every host boot. Putting an authentication
decision on that join would mean a resigned person gets in whenever the match drifts, and
an active person is locked out whenever a name collision moves their email.

The email match is still used, but only on the **write** path — once, with an admin
present, at the moment of resigning — where a miss is visible and recoverable.

## Design

### 1. Schema — two repos

The property goes on `EformUser`, which is declared in **`eFormApi.BasePn`**
(`eFormApi.BasePn/Infrastructure/Database/Entities/EformUser.cs:6-40`) — a different repo
and a different NuGet package from the migration:

```csharp
public bool IsActive { get; set; } = true;
```

The migration goes in
`eform-angular-frontend-base/Microting.EformAngularFrontendBase/Migrations`, defaulting
existing rows to `true`. Copy the pattern from the most recent one,
`20260411082732_AddThemeVariantToUser.cs` — note it confirms the table is literally named
`Users`, not `AspNetUsers`.

**Keep the `= true` initializer and the mapping's default in the same change.** For a
non-nullable `bool`, EF Core omits the column from INSERT whenever the value equals the
CLR sentinel (`false`); the initializer is what makes EF Core infer `true` as the sentinel
instead. Getting this half-right fails silently in the insecure direction — an account
created disabled comes back enabled.

A shadow property (the route the codebase took for `ExternalLoginEnabled`,
`BaseDbContext.cs:301-304`) would have confined this to one repo and one release. It was
considered and rejected on 2026-09-17 in favour of a real property that code can read and
query directly; the cost is the release chain and deploy order in **Rollout order** below.

`IsActive` rather than `IsResigned` deliberately: this is an account-state flag, and it
gives support the "disable this account" primitive the platform does not have today —
which is also what lets someone be locked out *without* being resigned.

### 2. Write path — there are two resign paths, not one

**Path A — device users UI.** `BackendConfigurationAssignmentWorkerServiceHelper.UpdateDeviceUser`
writes `Worker.Resigned`/`ResignedAtDate` (`:903-904`) and `AssignedSite.Resigned`/`ResignedAtDate`
(`:1061-1062`) in one call, and already resolves the login account — via
`FindLoginWithoutSideEffectsAsync` (defined `:350-360`), **called at `:758` on `oldEmail`**.

**Path B — time-planning settings UI.** `TimeSettingService.UpdateAssignedSite`
(`eform-angular-timeplanning-plugin/.../TimeSettingService.cs:969`) writes
`AssignedSite.Resigned` at `:985` and `:1080-1081` and **never touches a login**. The BC
plugin then copies `AssignedSite.Resigned → Worker.Resigned` on its next boot
(`EformBackendConfigurationPlugin.cs:722`, inside `SeedEForms`).

So the flag must be written in **both** paths, or a resignation made through time-planning
leaves `IsActive = true` with nothing logged. Path B is in a different plugin, which may
not have `UserManager` to hand — **verify this before implementing PR 4**; if it does not,
the fallback is to write `IsActive` in the boot-time reconciliation at `:701-726`, which
already sees both paths, accepting that it only takes effect at the next restart.

The write is **unconditional** (`IsActive = !resigned`), not `if (resigned)`, so that
un-resigning restores access through the same code.

#### Non-plugin-managed logins are disabled too

`UpdateDeviceUser` sets `skipLoginWork = true` (`:764-765`) when the resolved login is not
plugin-managed — `IsPluginManagedLoginAsync` (`:151-153`) excludes user id 1, admins, and
anyone outside `none`/`eForm users`/`Kun arkiv`/`Kun tid` — and then sets `user = null`
(`:784`), so every downstream `user != null` guard skips.

**Decision (2026-09-17): `IsActive` is written outside that guard.** A resigned admin is
the account you least want left open, and `skipLoginWork` exists to stop the plugin
rewriting *roles and group membership*, which is a different concern from account state.
Every such write logs at warning level naming the account, so the deviation from the
plugin's usual rule is visible.

If no login account matches at all, that is **logged at warning level with the worker id
and email** and the resign still succeeds — a worker without a login is normal (on 1012,
one such worker exists) — but a silent miss here is how a resigned person keeps access.

### 3. Read path — every login surface

Refuse when `IsActive == false`, returning the shared failure result (§4):

| Surface | Location |
|---|---|
| REST `POST /api/auth/token` | `AuthService.AuthenticateUser` (`AuthService.cs:68-171`) |
| core gRPC `AuthenticateUser` | delegates to the above — inherits it for free |
| time-planning gRPC `AuthenticateUser` | `TimePlanningAuthGrpcService.cs:97-179` — a parallel implementation that skips `SignInManager` entirely, so it must be changed separately |
| `POST /api/auth/google-auth-key` | `AuthService.GetGoogleAuthenticator` (`:408-465`) — anonymous, and a second credential-verification oracle |
| `GET /api/auth/token/refresh` | `AuthService.RefreshToken` (`:173-204`) |
| time-planning gRPC `RefreshToken` | `TimePlanningAuthGrpcService.cs:202-253` |

The two refresh paths matter: both currently mint a fresh 24h token on nothing more than
"the row still exists". Refusing there means a disabled account cannot roll its session
forward indefinitely — it caps exposure at the remaining token lifetime rather than
leaving it unbounded. That is a partial mitigation, not the full kill-out (see Follow-up).

### 4. Error contract

All three cases — unknown account, wrong password, refused account — return the identical
response: HTTP 200, `success: false`, message:

> **You have entered an invalid username or password**

The key **already exists**: `UserNameOrPasswordIncorrect`, in all 25 `SharedResource*.resx`
files, EN *"Username or password is incorrect"* (`SharedResource.resx:384-386`), DA
*"Brugernavn eller adgangskode er forkert"* (`SharedResource.da.resx:326-328`), already
used by `GetGoogleAuthenticator` (`AuthService.cs:415, :431`). Update that key's text to
the wording above rather than adding a near-duplicate — which also changes the
`google-auth-key` response, consistently and for the better.

**The time-planning gRPC path cannot reach it.** It lives in a plugin and has no access to
the host's `ILocalizationService`/`SharedResource`, so §3's "identical on every surface"
needs a mechanism: either the plugin carries its own copy of the same strings, or the
plugin's login delegates to the host's `IAuthService` the way the core gRPC service
already does. **Decide this when implementing PR 3** — the second option removes the
duplicate login implementation entirely and is the better outcome if it is reachable.

Lockout keeps its own distinct message: it is a temporary, self-resolving state that users
need to understand, and it already reveals nothing that the generic message hides.

**This changes behaviour users see today** — a plain typo now says "invalid username or
password" instead of "Incorrect password." Both Flutter apps and the Angular client
display `body.message` verbatim, so none of them needs a change; any client that branches
on the old strings would.

### 5. Backfill

Existing resigned workers already have usable logins, so the migration is not enough on
its own. A one-off, idempotent backfill sets `IsActive = false` for every login whose
matching worker has `Resigned = 1`.

It runs in the **BackendConfiguration plugin's startup**. Two existing sites are nearby but
they are in *different methods*: the `SecurityGroupBackfillService` invocation
(`EformBackendConfigurationPlugin.cs:903`, inside the try at `:899-908`) and the
resigned-flag reconciliation (`:701-726`, inside `SeedEForms` at `:252`). Put the backfill
next to the reconciliation — that is where worker state is already reconciled across the
two databases and where the SDK context is to hand. (`eFormAPI.Web` can also see
`Worker.Resigned`: it already builds an SDK context at `Startup.cs:498-500`.)

It logs every account it disables plus a total, and is a no-op on every subsequent boot.

### 6. Close the hole that re-creates the logins

`SecurityGroupBackfillService.CreateMissingUsersForWorkersWithEmailAsync` (`:173-284`,
invoked from `EformBackendConfigurationPlugin.cs:903`) mints a login for every non-removed
worker with an email, filtering on `WorkflowState` only (`:187-189`) — `Resigned` is never
consulted. Its filter gains `&& !worker.Resigned`.

**This is hardening, not a live hole.** `RunIfNeededAsync` (`:86-94`) returns early once
the `SecurityGroupFallbackBackfilled` marker is set (`:83-84`, written unconditionally at
`:108-118`), so on any tenant that has booted this code it can never run again. Even if it
did, `takenEmails` (`:222-236`) skips any email already present in `Users` — a disabled row
still holds its email — and the accounts it creates are **passwordless** (`:257`,
single-argument `CreateAsync`), so they cannot be signed into until an admin sets a
password. Fix it so a tenant whose marker is unwritten cannot mint a login for someone
already resigned; do not expect it to explain a disabled account coming back.

## Out of scope

- **Ending live sessions** — see Follow-up. A resigned worker's existing token keeps
  working until it expires.
- **The four `[AllowAnonymous]` kiosk endpoints**, which authenticate with a
  `RegistrationDevices.Token` (plaintext, no expiry, no revocation field) and never
  identify a person at all. A different problem with a different fix.
- **The legacy device app** — cloud-authenticated, already handled there.
- **Repairing the email↔worker link generally**, including `FixUserToWorkerLinks()`
  overwriting `Worker.Email` by name match. This design routes around it rather than
  fixing it.
- **The `ForgotPassword` enumeration leak** (`AccountService.cs:284-291`), which returns
  `User with <email> not found`. Same family as §4; worth its own issue.

## Testing

C# integration tests, each in the project that owns the code under test:

**`eFormAPI.Web.Integration.Tests`** (host):
- a login whose account has `IsActive = false` is refused, and the response is
  **byte-identical** to the unknown-account response — this is the requirement, so it is
  asserted directly rather than by checking the message alone
- `RefreshToken` refuses for an inactive account
- the backfill disables a pre-existing resigned worker's login and is idempotent on a
  second run

**`BackendConfiguration.Pn.Integration.Test`** (plugin — where
`BackendConfigurationAssignmentWorkerServiceHelperTest.cs` and
`SecurityGroupBackfillServiceTest.cs` already live):
- resigning a worker sets `IsActive = false`; undoing it restores `true`
- resigning a worker whose login is *not* plugin-managed still disables it, and logs
- resigning a worker with no matching login succeeds and logs a warning
- `SecurityGroupBackfillService` does not mint a login for a resigned worker

**The time-planning plugin's test project:**
- the gRPC login refuses an inactive account with the same message as the REST path
- resigning through `TimeSettingService.UpdateAssignedSite` also disables the login

Playwright: logging in as a resigned user shows the generic message and stays on the login
page.

Tests run in CI only (MariaDB testcontainers); local verification is `dotnet build`.

## Rollout order

Four PRs, each gated on the **previous one's package being released and restorable**. Do
not start a step against an unreleased package — the code cannot be tested, and that is
the whole point of the gate (decided 2026-09-17).

| # | Repo | Contains | Waits for |
|---|---|---|---|
| 1 | `eFormApi.BasePn` | `EformUser.IsActive` | — |
| 2 | `eform-angular-frontend-base` | the migration | `Microting.eFormApi.BasePn` released |
| 3 | `eform-angular-frontend` | auth refusals, shared message | `Microting.EformAngularFrontendBase` released |
| 4 | `eform-backendconfiguration-plugin` (+ the time-planning plugin, §2 path B) | resign write, backfill, backfill-service filter | 1 and 2 released, 3 merged |

**Deploy order is host before plugins, and it is not optional.** `PluginHelper.cs:296-348`
shares `IEformPlugin`, `IPluginDbContext`, `BaseEntity`, `PluginDbOptions<>` and
`BaseDbContext` — and therefore their whole containing assemblies — across the plugin load
contexts. A plugin compiled against a BasePn that has `IsActive`, running on a host still
shipping the old BasePn, throws `MissingMethodException` at first touch rather than failing
at build time. Current pins to bump together: `BackendConfiguration.Pn.csproj:287-288`
(BasePn 10.0.34, EformAngularFrontendBase 10.0.38) and the equivalent in `TimePlanning.Pn`.

## Risks

- **Two flags must agree.** `Worker.Resigned`/`AssignedSite.Resigned` and `User.IsActive`
  are written in one call but live in two databases with no transaction spanning them. If
  the second write fails, a resigned worker keeps their login. The warning log in §2 is
  what makes that visible; the backfill in §5 is what heals it.
- **The backfill is a bulk lockout.** It disables every matching account on first boot
  after deploy. If the email match is wrong for someone, an active employee loses access.
  It must log every account it touches, and the count should be sanity-checked per tenant
  before rollout.
- **Un-resign must work**, or reinstating an employee leaves them locked out with no
  obvious cause.

## Follow-up: ending live sessions

Blocking login does not end a session. Tokens last 24h (`AuthService.cs:256`), nothing
re-reads the user row after issue, and `LogOut` only clears a cache — the JWT stays valid.

`ClaimsTransformer.TransformAsync` (`ClaimsTransformer.cs:49-100`) is the natural place to
reject: it already runs on every authenticated request and already has the user id and an
`updated_at` claim. Today it never rejects — on a stale token it sets an advisory response
header whose client-side handler is **commented out** (`user-claims.interceptor.ts:22-28`).

Needs its own design, because it touches every authenticated request and therefore both
performance (a per-request user lookup, or a revocation cache) and the multi-replica
behaviour of the existing per-process `IMemoryCache`.
