# Angular 21 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land Angular 21 on `eform-angular-frontend` and 14 plugins via the `angular19` branches, then cut over to mainline in one coordinated release.

**Architecture:** Phase A merges `origin/master` into the existing Angular 21 branch `origin/angular19` of the frontend and finishes the standalone conversion. Phase B converts each plugin to standalone components + Vitest in its own worktree, verified by building every migrated plugin together inside the frontend worktree. Phase C merges `angular19` into mainline across all 15 repos.

**Tech Stack:** Angular 21.1, Angular Material 21, `@ng-matero/extensions` 21.1.3, `@ngrx/*` 21.1.0, TypeScript 5.9.3, Vitest 4, yarn, GitHub Actions, `gh`.

**Spec:** `docs/superpowers/specs/2026-10-17-angular21-upgrade-design.md`

## Global Constraints

- Root of all work: `W=~/Documents/workspace/microting/worktrees/ng21`. Frontend worktree `$W/eform-angular-frontend` (branch `ng21/merge-master`). Plugin worktrees `$W/<plugin-repo>` (branch `ng21/migrate`).
- **Never** modify `~/Documents/workspace/microting/eform-angular-frontend` or `~/Documents/workspace/microting/<plugin-repo>` working trees. Only `git worktree add` / `git fetch` against those repos.
- **Never** run `devinstall.sh`, `devgetchanges.sh`, `git add .`, `git commit -a`, `git clean`.
- `git add` and `git commit` must be **separate Bash calls** (repo guard hook R10).
- Every `git push`, branch creation on origin, tag push, PR merge requires explicit user approval at that moment.
- Push the frontend branch only as `git push origin ng21/merge-master` (local branch tracks `origin/angular19`; bare `git push` would hit `angular19`).
- Versions stay as on `origin/angular19`: `@angular/*` 21.1.0, `@ng-matero/extensions` 21.1.3, `@ngrx/*` 21.1.0, `typescript` 5.9.3, `vitest` ^4.
- Package manager: yarn (never npm install).
- Dev servers for this effort: `ng serve --port 4300`, log `/tmp/ngserve-ng21.log`; backend `--urls http://localhost:5100;https://localhost:5101`. Never touch :4200/:5000.
- Plugin directories inside the frontend worktree (`eform-client/src/app/plugins/modules/*-pn`, `eFormAPI/Plugins/*.Pn`) and `plugins.routing.ts` route insertions are never committed.
- All SCSS changes go in the frontend (`eform-client/src/scss/**`), never in plugins.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Out-of-scope plugins: appointment, basiccasemgmt, eform-dashboard, work-orders, banedanmarkla.

## Review Focus

1. **ng-select / mtx-select inside a Material dialog** — dropdown must open above the dialog and accept clicks; a missing import or lost overlay SCSS fix shows nothing or an unclickable list. Pinned by the dialog click-through in Task 10 and Task 13 Step 9.
2. **Missing `TranslatePipe`/`TranslateModule` import** — template shows nothing or the raw text instead of translations without a build error when `CUSTOM_ELEMENTS_SCHEMA`/`NO_ERRORS_SCHEMA` is present. Pinned by the schema grep in Task 7 Step 5 and Task 13 Step 6.
3. **Plugin lazy route** — `loadChildren: () => import('./modules/<x>-pn/<x>-pn.module').then(m => m.<X>PnModule)` must still resolve after `declarations` removal; navigating to `/plugins/<x>-pn` must render, not blank. Pinned by `ng build` with routes inserted (Task 11) and click-through (Task 13 Step 9).
4. **Master features silently dropped during merge** — a conflict resolved "ours" loses a bug fix. Pinned by the dropped-change audit in Task 9 Step 3.
5. **Rows rendered by `mtx-grid`/`*ngFor` with duplicate static IDs** — e2e selectors hit the first row only. Pinned by the duplicate-ID grep in Task 7 Step 6 and Task 13 Step 6.

---

## Phase A — Frontend

### Task 1: Baseline and skill correction

**Files:**
- Modify: `~/.claude/skills/angular21-migration/references/migration-guide.md` (ngrx version lines)
- Modify: `~/.claude/skills/angular21-migration/SKILL.md` (step 4 + pitfall 4 ngrx lines)
- Create: `$SCRATCH/baseline-vitest.txt`, `$SCRATCH/baseline-build.txt` (`$SCRATCH` = session scratchpad)

**Interfaces:**
- Produces: baseline failure list used by Task 9 Step 1.

- [ ] **Step 1: Install deps on pre-merge `angular19`**

```bash
cd $W/eform-angular-frontend/eform-client && git log --oneline -1 && yarn install --frozen-lockfile
```
Expected: HEAD is the plan commit, on top of the spec commit `8f7df9898`, on top of `c9851c8e6`; install exits 0.

- [ ] **Step 2: Baseline build**

```bash
cd $W/eform-angular-frontend/eform-client && npx ng build 2>&1 | tee $SCRATCH/baseline-build.txt | tail -20
```
Expected: record exit code and any errors verbatim (baseline may already be red; that is information, not a blocker).

- [ ] **Step 3: Baseline unit tests**

```bash
cd $W/eform-angular-frontend/eform-client && npx vitest run --reporter=dot 2>&1 | tee $SCRATCH/baseline-vitest.txt | tail -30
```
Expected: record pass/fail counts and failing test file names.

- [ ] **Step 4: Correct the skill's ngrx pin**

```bash
grep -n "19.2.1\|@ngrx" ~/.claude/skills/angular21-migration/SKILL.md ~/.claude/skills/angular21-migration/references/migration-guide.md
```
Edit every `@ngrx/*` → `19.2.1` statement to `21.1.0`, and replace pitfall 4 in `SKILL.md` with:
```
4. **`@ngrx/*` is 21.1.0** — earlier guidance to pin 19.2.1 was superseded by frontend PR #7744.
```

- [ ] **Step 5: Verify**

```bash
grep -rn "19.2.1" ~/.claude/skills/angular21-migration/ || echo CLEAN
```
Expected: `CLEAN`. (Not a repo — no commit.)

---

### Task 2: Start merge; resolve G1 (config/build) and G4 (app shell)

**Files (conflicted, resolve in place):**
- `eform-client/package.json`, `eform-client/yarn.lock`, `eform-client/test/tsconfig.json`
- `.github/workflows/dotnet-core-master.yml`, `.github/workflows/dotnet-core-pr.yml`
- `eform-client/src/app/app.module.ts`, `eform-client/src/app/components/app.component.ts`, `eform-client/src/scss/styles.scss`

**Interfaces:**
- Produces: a working tree in merge state with G1+G4 resolved and staged; G2/G3/G5 still conflicted for Tasks 3–5.

- [ ] **Step 1: Fetch and start the merge**

```bash
cd $W/eform-angular-frontend && git fetch origin && git merge --no-commit --no-ff origin/master; git diff --name-only --diff-filter=U | tee $SCRATCH/conflicts-live.txt | wc -l
```
Expected: around 49 conflicted files (more if master moved since 2026-10-17; update the group lists accordingly).

- [ ] **Step 2: Resolve `package.json`**

Rules: every `@angular/*`, `@angular-devkit/*`, `@angular-eslint/*`, `@ngrx/*`, `@ng-matero/*`, `typescript`, `vitest`, `@vitest/*`, `jsdom`, `zone.js` and the `scripts` block take the `angular19` ("ours") side. All other dependencies take the higher of the two versions. Delete conflict markers.
```bash
cd $W/eform-angular-frontend/eform-client && node -e "JSON.parse(require('fs').readFileSync('package.json'))" && grep -E '"@angular/core"|"@ngrx/store"|"typescript"|"vitest"' package.json
```
Expected: valid JSON; `21.1.0`, `21.1.0`, `5.9.3`, `^4…`.

- [ ] **Step 3: Regenerate `yarn.lock`**

```bash
cd $W/eform-angular-frontend/eform-client && git checkout --ours yarn.lock && yarn install && grep -c '<<<<<<<' yarn.lock
```
Expected: install exits 0; count `0`.

- [ ] **Step 4: Resolve `test/tsconfig.json` and the two workflows**

`test/tsconfig.json`: keep `angular19` compiler options (`moduleResolution: "Bundler"`, vitest types); add any new `include`/`files` entries from master. Workflows: keep master's job/step changes; keep `angular19` in `branches:`; keep any `angular19`-side test-runner changes (Vitest step, Playwright retries setting).
```bash
cd $W/eform-angular-frontend && grep -c '<<<<<<<\|>>>>>>>' eform-client/test/tsconfig.json .github/workflows/*.yml
```
Expected: all `0`.

- [ ] **Step 5: Resolve app shell (G4)**

`app.module.ts` / `app.component.ts`: keep the standalone bootstrap wiring (`provideZoneChangeDetection`, `OVERLAY_DEFAULT_CONFIG`, CMS reducer/effects, `CmsService` at root); add master's new providers/logic. Any new component referenced must be imported, not declared.
`styles.scss`: keep `angular19`'s CDK overlay/popover, `mdc-text-field will-change`, `mat-tree-node`, form-field subscript pointer-event rules; append master's new rules.
```bash
cd $W/eform-angular-frontend/eform-client && grep -c '<<<<<<<\|>>>>>>>' src/app/app.module.ts src/app/components/app.component.ts src/scss/styles.scss && grep -n "declarations" src/app/app.module.ts
```
Expected: `0` markers; review any `declarations` line (should contain only NgModule-only items, ideally none).

- [ ] **Step 6: Stage G1+G4**

```bash
cd $W/eform-angular-frontend && git add eform-client/package.json eform-client/yarn.lock eform-client/test/tsconfig.json .github/workflows/dotnet-core-master.yml .github/workflows/dotnet-core-pr.yml eform-client/src/app/app.module.ts eform-client/src/app/components/app.component.ts eform-client/src/scss/styles.scss
```
(No commit — merge is concluded in Task 6.)

---

### Tasks 3–5: Conflict groups G2, G3, G5 (parallel subagents)

Run Tasks 3, 4, 5 concurrently; their file sets are disjoint. Each subagent receives: this task text, the Global Constraints, and the resolution rule below.

**Shared resolution rule (G2/G3):** The file's shape comes from `angular19` ("ours"): standalone component with `imports: [...]`, no `standalone: false`, no `declarations`. The behavior comes from `master` ("theirs"): every logic, template, input/output and service change from master must be present. If master's template adds a directive/pipe/component, add it to the component's `imports`. In `.html`, keep indexed IDs from `angular19` (e.g. `id="actionMenu{{i}}"`, `let-i="index"`) while applying master's markup changes. To see master's intent for a file: `git log -p origin/angular19..origin/master -- <file>`.

**Subagents must not** run `git add`/`git commit`, `yarn install`, `ng build`, or touch files outside their list. They report: files resolved, every master change they consciously did *not* carry over (with reason), imports added.

### Task 3: G2 — shared components

**Files:**
- `eform-client/src/app/common/modules/eform-cases/components/case-edit-nav/case-edit-nav.component.ts`
- `eform-client/src/app/common/modules/eform-cases/components/case-edit/case-edit-element/case-edit-element.component.ts`
- `eform-client/src/app/common/modules/eform-cases/components/case-edit/case-edit-switch/case-edit-switch.component.ts`
- `eform-client/src/app/common/modules/eform-cases/components/case-edit/case-elements/element-picture/element-picture.component.ts`
- `eform-client/src/app/common/modules/eform-cases/components/case-edit/case-elements/element-signature/element-signature.component.ts`
- `eform-client/src/app/common/modules/eform-shared-tags/components/shared-tag-multiple-create/shared-tag-multiple-create.component.ts`
- `eform-client/src/app/common/modules/eform-shared-tags/components/shared-tags/shared-tags.component.ts`
- `eform-client/src/app/common/modules/eform-shared/eform-shared.module.ts`
- `eform-client/src/app/plugins/modules/shared/components/userback-widget/userback-widget.component.ts`
- `eform-client/src/app/plugins/modules/shared/shared-pn.module.ts`

- [ ] **Step 1:** For each file, `git diff <file>` to view markers; `git log -p origin/angular19..origin/master -- <file>` for master intent.
- [ ] **Step 2:** Resolve per the shared rule.
- [ ] **Step 3: Verify**

```bash
cd $W/eform-angular-frontend && for f in <files above>; do grep -Hc '<<<<<<<\|=======$\|>>>>>>>' "$f"; grep -Hn 'standalone: false\|declarations:' "$f"; done
```
Expected: every count `0`; `declarations:` only acceptable in the two `.module.ts` files if they still declare nothing (array removed is preferred).

### Task 4: G3 — feature modules

**Files:** every path in `$SCRATCH/conflicts-live.txt` under `eform-client/src/app/modules/` — on 2026-10-17:
- `modules/account-management/account-management.module.ts`
- `modules/account-management/components/users/user-set-password-modal/user-set-password.component.ts`
- `modules/account-management/components/users/users-page/users-page.component.html`
- `modules/advanced/components/sites/sites/sites.component.html`
- `modules/advanced/components/sites/sites/sites.component.ts`
- `modules/advanced/modules/navigation-menu/components/menu-custom/navigation-menu-custom-link/navigation-menu-custom-link.component.ts`
- `modules/advanced/modules/navigation-menu/components/menu-item/navigation-menu-item-edit/navigation-menu-item-edit.component.ts`
- `modules/advanced/modules/navigation-menu/components/navigation-menu-page/navigation-menu-page.component.ts`
- `modules/auth/auth.module.ts`
- `modules/auth/components/auth/login/login.component.ts`
- `modules/auth/components/auth/reset-admin-password/reset-admin-password.component.ts`
- `modules/device-users/components/device-users-page/device-users-page.component.html`
- `modules/eforms/components/eform-create-modal/eform-create-modal.component.ts`
- `modules/eforms/components/eforms-page/eforms-page.component.html`

- [ ] **Step 1–3:** identical procedure to Task 3 Steps 1–3 over this file list. Additionally for each `.html`:

```bash
grep -n 'id="[^"{]*"' <file.html>
```
Expected: any static `id` inside an `mtx-grid` cell template or `*ngFor` must be indexed.

### Task 5: G5 — e2e / Playwright

**Files:** every path in `$SCRATCH/conflicts-live.txt` under `eform-client/e2e/` and `eform-client/playwright/`.

Rule: take master's new tests and assertions; keep `angular19`'s selector changes (indexed IDs, mat-menu pattern), explicit waits, null guards and `retries` settings.

- [ ] **Step 1:** Resolve each file.
- [ ] **Step 2: Verify**

```bash
cd $W/eform-angular-frontend/eform-client && grep -rlc '<<<<<<<\|>>>>>>>' e2e playwright || echo CLEAN
```
Expected: `CLEAN`.

---

### Task 6: Conclude the merge commit

**Files:** all files resolved by Tasks 3–5.

**Interfaces:**
- Consumes: resolved tree from Tasks 2–5.
- Produces: merge commit on `ng21/merge-master` whose second parent is `origin/master`.

- [ ] **Step 1: Confirm no markers remain anywhere**

```bash
cd $W/eform-angular-frontend && git diff --name-only --diff-filter=U; git grep -n '^<<<<<<< \|^>>>>>>> ' -- . ':!*.lock' || echo NO-MARKERS
```
Expected: no unmerged paths; `NO-MARKERS`.

- [ ] **Step 2: Build**

```bash
cd $W/eform-angular-frontend/eform-client && npx ng build 2>&1 | tail -40
```
Expected: exit 0. If errors are "is not a known element"/"not standalone"/"must be imported", fix in the offending file (same rule as Tasks 3–4) and rebuild. Errors also present in `$SCRATCH/baseline-build.txt` are pre-existing; note them, do not chase them here.

- [ ] **Step 3: Stage resolved files by name**

```bash
cd $W/eform-angular-frontend && git add $(cat $SCRATCH/conflicts-live.txt | tr '\n' ' ')
```

- [ ] **Step 4: Commit (separate call)**

```bash
cd $W/eform-angular-frontend && git commit -m "Merge origin/master into angular19

Brings 485 master commits onto the Angular 21 branch. Conflicts resolved
keeping angular19's standalone component shape and Material 21 fixes
while carrying over master's behavior changes.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
Expected: `git log -1 --format=%P` shows two parents.

---

### Task 7: Standalone sweep (frontend)

**Files:** every file from

```bash
cd $W/eform-angular-frontend && git grep -l 'standalone: false' -- eform-client/src; git grep -l 'declarations:' -- 'eform-client/src/*module.ts'
```
(≈25 + ≈10 on 2026-10-17). Split into ≤6 subagent groups by top-level folder (`common/modules/*`, `modules/<feature>`, `plugins/modules/shared`, `components`). Exclude `eform-client/src/app/plugins/modules/*-pn/**` (plugin scratch).

**Interfaces:**
- Produces: frontend with zero `standalone: false` and zero `declarations:` outside plugin scratch.

- [ ] **Step 1 (per subagent): Convert components**

For each component: read the `.component.html`, add imports per the lookup table in `~/.claude/skills/angular21-migration/references/migration-guide.md`, delete `standalone: false`. Example of the target shape:
```ts
@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  imports: [TranslatePipe, MatButton, MatIcon, MatTooltip, MtxGrid, AsyncPipe, SitesActionsComponent],
})
export class SitesComponent { /* unchanged */ }
```

- [ ] **Step 2 (per subagent): Convert modules**

Move every `declarations` entry into `imports`; delete the `declarations` key; keep `exports` as is.

- [ ] **Step 3: Build (main agent, after all subagents finish)**

```bash
cd $W/eform-angular-frontend/eform-client && npx ng build 2>&1 | tail -40
```
Expected: exit 0.

- [ ] **Step 4: Grep gate**

```bash
cd $W/eform-angular-frontend && git grep -n 'standalone: false' -- eform-client/src ':!eform-client/src/app/plugins/modules/*-pn' ; git grep -n 'declarations:' -- 'eform-client/src/*module.ts' ':!eform-client/src/app/plugins/modules/*-pn' ; echo DONE
```
Expected: only `DONE` printed.

- [ ] **Step 5: Schema gate (Review Focus 2)**

```bash
cd $W/eform-angular-frontend && git grep -n 'NO_ERRORS_SCHEMA\|CUSTOM_ELEMENTS_SCHEMA' -- eform-client/src ':!*.spec.ts'
```
Expected: no hits in non-spec code. Any hit must be removed and its build errors fixed with real imports.

- [ ] **Step 6: Duplicate-ID gate (Review Focus 5)**

```bash
cd $W/eform-angular-frontend/eform-client && grep -rn --include=*.html -B3 'id="[^"{]*"' src/app | grep -E 'ng-template|ngFor|@for' | head -50
```
Expected: no static IDs inside repeated templates; fix any found to `id="name{{i}}"` with `let-i="index"`.

- [ ] **Step 7: Run unit tests touching converted components**

```bash
cd $W/eform-angular-frontend/eform-client && npx vitest run --reporter=dot 2>&1 | tail -30
```
Expected: no new failures vs `$SCRATCH/baseline-vitest.txt`. Specs failing with "is not a known element"/"declarations" → move the component from TestBed `declarations` to `imports`.

- [ ] **Step 8: Stage and commit (two calls)**

```bash
cd $W/eform-angular-frontend && git add <every file changed, by name from `git status --short`>
```
```bash
cd $W/eform-angular-frontend && git commit -m "refactor: convert components merged from master to standalone

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Standalone export inventory

**Files:**
- Create: `$SCRATCH/ng21-export-inventory.md`

**Interfaces:**
- Produces: table `| Selector / pipe name | Class | Import path |` for every `@Component`/`@Directive`/`@Pipe` under `eform-client/src/app/common/**` and `eform-client/src/app/plugins/modules/shared/**`, plus the third-party imports used by the frontend for each Material/ng-select/mtx/ngx-translate tag. Consumed by Task 13 subagent prompts.

- [ ] **Step 1: Generate**

```bash
cd $W/eform-angular-frontend/eform-client && node -e '
const {execSync}=require("child_process");const fs=require("fs");
const files=execSync("git ls-files src/app/common src/app/plugins/modules/shared | grep -E \"\\.(component|directive|pipe)\\.ts$\"").toString().trim().split("\n");
let out="| Selector/name | Class | Import path |\n|---|---|---|\n";
for(const f of files){const s=fs.readFileSync(f,"utf8");
 const sel=(s.match(/selector:\s*["\x27]([^"\x27]+)/)||s.match(/name:\s*["\x27]([^"\x27]+)/)||[])[1]||"";
 const cls=(s.match(/export class (\w+)/)||[])[1]||"";
 out+=`| ${sel} | ${cls} | src/app/${f.replace(/^src\/app\//,"").replace(/\.ts$/,"")} |\n`;}
fs.writeFileSync(process.argv[1],out);' $SCRATCH/ng21-export-inventory.md && wc -l $SCRATCH/ng21-export-inventory.md
```
Expected: one row per file; spot-check that `app-eform-pagination`, `formatting-text-editor`, `eform-new-subheader` rows exist.

- [ ] **Step 2:** Append the third-party section by copying the import lookup table from `references/migration-guide.md` verbatim.

---

### Task 9: Merge verification gates

**Interfaces:**
- Consumes: baseline from Task 1, merge commit from Task 6, sweep from Task 7.

- [ ] **Step 1: Unit tests vs baseline**

```bash
cd $W/eform-angular-frontend/eform-client && npx vitest run --reporter=dot 2>&1 | tee $SCRATCH/post-merge-vitest.txt | tail -30
```
Expected: failing set ⊆ baseline failing set ∪ failures in specs master added (list them). Fix any failure caused by the merge.

- [ ] **Step 2: Lint**

```bash
cd $W/eform-angular-frontend/eform-client && yarn lint 2>&1 | tail -30
```
Expected: no errors (warnings acceptable if also present on `origin/master`).

- [ ] **Step 3: Dropped-change audit (subagent, Review Focus 4)**

Dispatch a reviewer subagent with this prompt: "In `$W/eform-angular-frontend`, for every file in `$SCRATCH/conflicts-live.txt`, run `git log --format=%h origin/angular19..origin/master -- <file>`; for each commit, run `git show <commit> -- <file>` and confirm each added/removed behavior is present in `HEAD:<file>` (allowing for standalone-shape differences). Report a table: file, commit, status (carried / missing / intentionally-dropped), evidence line." Fix every `missing`.

- [ ] **Step 4: Code review**

Invoke `superpowers:requesting-code-review` with base `origin/angular19`, head `HEAD`, focus: conflict resolutions and standalone imports. Address findings via `superpowers:receiving-code-review`; commit fixes (add and commit as separate calls).

---

### Task 10: Smoke test, push, PR into `angular19`

- [ ] **Step 1: Build backend in worktree and start on :5100**

```bash
pkill -f 'ng21/eform-angular-frontend/eFormAPI/eFormAPI.Web' ; cd $W/eform-angular-frontend/eFormAPI && dotnet clean eFormAPI.sln -c Debug && dotnet build eFormAPI.sln -c Debug 2>&1 | tail -5
```
```bash
cd $W/eform-angular-frontend/eFormAPI/eFormAPI.Web && ASPNETCORE_ENVIRONMENT=Development DOTNET_ROOT=$HOME/.dotnet nohup dotnet run --no-build -c Debug --urls "http://localhost:5100;https://localhost:5101" > /tmp/eform-ng21-backend.log 2>&1 &
```

- [ ] **Step 2: Start frontend on :4300 with proxy to :5100**

```bash
cd $W/eform-angular-frontend/eform-client && sed 's/localhost:5000/localhost:5100/g' proxy.config.json > $SCRATCH/proxy.ng21.json && nohup npx ng serve --port 4300 --proxy-config $SCRATCH/proxy.ng21.json > /tmp/ngserve-ng21.log 2>&1 &
```

- [ ] **Step 3: Health checks**

```bash
ss -tlnp | grep -E ':(4300|5100)\b'; curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:4300; curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:5100
```
Expected: both ports listening, both `200`.

- [ ] **Step 4: User click-through** — ask the user to verify on http://localhost:4300: login; My eForms (create modal, tag ng-select inside dialog); a case edit (picture + signature elements); Sites (action menu on 2nd row); Device users; Navigation menu edit (dialog). Wait for confirmation; fix and recommit anything reported.

- [ ] **Step 5: Push (after user approval)**

```bash
cd $W/eform-angular-frontend && git push origin ng21/merge-master
```

- [ ] **Step 6: Open PR**

```bash
gh pr create -R microting/eform-angular-frontend --base angular19 --head ng21/merge-master --title "Merge master into angular19 (Angular 21)" --body "$(cat <<'EOF'
Merges origin/master into angular19 and converts the components that came with it to standalone.

- Spec: docs/superpowers/specs/2026-10-17-angular21-upgrade-design.md
- Plan: docs/superpowers/plans/2026-10-17-angular21-upgrade.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 7:** Watch CI (`gh pr checks <n> --watch`). On red, `superpowers:systematic-debugging`, fix, push. Merge only after user approval, via `gh api -X PUT repos/microting/eform-angular-frontend/pulls/<n>/merge -f merge_method=merge`.

---

## Phase B — Plugins

### Task 11: Plugin sync script

**Files:**
- Create: `$SCRATCH/sync-plugins-to-ng21.sh`

**Interfaces:**
- Produces: `sync-plugins-to-ng21.sh <repo>...` — for each repo: rsync Angular module + `.Pn` into the frontend worktree, then rebuild `plugins.routing.ts` from scratch with routes for **all** repos passed. Used by Task 13.

- [ ] **Step 1: Write the script**

```bash
#!/bin/bash
# One-way sync of plugin worktrees into the ng21 frontend worktree. Never touches main checkouts.
set -euo pipefail
W=$HOME/Documents/workspace/microting/worktrees/ng21
FE=$W/eform-angular-frontend
case "$FE" in */worktrees/ng21/*) ;; *) echo "refusing: $FE"; exit 1;; esac
cd "$FE/eform-client" && git checkout -- src/app/plugins/plugins.routing.ts
for repo in "$@"; do
  P=$W/$repo
  [ -d "$P/.git" ] || [ -f "$P/.git" ] || { echo "no worktree: $P"; exit 1; }
  mod=$(ls "$P/eform-client/src/app/plugins/modules/")
  pn=$(ls "$P/eFormAPI/Plugins/")
  rsync -a --delete "$P/eform-client/src/app/plugins/modules/$mod/" "$FE/eform-client/src/app/plugins/modules/$mod/"
  mkdir -p "$FE/eFormAPI/Plugins"
  rsync -a --delete "$P/eFormAPI/Plugins/$pn/" "$FE/eFormAPI/Plugins/$pn/"
  (cd "$FE/eform-client" && bash "$P/testinginstallpn.sh")
  echo "synced $repo ($mod, $pn)"
done
```

- [ ] **Step 2: Guard test — script refuses a wrong root**

```bash
chmod +x $SCRATCH/sync-plugins-to-ng21.sh && sed 's#worktrees/ng21#WRONG#' $SCRATCH/sync-plugins-to-ng21.sh > $SCRATCH/sync-wrong.sh && bash $SCRATCH/sync-wrong.sh x; echo rc=$?
```
Expected: `refusing: …` and `rc=1`.

- [ ] **Step 3: Verify `testinginstallpn.sh` only uses relative paths in every in-scope repo**

```bash
cd ~/Documents/workspace/microting && for d in <14 repos>; do grep -Hn 'Documents\|~/\|cd ' $d/testinginstallpn.sh; done; echo CHECKED
```
Expected: only `CHECKED`. Any hit → do not call that repo's script; inline its route block into the sync script for that repo instead.

---

### Task 12: Plugin branches and worktrees

**Interfaces:**
- Produces: `$W/<repo>` worktree on `ng21/migrate` based on an `origin/angular19` equal to `origin/stable`, for all 14 repos.

Repos: `eform-backendconfiguration-plugin eform-angular-greate-belt-plugin eform-angular-insight-dashboard-plugin eform-angular-items-planning-plugin eform-angular-outer-inner-resource-plugin eform-angular-timeplanning-plugin eform-angular-trashinspection-plugin eform-angular-workflow-plugin eform-angular-basecustomer-plugin eform-angular-rentableitem-plugin eform-angular-chemical-plugin eform-angular-inventory-plugin eform-angular-monitoring-plugin eform-kanban-plugin`

- [ ] **Step 1: Verify existing `angular19` branches have no unique commits**

```bash
cd ~/Documents/workspace/microting && for d in $REPOS; do git -C $d fetch -q origin; if git -C $d rev-parse -q --verify origin/angular19 >/dev/null; then echo "$d ahead=$(git -C $d rev-list --count origin/stable..origin/angular19)"; else echo "$d missing"; fi; done
```
Expected: every existing branch `ahead=0`. Any `ahead>0` → stop and ask the user.

- [ ] **Step 2: Update origin `angular19` = `origin/stable` (after user approval; this pushes 14 branches)**

```bash
cd ~/Documents/workspace/microting && for d in $REPOS; do git -C $d push origin origin/stable:refs/heads/angular19; done
```
Expected: fast-forward or new-branch for each; no forced updates.

- [ ] **Step 3: Create worktrees**

```bash
cd ~/Documents/workspace/microting && for d in $REPOS; do git -C $d fetch -q origin && git -C $d worktree add -b ng21/migrate $W/$d origin/angular19; done && ls $W
```
Expected: 15 directories under `$W`.

---

### Task 13: Migrate one plugin (repeat per plugin, by wave)

Parameters per plugin:

| Repo | Module dir | `.Pn` | Wave | Extra CI change |
|---|---|---|---|---|
| eform-angular-greate-belt-plugin | greate-belt-pn | GreateBelt.Pn | 1 | – |
| eform-angular-workflow-plugin | workflow-pn | Workflow.Pn | 1 | – |
| eform-angular-items-planning-plugin | items-planning-pn | ItemsPlanning.Pn | 1 | – |
| eform-angular-monitoring-plugin | monitoring-pn | Monitoring.Pn | 2 | add `angular19` to branches |
| eform-angular-basecustomer-plugin | customers-pn | Customers.Pn | 2 | – |
| eform-angular-chemical-plugin | chemicals-pn | Chemicals.Pn | 2 | add `angular19` to branches |
| eform-angular-outer-inner-resource-plugin | outer-inner-resource-pn | OuterInnerResource.Pn | 2 | – |
| eform-angular-rentableitem-plugin | rentable-items-pn | RentableItems.Pn | 2 | – |
| eform-angular-trashinspection-plugin | trash-inspection-pn | TrashInspection.Pn | 2 | – |
| eform-angular-insight-dashboard-plugin | insight-dashboard-pn | InsightDashboard.Pn | 3 | – |
| eform-angular-inventory-plugin | inventory-pn | Inventory.Pn | 3 | add `angular19` to branches |
| eform-kanban-plugin | kanban-pn | Kanban.Pn | 3 | add `angular19` to branches |
| eform-angular-timeplanning-plugin | time-planning-pn | TimePlanning.Pn | 3 | – (split ~3 subagents) |
| eform-backendconfiguration-plugin | backend-configuration-pn | BackendConfiguration.Pn | 4 | – (split ~6 subagents) |

`$P=$W/<repo>`, `$M=eform-client/src/app/plugins/modules/<module dir>`, `$DONE` = space-separated list of repos already migrated (including this one).

**Files:**
- Modify: `$P/.github/workflows/dotnet-core-pr.yml` (and `dotnet-core-master.yml` when extra CI change applies)
- Modify: every `*.component.ts`, `*.module.ts`, `*.spec.ts`, repeated-row `*.html` under `$P/$M`
- Delete: any `jest.config.*` in `$P/eform-client`

**Interfaces:**
- Consumes: `$SCRATCH/ng21-export-inventory.md` (Task 8), `sync-plugins-to-ng21.sh` (Task 11), worktree (Task 12).
- Produces: branch `ng21/migrate` with commits C1 (CI), C2 (standalone), C3 (tests), PR into `angular19`.

- [ ] **Step 0 (once per wave): refresh bases**

Re-merge `origin/master` into frontend `angular19` via a PR if master moved (Tasks 2–10 shortened); in each wave repo: `git -C $P fetch origin && git -C $P merge origin/stable` (no conflicts expected — branch is stable-based).

- [ ] **Step 1: C1 — CI**

In `$P/.github/workflows/dotnet-core-pr.yml`, replace every frontend checkout `ref: stable` with:
```yaml
          ref: ${{ github.base_ref }}
```
If extra CI change applies, set in both workflow files:
```yaml
    branches: [ master, stable, angular19 ]
```
```bash
cd $P && grep -n 'ref:\|branches:' .github/workflows/*.yml
```
Expected: no `ref: stable` for the frontend checkout; `angular19` in both `branches:`.
```bash
cd $P && git add .github/workflows/dotnet-core-pr.yml .github/workflows/dotnet-core-master.yml
```
```bash
cd $P && git commit -m "ci: test PRs against the frontend branch matching the PR base

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 2: Baseline grep (records the work)**

```bash
cd $P && grep -rln 'standalone: false' $M | wc -l; grep -rln 'declarations:' $M | wc -l; grep -rn 'EformImportedModule\|FormattingTextEditorModule\|EformSharedModule' $M | wc -l
```

- [ ] **Step 3: C2 — standalone conversion (subagent(s))**

Subagent prompt contents: Global Constraints; the shared rule from Tasks 3–5; the target component shape from Task 7 Step 1; `$SCRATCH/ng21-export-inventory.md`; the file list (split by feature folder for timeplanning/backendconfiguration). Instructions:
1. Per component: read template, add every used directive/pipe/component to `imports` (use the inventory for frontend components; never import a wrapper module), delete `standalone: false`.
2. Per module: move `declarations` into `imports`, delete `declarations`; replace `EformImportedModule`/`FormattingTextEditorModule`/`EformSharedModule` with the concrete standalone classes the plugin's templates use.
3. Repeated templates: static IDs → `id="name{{i}}"` with `let-i="index"` (or `$index` in `@for`); update the plugin's own e2e/playwright selectors for any ID changed.
4. Do not run git or builds; report files changed and any template tag that had no inventory match.

- [ ] **Step 4: Sync + build with all migrated plugins (main agent)**

```bash
$SCRATCH/sync-plugins-to-ng21.sh $DONE && cd $W/eform-angular-frontend/eform-client && npx ng build 2>&1 | tail -40
```
Expected: exit 0. Fix errors in `$P` (never in the frontend copy), re-sync, rebuild.

- [ ] **Step 5: Grep gate**

```bash
cd $P && grep -rn 'standalone: false\|declarations:\|EformImportedModule\|FormattingTextEditorModule' $M | grep -v '\.spec\.ts' || echo CLEAN
```
Expected: `CLEAN`.

- [ ] **Step 6: Schema + duplicate-ID gates (Review Focus 2, 5)**

```bash
cd $P && grep -rn 'NO_ERRORS_SCHEMA\|CUSTOM_ELEMENTS_SCHEMA' $M | grep -v '\.spec\.ts'; grep -rn --include=*.html -B3 'id="[^"{]*"' $M | grep -E 'ng-template|ngFor|@for'; echo CHECKED
```
Expected: only `CHECKED`.

- [ ] **Step 7: Commit C2 (two calls)**

```bash
cd $P && git add $(git status --short $M eform-client/e2e eform-client/playwright eform-client/cypress | awk '{print $2}')
```
```bash
cd $P && git commit -m "refactor: convert <module dir> to standalone components for Angular 21

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 8: C3 — tests to Vitest (skip if no `*.spec.ts`)**

Subagent converts each spec: `jest.fn` → `vi.fn`, `jest.spyOn` → `vi.spyOn`, `jest.mock` → `vi.mock`, `jest.Mocked<T>` → `Mocked<T>` (from `vitest`); add `import { describe, it, expect, beforeEach, vi } from 'vitest';`; TestBed `declarations: [X]` → `imports: [X]`. Delete `$P/eform-client/jest.config.*` if present. Then sync and run only this plugin's specs:
```bash
$SCRATCH/sync-plugins-to-ng21.sh $DONE && cd $W/eform-angular-frontend/eform-client && npx vitest run src/app/plugins/modules/<module dir> --reporter=dot 2>&1 | tail -30
```
Expected: all pass. Then:
```bash
cd $P && grep -rn 'jest\.' $M || echo NO-JEST
```
Expected: `NO-JEST`. Commit (`git add` by name, then `git commit -m "test: migrate <module dir> specs from Jest to Vitest" …` as separate calls).

- [ ] **Step 9: Review + click-through**

Invoke `superpowers:requesting-code-review` on `origin/angular19..HEAD` in `$P`. Then restart `ng serve` on :4300 (pkill `ng serve --port 4300`, delete `.angular/cache` if TS2339 phantom errors) and ask the user to verify `/plugins/<module dir>`: main page renders, a create/edit dialog opens, any ng-select/mtx-select in a dialog opens above it and selects (Review Focus 1, 3).

- [ ] **Step 10: Push + PR (after user approval)**

```bash
cd $P && git push origin ng21/migrate
```
```bash
gh pr create -R microting/<repo> --base angular19 --head ng21/migrate --title "Angular 21: standalone components + Vitest" --body "$(cat <<'EOF'
Part of the Angular 21 upgrade (frontend spec: docs/superpowers/specs/2026-10-17-angular21-upgrade-design.md).

- CI: PR workflow checks out the frontend branch matching the PR base
- Components converted to standalone; module declarations removed
- Specs migrated from Jest to Vitest

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: PR CI green (requires Task 10's PR merged into frontend `angular19`). Merge after user approval with `gh api -X PUT repos/microting/<repo>/pulls/<n>/merge -f merge_method=merge`.

- [ ] **Step 11 (end of Wave 1 only): Refine the recipe**

Collect every manual fix made in Steps 4–9 across the three pilots; add them to this task's Step 3 instructions and to `references/migration-guide.md` before starting Wave 2.

---

## Phase C — Cutover

### Task 14: Cutover readiness

- [ ] **Step 1:** Confirm all 14 plugin PRs merged into `angular19`: `for r in …; do gh pr list -R microting/$r --base angular19 --state open; done` → empty.
- [ ] **Step 2:** Re-merge frontend `master` → `angular19` (PR) and each plugin `stable` → `angular19` (PR); all CI green.
- [ ] **Step 3:** Full smoke test: `$SCRATCH/sync-plugins-to-ng21.sh <all 14>`, build, run on :4300/:5100, user clicks through every plugin landing page.
- [ ] **Step 4:** Draft the freeze announcement for the user; obtain explicit **go**.

### Task 15: Cutover execution (each push/merge after user approval)

- [ ] **Step 1: Tag rollback points**

```bash
cd ~/Documents/workspace/microting/eform-angular-frontend && git fetch origin && git tag pre-ng21-master origin/master && git tag pre-ng21-stable origin/stable
```
```bash
cd ~/Documents/workspace/microting && for d in $REPOS; do git -C $d fetch -q origin && git -C $d tag pre-ng21 origin/stable; done
```
Push tags after approval: `git push origin pre-ng21-master pre-ng21-stable` / `git -C $d push origin pre-ng21`.

- [ ] **Step 2: Frontend** — `gh pr create -R microting/eform-angular-frontend --base master --head angular19 …`; CI green; merge via `gh api`; then promote `master` → `stable` per the team's normal practice (ask user which).
- [ ] **Step 3: Plugins** — per repo in wave order: `gh pr create -R microting/<repo> --base stable --head angular19 …`; merge via `gh api` once CI green.
- [ ] **Step 4: Verify** — `gh run list -R microting/<repo> --branch stable -L 1` green for all 15; Docker image build from `stable` succeeds; user smoke test.

### Task 16: Post-cutover cleanup

- [ ] **Step 1:** Reset `angular19` to `stable` in all 15 repos (`git push origin origin/stable:refs/heads/angular19`, approval required).
- [ ] **Step 2:** Replace memory `feedback_standalone_false.md` content with: components are standalone by default; no `standalone: false`; templates' dependencies go in `imports`. Update its `MEMORY.md` line.
- [ ] **Step 3:** Update `~/Documents/workspace/microting/CLAUDE.md` and `angular21-migration` skill to state standalone is the norm; remove worktrees with `git worktree remove` after user confirms.

**Rollback (if Task 15 Step 4 fails):** in all 15 repos together, `git revert -m 1 <cutover merge sha>` via PR; verify tree equals `pre-ng21*` tag with `git diff pre-ng21 HEAD --stat` → empty.
