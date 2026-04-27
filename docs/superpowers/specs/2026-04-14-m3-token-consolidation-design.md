# M3 Token Consolidation — Design

## Context

The eForm frontend is mid-migration to Angular Material 3. The existing branch `feature/theme-switcher-workspace` (PR #7756, partially merged into `stable`) introduced the M3 plumbing — a token map in `_eform.scss`, an `apply-theme` mixin in `_theme-mixin.scss`, the `ThemeVariant` backend column, NgRx state, and an admin-settings picker UI. It also introduced a second tentative theme (`_workspace.scss`).

What it did *not* do: extract every hardcoded color, radius, size, and spacing value from the existing SCSS into the token vocabulary. As a result, swapping themes (or even just refactoring the eform default look) keeps surfacing hidden hardcoded values that diverge from the original visual identity. We have spent multiple iterations chasing visual regressions one-by-one through Playwright comparisons.

The user's standing feedback: when there is a complex but correct solution, propose it. No easy fixes. Fix it for good.

This spec defines a complete consolidation: audit *every* hardcoded visual value across the host app **and** all plugin source repos, lift them into a single token vocabulary, mechanically replace the hardcodes with `var(--…)` references, and gate the merge on a screenshot-regression diff against current production.

## Goals

1. After consolidation, the eform theme renders pixel-identical to today's `stable` (within anti-aliasing noise).
2. Every visual value used anywhere in `eform-angular-frontend` or any `eform-angular-*-plugin` repo is either (a) referenced via a `var(--…)` declared in the token vocabulary, or (b) explicitly classified as out-of-scope (e.g. SVG paint, animation keyframes).
3. Adding a new theme variant becomes a token-map swap with zero per-component SCSS edits.
4. A Playwright screenshot-diff regression suite exists as a reusable guard for future theme work.

## Non-goals

- Re-tuning the workspace theme tokens (separate follow-up).
- Visual changes to the eform theme (consolidation must be visually neutral).
- Changes to component DOM structure or Angular templates.
- Migrating motion (durations / easings) unless the audit finds in-scope usages.

## Approach: token-vocabulary-first, then mechanical replace

Three sequential phases, each with a hard review gate.

### Phase 1 — Vocabulary

A single subagent audits every targeted SCSS file and produces:

- **Vocabulary document** at `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md`. Per token: name, eform-light value, eform-dark value, source file:line, one example call site. Categories: color, typography, shape, sizing, spacing, elevation, (motion if applicable).
- **Populated `_eform.scss`** containing every token from the doc.
- **Populated `_theme-mixin.scss`** that emits a `--<token>` CSS custom property for every map key, plus the relevant `mat.*-overrides()` calls.
- **Skeleton `_workspace.scss`** with the same key set and placeholder values.

#### Audit method

Ripgrep across:
- `eform-client/src/scss/**/*.scss`
- `eform-client/src/app/**/*.scss`
- For each plugin source repo (enumerated via `ls /home/rene/Documents/workspace/microting/eform-angular-*-plugin`): `<repo>/eform-client/src/app/plugins/modules/<name>-pn/**/*.scss`

Patterns: hex colors, `rgb*()`/`hsl*()`, hardcoded `px`/`rem` for sizing/radii/spacing/typography in known properties (`width`, `height`, `min-height`, `max-height`, `border-radius`, `padding`, `margin`, `gap`, `font-size`, `line-height`, `letter-spacing`, `box-shadow`).

Excludes: SVG `fill`/`stroke` attributes inside templates, `0`/`auto`/`inherit`, values inside `@keyframes`, values inside `@media`/`@supports` breakpoint expressions.

#### Review gate

User reads the vocabulary doc and the populated `_eform.scss`. Naming, categorization, and value-conflation issues are fixed in phase 1 — not later.

### Phase 2 — Mechanical replace

Parallel subagents, partitioned by scope:

1. Host global — `eform-client/src/scss/components/**`, `scss/libs/**`, `scss/utilities/**`, `styles.scss`.
2. Host components — `eform-client/src/app/**/*.scss` excluding `src/app/plugins/modules/**`.
3. One subagent per plugin source repo (list produced by phase 1).

#### Subagent contract

- Read-only inputs: locked vocabulary doc, file list, forbidden-actions list.
- Allowed actions: replace hardcoded values with `var(--<token>, <fallback>)` where `<fallback>` is the literal value being replaced.
- Forbidden actions: invent new tokens, tweak any value, remove `!important`, restructure rules, reorder selectors.
- Blocked-on-gap protocol: if a value has no matching token, the subagent appends a row to `gaps.md` (file path, line, value, surrounding context) and continues with the rest. Gaps are resolved by the orchestrator in a single supervised edit to `_eform.scss` + `_theme-mixin.scss` + the vocabulary doc, then blocked subagents are restarted on their gap files.

#### Plugin sync

Plugin subagents work in dev-mode in the host app at `eform-client/src/app/plugins/modules/<name>-pn/`. After each plugin subagent reports complete, the orchestrator runs `devgetchanges.sh` from the source plugin repo, runs the standard reset of build artifacts (`git checkout *.csproj *.conf.ts *.xlsx *.docx`), reviews `git status` against the subagent's reported file list, and commits on the plugin's `chore/m3-token-consolidation` branch.

#### Concurrency safety

Phase 1 already locked the vocabulary, so no two subagents can disagree on token names or values. The only shared mutable state during phase 2 is the append-only `gaps.md`.

### Phase 3 — Screenshot regression

#### Baseline capture (before any consolidation work begins)

Playwright script captures full-page PNGs of N representative pages on `stable`:
- My eForms (root)
- Cases list, Case edit
- Templates list, Template designer
- Sites
- Workers
- Profile Settings, Application Settings
- Items Planning list (plugin)
- Backend Configuration (plugin)
- Time Planning (plugin)
- An open delete-confirmation dialog
- An open `mat-datepicker`
- An open `ng-select` dropdown
- A sorted, paginated data table
- A focused `ngx-editor` field
- A visible toastr

Each captured in light mode, then dark mode. Output: `eform-client/screenshots/baseline/<page>__<mode>.png`. Stored on a dedicated `chore/screenshot-baseline` branch (kept out of the consolidation PR).

#### Diff run (after phases 1 + 2 complete)

Same script targets the consolidation branch; outputs to `eform-client/screenshots/candidate/`. A `pixelmatch`-driven diff script writes per-page diff PNGs to `screenshots/diff/` and fails if any page's diff ratio exceeds **0.5%** (anti-aliasing tolerance).

#### Fix loop

Any failing page → inspect diff PNG → identify cause:
- Wrong token value → fix in `_eform.scss`.
- Missed hardcode → amend the file (and update the vocabulary if needed).

Re-run diff until clean.

#### Sign-off

User does a final eyeball pass on candidate screenshots once the automated diff passes. Final go/no-go is the user's.

## Branch & commit strategy

### Step 0 — preserve current state

Commit and push the current dirty state on `feature/theme-switcher-workspace`. It has the M3 plumbing, the picker UI, and the backend `ThemeVariant` flow. Do not merge into `stable`. The branch stays alive as a reference for cherry-picking the picker UI + state plumbing onto the consolidated branch at the end.

### New branches

- `feature/m3-token-consolidation` cut from `stable` on `eform-angular-frontend`.
- `chore/m3-token-consolidation` cut from `stable` on each affected plugin source repo (list determined by phase 1 audit).
- `chore/screenshot-baseline` cut from `stable` on `eform-angular-frontend`, holds only the baseline PNGs and the capture script.

### End state

- One PR on `eform-angular-frontend` (host app + global SCSS + `_eform.scss` + `_theme-mixin.scss` + skeleton `_workspace.scss`).
- N PRs on the affected plugin repos.
- Once all PRs are screenshot-clean, merge in coordinated batch (host PR last).
- Then rebase `feature/theme-switcher-workspace` onto the new `stable` (with consolidation merged) and continue workspace-theme tuning on top of a clean foundation.

## Files created / modified

### Created

- `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md` (phase 1 output)
- `eform-client/src/scss/themes/_workspace.scss` (skeleton with same keys)
- `eform-client/screenshots/` directory with baseline and capture scripts
- `gaps.md` (transient, deleted at end of phase 2)

### Rewritten

- `eform-client/src/scss/themes/_eform.scss` — exhaustive token map.
- `eform-client/src/scss/themes/_theme-mixin.scss` — full CSS-var emission and `mat.*-overrides()` set.

### Modified (mechanical replace, no value changes)

- All SCSS under `eform-client/src/scss/components/`, `eform-client/src/scss/libs/`, `eform-client/src/scss/utilities/`, `eform-client/src/scss/styles.scss`.
- All SCSS under `eform-client/src/app/**/*.scss`.
- All SCSS under each affected plugin's `eform-client/src/app/plugins/modules/<name>-pn/**/*.scss`.

## Verification

### Static checks

- `cd eform-client && npm run lint && npm run build --configuration=production` — succeeds with zero new warnings.
- `grep -r 'mat\.m2-' eform-client/src/scss/` — empty.
- After phase 2, hardcoded color/size scan returns either an empty result or only explicitly out-of-scope categories (SVG paint, animation keyframes).

### Runtime checks

- Playwright screenshot-diff against `stable` baseline passes (≤ 0.5% per page).
- Manual eyeball pass on all captured screenshots in light + dark.
- Theme-switcher (once rebased on top) still toggles `body.theme-eform` / `body.theme-workspace` correctly and the workspace theme renders with its placeholder values without breaking layout.

### Regression guard going forward

The screenshot suite stays in the repo. Any future PR touching `_eform.scss`, `_theme-mixin.scss`, or any tokenized component SCSS runs the diff in CI as a gate.

## Risks & mitigations

- **Plugin enumeration is wrong / a plugin gets missed.** Mitigation: phase 1 audit explicitly lists every plugin source repo found via `ls /home/rene/Documents/workspace/microting/eform-angular-*-plugin`, and the user reviews the list at the phase 1 gate.
- **Vocabulary churn during phase 2 (many gaps).** Mitigation: gap-resolution is a one-edit-at-a-time supervised step; each gap also points to a phase 1 audit miss to reflect on. If gap volume is high, halt phase 2 and re-open phase 1 instead of patching iteratively.
- **Screenshot diff false positives (anti-aliasing on font hinting).** Mitigation: 0.5% per-page tolerance; dedicated review of any page that triggers a near-threshold fail.
- **Long branch life across many plugin repos.** Mitigation: do plugin work last (phase 2 step), since plugins consume the host's vocabulary and host SCSS lands first. Plugin PRs can be reviewed and merged in parallel once host PR is approved.
