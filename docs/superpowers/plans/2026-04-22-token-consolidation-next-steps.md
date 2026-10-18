# Token Consolidation — Next Steps (Phase 2 continued)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the vocabulary doc, populate theme SCSS files with the full token set, and prepare for the mechanical replace phase.

**Current state:** On branch `feature/m3-token-consolidation`. Vocabulary doc committed at `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md`. Screenshot baseline captured on `chore/screenshot-baseline`.

---

## Task 1: Deduplicate overlapping tokens in vocabulary doc

**Files:**
- Modify: `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md`

- [ ] **Step 1: Merge `--text-error` and `--status-error-text`**
  Keep `--text-error` (#DB0D0D). Remove `--status-error-text` row.

- [ ] **Step 2: Replace `--status-inactive-bg` with existing `--error`**
  `--status-inactive-bg` (#f44336) duplicates `--error`. Remove the row, note to use `--error` instead.

- [ ] **Step 3: Merge `--status-active-bg` and `--status-success-icon` into `--status-success`**
  Both are #4caf50. Single token `--status-success`.

- [ ] **Step 4: Merge `--surface-error-light`, `--status-danger-low`, `--surface-red-light-row`**
  All #f8d7da. Single token `--surface-danger-light`.

- [ ] **Step 5: Consolidate link color variants**
  Keep `--link` (existing, #289694). Merge `--text-link`, `--text-link-alt`, `--text-subheader-link` into `--link`. Keep `--text-calendar-accent` only if its value differs from `--link`.

- [ ] **Step 6: Commit**
  ```bash
  git add docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
  git commit -m "docs: deduplicate overlapping tokens in vocabulary

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  ```

## Task 2: Resolve TBD-dark entries

**Files:**
- Modify: `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md`

- [ ] **Step 1: Read existing dark palette from `_eform.scss`**
  The existing dark palette (in `_eform.scss` `dark:` map) provides the pattern: lighter/desaturated versions of light colors, inverted surfaces, muted borders.

- [ ] **Step 2: Batch-assign dark values for all ~50 TBD-dark tokens**
  Rules:
  - Brand/primary colors: use the existing dark primary (#4FCAC8) and its derivatives
  - Surface colors (light backgrounds): invert to dark equivalents (#2D2F31 for card, #202122 for bg)
  - Text colors: invert (dark text → light text, light text → dark text)
  - Border colors: use #37383A (existing dark border)
  - Status colors: brighten slightly for dark backgrounds (e.g. #f44336 → #FF8282, matching existing error pattern)
  - Sizing/spacing/radius: same value for both modes

- [ ] **Step 3: Mark all TBD-dark entries as resolved in the doc**

- [ ] **Step 4: Commit**
  ```bash
  git add docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
  git commit -m "docs: resolve all TBD-dark entries in token vocabulary

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  ```

## Task 3: Move plugin-specific tokens to a separate tier

**Files:**
- Modify: `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md`

- [ ] **Step 1: Identify plugin-specific tokens**
  Tokens prefixed with `--calendar-`, `--kanban-`, `--tracker-`, or any token used in only one plugin and not in the host app.

- [ ] **Step 2: Move them to a new `## Plugin-Specific Tokens` section**
  These stay in the vocabulary for reference but are NOT added to the global `_eform.scss`. They remain as hardcoded values in their plugin SCSS files (or get their own plugin-level token file in a follow-up).

- [ ] **Step 3: Commit**
  ```bash
  git add docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
  git commit -m "docs: separate plugin-specific tokens in vocabulary

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  ```

## Task 4: Add missed hardcoded values

**Files:**
- Modify: `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md`

- [ ] **Step 1: Add 4 missed `#fff` values from `_material-dropdown.scss`**
  Lines 193, 395, 466, 481. Map to `--bg` or `--surface-base` (whichever fits semantically — dropdown panel bg should be `--card`).

- [ ] **Step 2: Spot-check 3 more component SCSS files for missed values**
  Check: `scss/libs/theme.scss`, `scss/components/_table.scss` (or similar), one plugin SCSS. Add any found.

- [ ] **Step 3: Commit**
  ```bash
  git add docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
  git commit -m "docs: add missed hardcoded values to vocabulary

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  ```

## Task 5: Populate `_eform.scss` with full vocabulary

**Files:**
- Modify: `eform-client/src/scss/themes/_eform.scss`

- [ ] **Step 1: Read the finalized vocabulary doc**

- [ ] **Step 2: Add all global tokens to the `$eform-tokens` map**
  - Top-level keys for shape/sizing/spacing/typography (mode-independent)
  - `light:` sub-map for all light-mode color tokens
  - `dark:` sub-map for all dark-mode color tokens
  - Preserve all existing tokens — only add, never rename or remove

- [ ] **Step 3: Verify build**
  ```bash
  cd eform-client && yarn build
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add eform-client/src/scss/themes/_eform.scss
  git commit -m "feat(theme): populate _eform.scss with full token vocabulary

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  ```

## Task 6: Expand `_theme-mixin.scss` to emit all tokens

**Files:**
- Modify: `eform-client/src/scss/themes/_theme-mixin.scss`

- [ ] **Step 1: Add CSS custom property emission for every new token**
  For each key in the `colors` sub-maps: `--<key>: #{map.get($mode-colors, <key>)};`
  For each top-level key (shape/sizing/spacing): `--<key>: #{map.get($tokens, <key>)};`

- [ ] **Step 2: Add any new `mat.*-overrides()` calls**
  If the vocabulary introduced new shape tokens that Material components should consume (e.g. menu radius, expansion-panel radius), add the corresponding `mat.<component>-overrides()` call.

- [ ] **Step 3: Verify build**
  ```bash
  cd eform-client && yarn build
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add eform-client/src/scss/themes/_theme-mixin.scss
  git commit -m "feat(theme): emit all vocabulary tokens as CSS custom properties

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  ```

## Task 7: Mirror key set into `_workspace.scss`

**Files:**
- Modify: `eform-client/src/scss/themes/_workspace.scss`

- [ ] **Step 1: Ensure `_workspace.scss` contains every key from `_eform.scss`**
  Copy eform values as placeholders. No key may be missing or workspace theme breaks.

- [ ] **Step 2: Verify build**
  ```bash
  cd eform-client && yarn build
  ```

- [ ] **Step 3: Commit and push**
  ```bash
  git add eform-client/src/scss/themes/_workspace.scss
  git commit -m "feat(theme): mirror full key set into workspace token map

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  git push
  ```

---

## After these tasks

Proceed to **Phase 3 — Mechanical Replace** (Tasks 3.1–3.7 in the original plan at `docs/superpowers/plans/2026-04-14-m3-token-consolidation.md`). That phase dispatches parallel subagents to replace hardcoded values with `var(--token, fallback)` across host SCSS, host component SCSS, and all 18 plugin repos.
