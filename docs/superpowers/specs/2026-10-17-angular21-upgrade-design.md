# Angular 21 Upgrade — Frontend + 14 Plugins

**Date:** 2026-10-17
**Status:** Draft — awaiting review
**Branch convention:** `angular19` (reused upgrade branch; CI already wired for it)

## 1. Goal

Bring `eform-angular-frontend` and 14 Angular plugins from Angular 20 (`master`/`stable`) to Angular 21, verified on the `angular19` branches, then cut over to mainline in one coordinated release.

### Success criteria

- Frontend `angular19` contains everything on `master` plus the Angular 21 upgrade; `ng build`, Vitest, lint and CI (Cypress + Playwright) green.
- All 14 in-scope plugins are standalone (no `standalone: false`, no `declarations:`, no wrapper-module imports), Vitest green, CI green on `angular19`.
- All 15 repos cut over to `master`/`stable` with green CI and a buildable Docker image; `pre-ng21` tags allow a full revert.

### Decisions already made

| Decision | Choice |
|---|---|
| Frontend strategy | Merge `master` into existing `origin/angular19` (keeps the Jan–Apr 2026 Angular 21 work: PR #7457, #7744 et al.) |
| Plugin scope | 14 plugins (list in §4.1) |
| End state | Coordinated cutover of `angular19` → mainline across all 15 repos |
| Target version | Angular 21.x (Angular 22 is available but out of scope) |
| Dev mode | None — all work in dedicated git worktrees |

## 2. Starting state (measured 2026-10-17)

**Frontend**
- `origin/angular19`: Angular 21.1.0, TypeScript 5.9.3, `@ngrx/*` 21.1.0, Vitest 4, standalone bootstrap, Material 21 overlay/dialog fixes. 69 commits ahead of `origin/master`, 485 behind.
- Dry-run `git merge-tree origin/angular19 origin/master`: **49 conflicted files**; after merge, **25 files** still contain `standalone: false` and **10 modules** contain `declarations:`.
- `origin/master`: Angular 20.3.27, `@ngrx` 20.1.0, Jest; 176 files with `standalone: false`.

**Plugins**
- Existing `angular19` branches (backendconfiguration, greate-belt, insight-dashboard, items-planning, outer-inner-resource, timeplanning, trashinspection, workflow) are strict ancestors of `stable` (0 unique commits, last touched 2025-05-19).
- Plugin `dotnet-core-master.yml` (push) checks out the frontend at the **same branch name**. Plugin `dotnet-core-pr.yml` (PR) hard-codes frontend `ref: stable` — a PR into `angular19` would test against the Angular 20 frontend.
- Plugins have no `package.json`; their Angular code compiles only inside the frontend host.

**Known stale reference:** `~/.claude/skills/angular21-migration/references/migration-guide.md` says pin `@ngrx/*` to 19.2.1; `angular19` has since moved to 21.1.0 (#7744). The skill must be corrected before use.

## 3. Workspace and isolation

### 3.1 Worktrees

```
~/Documents/workspace/microting/worktrees/ng21/
  eform-angular-frontend/                ← branch ng21/merge-master (from origin/angular19)
  <plugin-repo>/  × 14                   ← branch ng21/migrate (from origin/angular19)
```

Existing checkouts (frontend on its feature branch with uncommitted work; plugin repos on `stable`) are never modified.

### 3.2 Plugin → host sync

- **Never run `devinstall.sh` / `devgetchanges.sh`** from this effort — they hard-code `~/Documents/workspace/microting/eform-angular-frontend` and would overwrite the main checkout.
- Plugin worktrees are the source of truth; edits happen there only.
- A scratchpad script `sync-plugins-to-ng21.sh <plugin>...` one-way `rsync --delete`s each plugin's `eform-client/src/app/plugins/modules/<name>-pn` and `eFormAPI/Plugins/<Name>.Pn` into the frontend worktree and registers the plugin route in the worktree's `plugins.routing.ts`.
- Plugin directories inside the frontend worktree are build scratch and are never committed.

### 3.3 Dev servers

The worktree runs its own `yarn install` and `.angular/cache`. Servers use non-default ports so they never collide with the normal setup: `ng serve --port 4300` (log `/tmp/ngserve-ng21.log`), backend on `:5100`/`:5101`.

### 3.4 Branches and PRs

- Frontend: `ng21/merge-master` → PR into `angular19`. (The local branch tracks `origin/angular19`; always push with an explicit `origin ng21/merge-master`.)
- Plugins: `ng21/migrate` → PR into `angular19`.
- Plugins without an `angular19` branch on origin (basecustomer, rentableitem, chemical, inventory, monitoring, kanban) get one created from `stable`. Existing stale `angular19` branches are fast-forwarded to `stable`. **Every push to origin requires user approval.**

## 4. Phase A — Frontend merge (`master` → `angular19`)

### 4.1 Conflict resolution groups

| Group | Files | Owner | Rule |
|---|---|---|---|
| G1 config/build | `package.json`, `yarn.lock`, `test/tsconfig.json`, `.github/workflows/dotnet-core-{master,pr}.yml` | main agent | Keep Angular 21 / ngrx 21 / Vitest from `angular19`; take master's non-Angular dependency bumps. Regenerate `yarn.lock` via `yarn install`, never hand-merge. |
| G2 shared components | `common/modules/eform-cases/**` (5), `eform-shared-tags/**` (2), `eform-shared.module.ts`, `plugins/modules/shared/**` (2) | subagent | Keep `angular19`'s standalone `imports` shape; apply master's logic/template changes; add imports required by new template code. |
| G3 feature modules | `modules/{auth,account-management,advanced,eforms,device-users}/**` (~15) | subagent | Same as G2; in `.html` keep `angular19`'s indexed IDs plus master's new markup. |
| G4 app shell | `app.module.ts`, `app.component.ts`, `scss/styles.scss` | main agent | Keep standalone bootstrap, `provideZoneChangeDetection`, overlay/popover SCSS fixes; add master's additions. |
| G5 tests | `e2e/**` (12), `playwright/**` (5) | subagent | Take master's new tests; keep `angular19`'s selector/wait fixes. |

Full conflict list: regenerate with `git merge-tree --write-tree --name-only origin/angular19 origin/master`.

### 4.2 Post-merge work

1. **Standalone sweep** — convert all remaining `standalone: false` components (25 files) and empty all `declarations:` arrays (10 modules), split across subagents by module.
2. **Export inventory** — produce a list of every standalone component/directive/pipe exported by the merged frontend with its import path; this is input for Phase B prompts.
3. **Fix the skill** — update `migration-guide.md` ngrx version to 21.1.0.

### 4.3 Gates (all must pass before push)

1. `yarn install` then `ng build` — zero errors.
2. `yarn test` (Vitest) — compared against a pre-merge `angular19` baseline run so pre-existing failures are identified, not attributed to the merge.
3. `ng lint`.
4. Code review via `superpowers:requesting-code-review` on the merge diff, **plus** a dropped-change audit: for each master commit touching a conflicted file, confirm its change survived.
5. User smoke test on :4300 — login, eForms, cases, sites, device users, navigation menu.
6. Push `ng21/merge-master`, open PR into `angular19`; Cypress + Playwright CI must be green before merge.

### 4.4 Keeping current

Re-merge `master` into `angular19` before each plugin wave and immediately before cutover.

## 5. Phase B — Plugin migration

### 5.1 In-scope plugins

| Plugin | Components | Spec files | Wrapper-module refs | `angular19` on origin | CI lists `angular19` |
|---|---|---|---|---|---|
| eform-backendconfiguration-plugin | 157 | 106 | 20 | yes (stale) | yes |
| eform-angular-timeplanning-plugin | 54 | 31 | 8 | yes (stale) | yes |
| eform-kanban-plugin | 34 | 25 | 1 | no | no (`main`) |
| eform-angular-inventory-plugin | 29 | 8 | 1 | no | no (`angular15`) |
| eform-angular-insight-dashboard-plugin | 26 | 22 | 1 | yes (stale) | yes |
| eform-angular-trashinspection-plugin | 22 | 0 | 7 | yes (stale) | yes |
| eform-angular-rentableitem-plugin | 18 | 0 | 2 | no | yes |
| eform-angular-items-planning-plugin | 15 | 6 | 3 | yes (stale) | yes |
| eform-angular-outer-inner-resource-plugin | 13 | 0 | 4 | yes (stale) | yes |
| eform-angular-chemical-plugin | 9 | 1 | 1 | no | no |
| eform-angular-workflow-plugin | 8 | 2 | 1 | yes (stale) | yes |
| eform-angular-basecustomer-plugin | 8 | 0 | 1 | no | yes |
| eform-angular-monitoring-plugin | 5 | 0 | 1 | no | no (`angular15`) |
| eform-angular-greate-belt-plugin | 3 | 0 | 1 | yes (stale) | yes |

Out of scope (dormant since 2022–23 or no CI): appointment, basiccasemgmt, eform-dashboard, work-orders, banedanmarkla.

### 5.2 Per-plugin recipe

Each plugin is migrated in its worktree on `ng21/migrate` as three commits:

1. **CI** — `dotnet-core-pr.yml`: frontend checkout `ref: stable` → `ref: ${{ github.base_ref }}`. For chemical, inventory, monitoring, kanban also add `angular19` to `branches:` in both workflow files.
2. **Standalone** — per component: read template, add explicit `imports: [...]`, remove `standalone: false`. Modules: `declarations` → `imports`. Replace `EformImportedModule` / `FormattingTextEditorModule` / `EformSharedModule` with direct component imports. Convert static IDs in repeated templates to indexed IDs.
3. **Tests** — Jest → Vitest (`jest.*` → `vi.*`, explicit `vitest` imports, TestBed `declarations` → `imports`).

### 5.3 Execution model

- One subagent per plugin; backendconfiguration split ~6 ways and timeplanning ~3 ways by feature folder. Each prompt includes the corrected migration guide, the import lookup table and the Phase A export inventory.
- Subagents edit and run unit tests only. **The main agent alone** syncs into the frontend worktree and runs `ng build`, serially, to avoid concurrent use of one `.angular` cache.
- Each `ng build` includes this plugin **plus all previously migrated plugins**.

### 5.4 Waves

Plugin CI resolves the frontend `angular19` by branch name, so Phase B starts only after the Phase A PR is merged into `angular19`.

| Wave | Plugins | Purpose |
|---|---|---|
| 1 (pilot) | greate-belt, workflow, items-planning | Prove the recipe; refine subagent prompts from findings |
| 2 | monitoring, basecustomer, chemical, outer-inner-resource, rentableitem, trashinspection | Small/medium |
| 3 | insight-dashboard, inventory, kanban, timeplanning | Large, test-heavy |
| 4 | backendconfiguration | Largest and most used; isolated |

### 5.5 Per-plugin definition of done

- `ng build` green with all migrated plugins installed.
- Plugin Vitest green.
- `grep` finds zero `standalone: false`, `declarations:`, `EformImportedModule`, `FormattingTextEditorModule` in the plugin module tree.
- Code review via `superpowers:requesting-code-review` passed.
- PR CI green.
- User click-through: main page loads, dialogs open, ng-select/mtx-select works inside a dialog.

## 6. Phase C — Cutover

### 6.1 Preconditions

- All 14 plugin PRs merged into `angular19`, CI green.
- Frontend `angular19` re-merged with `master` within the last day; each plugin `angular19` re-merged with `stable`.
- Full smoke test with all 14 plugins installed in the worktree.
- **Explicit user go.**

### 6.2 Sequence

1. User announces merge freeze on `master`/`stable` of the 15 repos.
2. Tag `pre-ng21` on frontend `master` + `stable` and every plugin `stable` (push after approval).
3. Frontend: PR `angular19` → `master`, merge, promote to `stable` per normal practice. Plugin `stable` CI is expected red until step 4.
4. Plugins: PR `angular19` → `stable` in all 14 repos, merged in wave order. Use `gh api` REST for merging (`gh pr edit` fails on these repos — Projects classic).
5. Verify: all 15 mainline CI runs green, Docker image builds from `stable`, final smoke test.

### 6.3 Rollback

`git revert -m 1 <cutover merge>` in **all** repos together (frontend + plugins). Partial rollback is invalid — Angular 20 plugins cannot run in an Angular 21 host and vice versa. `pre-ng21` tags are the verification reference.

### 6.4 Afterwards

- Reset `angular19` to `stable` in all repos, ready for the next upgrade.
- Replace the memory rule "all components must have `standalone: false`" with the standalone convention.
- Update `CLAUDE.md` and the `angular21-migration` skill to describe standalone as the norm.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Master changes silently lost in conflict resolution | Dropped-change audit in §4.3 gate 4 |
| Missing template imports render as broken UI, not build errors | Per-plugin user click-through; ng-select-in-dialog check |
| Master keeps moving during a multi-week effort | Re-merge before each wave and before cutover (§4.4) |
| Accidental write to main checkouts | No `devinstall.sh`/`devgetchanges.sh`; all paths under `worktrees/ng21/`; non-default ports |
| PR CI tests against wrong frontend | Commit 1 of every plugin PR switches to `github.base_ref` |
| Mainline red during cutover | Short, announced freeze window; frontend first, plugins immediately after |
| context7 MCP unavailable | Use web search / Angular update guide; retry context7 when re-authed |
