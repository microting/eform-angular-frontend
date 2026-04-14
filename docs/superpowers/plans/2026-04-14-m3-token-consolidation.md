# M3 Token Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract every hardcoded color, radius, size, spacing, and elevation value across `eform-angular-frontend` and all 18 plugin source repos into a single token vocabulary, mechanically replace hardcodes with `var(--…)` references, and gate the merge on a Playwright screenshot-regression diff against current `stable`.

**Architecture:** Three sequential phases — (1) audit + vocabulary, (2) parallel mechanical replace, (3) screenshot diff + fix loop. Phase 1 produces a locked vocabulary that phase 2 subagents are forbidden to extend without going through the orchestrator. Phase 3 enforces visual neutrality.

**Tech Stack:** Angular Material 20 (M3), SCSS, Playwright (MCP) for capture, `pixelmatch` for diff, `git worktree` per branch.

**Reference spec:** `docs/superpowers/specs/2026-04-14-m3-token-consolidation-design.md`

**Plugin source repo list (18 plugins, established 2026-04-14):**
- `eform-angular-appointment-plugin`
- `eform-angular-basecustomer-plugin`
- `eform-angular-chemical-plugin`
- `eform-angular-eform-dashboard-plugin`
- `eform-angular-greate-belt-plugin`
- `eform-angular-insight-dashboard-plugin`
- `eform-angular-inventory-plugin`
- `eform-angular-items-planning-plugin`
- `eform-angular-monitoring-plugin`
- `eform-angular-outer-inner-resource-plugin`
- `eform-angular-rentableitem-plugin`
- `eform-angular-sportfederation-plugin`
- `eform-angular-timeplanning-plugin`
- `eform-angular-trash-inspection-plugin`
- `eform-angular-workflow-plugin`
- `eform-angular-work-orders-plugin`
- `eform-backendconfiguration-plugin` (no `-angular-` prefix)
- `eform-kanban-plugin` (no `-angular-` prefix)

All paths under `/home/rene/Documents/workspace/microting/`.

---

## Phase 0 — Preserve current state, prepare branches

### Task 0.1: Commit the current dirty work on `feature/theme-switcher-workspace`

**Files:**
- All currently-modified files in `eform-angular-frontend` (the in-progress eform parity fixes)

- [ ] **Step 1: Inspect uncommitted state**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git status
git diff --stat
```

Expected: the eform parity SCSS edits we've been iterating on (theme tokens, dropdown, nav, buttons), plus any untracked new files.

- [ ] **Step 2: Stage and commit**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
# Stage explicitly — never `git add .`
git add eform-client/src/scss/themes/_eform.scss
git add eform-client/src/scss/themes/_theme-mixin.scss
git add eform-client/src/scss/components/_material-dropdown.scss
git add eform-client/src/scss/libs/theme.scss
git add eform-client/src/scss/styles.scss
git add eform-client/src/app/components/navigation/navigation.component.scss
# Add any other modified files surfaced by Step 1
git status  # confirm only intended files staged

git commit -m "$(cat <<'EOF'
wip: in-progress eform parity fixes pre-consolidation

Snapshot of theme/component SCSS work done while iterating against the
Workspace reference. Superseded by the consolidation branch — kept so the
picker UI and backend ThemeVariant plumbing on this branch remain
cherry-pickable.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Push**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git push origin feature/theme-switcher-workspace
```

Expected: push succeeds.

### Task 0.2: Cut the consolidation branch from `stable`

**Files:** none modified — branch operation only.

- [ ] **Step 1: Fetch and create branch**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git fetch origin
git checkout stable
git pull origin stable
git checkout -b feature/m3-token-consolidation
```

Expected: clean checkout of `stable`, new local branch created.

- [ ] **Step 2: Push the branch up empty**

```bash
git push -u origin feature/m3-token-consolidation
```

### Task 0.3: Cut the screenshot-baseline branch from `stable`

**Files:** none yet — branch only.

- [ ] **Step 1: Branch and push**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git checkout stable
git checkout -b chore/screenshot-baseline
git push -u origin chore/screenshot-baseline
```

### Task 0.4: Verify all 18 plugin source repos exist and are clean

**Files:** none — read-only inspection.

- [ ] **Step 1: For each plugin in the list above, confirm clean working tree on `stable`**

```bash
for repo in eform-angular-appointment-plugin eform-angular-basecustomer-plugin \
            eform-angular-chemical-plugin eform-angular-eform-dashboard-plugin \
            eform-angular-greate-belt-plugin eform-angular-insight-dashboard-plugin \
            eform-angular-inventory-plugin eform-angular-items-planning-plugin \
            eform-angular-monitoring-plugin eform-angular-outer-inner-resource-plugin \
            eform-angular-rentableitem-plugin eform-angular-sportfederation-plugin \
            eform-angular-timeplanning-plugin eform-angular-trash-inspection-plugin \
            eform-angular-workflow-plugin eform-angular-work-orders-plugin \
            eform-backendconfiguration-plugin eform-kanban-plugin; do
  echo "=== $repo ==="
  cd /home/rene/Documents/workspace/microting/$repo
  git status -s
  git rev-parse --abbrev-ref HEAD
done
```

Expected: each prints empty status and `stable` (or whichever is the plugin's canonical branch).

- [ ] **Step 2: If any plugin has uncommitted work, STOP and ask the user how to handle it**

Do not proceed past this step until all plugin trees are clean.

---

## Phase 1 — Build screenshot baseline

### Task 1.1: Add a Playwright capture script

**Files:**
- Create: `eform-client/screenshots/capture.mjs`
- Create: `eform-client/screenshots/pages.json`

(Work happens on `chore/screenshot-baseline` branch.)

- [ ] **Step 1: Switch to baseline branch**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git checkout chore/screenshot-baseline
mkdir -p eform-client/screenshots/baseline
mkdir -p eform-client/screenshots/candidate
mkdir -p eform-client/screenshots/diff
```

- [ ] **Step 2: Write `pages.json` defining the page list**

Create `eform-client/screenshots/pages.json`:

```json
[
  { "name": "my-eforms",            "url": "/",                                "open": null },
  { "name": "cases-list",           "url": "/cases",                           "open": null },
  { "name": "templates-list",       "url": "/searchable-list",                 "open": null },
  { "name": "sites",                "url": "/advanced/sites",                  "open": null },
  { "name": "workers",              "url": "/advanced/workers",                "open": null },
  { "name": "profile-settings",     "url": "/account-management/account-settings", "open": null },
  { "name": "application-settings", "url": "/application-settings",            "open": null },
  { "name": "items-planning",       "url": "/plugins/items-planning-pn/plannings", "open": null },
  { "name": "backend-configuration","url": "/plugins/backend-configuration-pn/properties", "open": null },
  { "name": "time-planning",        "url": "/plugins/time-planning-pn/plannings", "open": null },
  { "name": "tags-dropdown-open",   "url": "/",                                "open": "tags-dropdown" },
  { "name": "delete-confirm-dialog","url": "/cases",                           "open": "first-row-delete" }
]
```

- [ ] **Step 3: Write the capture script**

Create `eform-client/screenshots/capture.mjs`:

```javascript
// Usage: node capture.mjs <output-dir> [--mode=light|dark]
// Reads pages.json, logs in, navigates each page, captures full-page PNG.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const outDir = args[0];
const mode = (args.find(a => a.startsWith('--mode=')) || '--mode=light').split('=')[1];
if (!outDir) { console.error('output dir required'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const pages = JSON.parse(fs.readFileSync(new URL('./pages.json', import.meta.url)));

const BASE = process.env.E2E_BASE_URL || 'http://localhost:4200';
const USER = process.env.E2E_USER || 'admin@admin.com';
const PASS = process.env.E2E_PASS || 'H@ppy2Learn';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();

await page.goto(BASE + '/login');
await page.fill('input[name="userName"]', USER);
await page.fill('input[name="password"]', PASS);
await page.click('button[type="submit"]');
await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30000 });

if (mode === 'dark') {
  // Toggle dark mode through the profile settings UI.
  // Inspect actual DOM to confirm the selector before locking this in.
  await page.goto(BASE + '/account-management/account-settings');
  await page.click('mat-slide-toggle[formcontrolname="darkTheme"] button');
  await page.waitForTimeout(500);
}

for (const p of pages) {
  await page.goto(BASE + p.url);
  await page.waitForLoadState('networkidle');
  if (p.open === 'tags-dropdown') {
    await page.click('ng-select[formcontrolname="tagIds"]');
    await page.waitForTimeout(300);
  } else if (p.open === 'first-row-delete') {
    await page.click('table tbody tr:first-child button[mattooltip*="Delete"]');
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(500); // settle animations
  const file = path.join(outDir, `${p.name}__${mode}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('captured', file);
}

await browser.close();
```

- [ ] **Step 4: Verify the script syntactically**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client
node --check screenshots/capture.mjs
```

Expected: no output (success).

- [ ] **Step 5: Commit**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git add eform-client/screenshots/capture.mjs eform-client/screenshots/pages.json
git commit -m "$(cat <<'EOF'
chore(screenshots): add Playwright capture harness for theme regression

Captures full-page PNGs of representative app pages (host + 3 plugins) in
light and dark mode. Used to gate the M3 token consolidation work against
visual drift from current stable.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
git push
```

### Task 1.2: Add the diff script

**Files:**
- Create: `eform-client/screenshots/diff.mjs`
- Modify: `eform-client/package.json` (add `pixelmatch` + `pngjs` to devDependencies)

- [ ] **Step 1: Install pixelmatch + pngjs**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client
yarn add --dev pixelmatch pngjs
```

Expected: dependencies added, `yarn.lock` updated.

- [ ] **Step 2: Write the diff script**

Create `eform-client/screenshots/diff.mjs`:

```javascript
// Usage: node diff.mjs <baseline-dir> <candidate-dir> <output-dir> [--threshold=0.005]
// Compares matching PNGs pair-by-pair, writes per-page diff PNGs, exits non-zero
// if any page exceeds the per-page diff ratio threshold (default 0.5%).

import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [baselineDir, candidateDir, outDir, ...rest] = process.argv.slice(2);
const threshold = Number((rest.find(a => a.startsWith('--threshold=')) || '--threshold=0.005').split('=')[1]);

if (!baselineDir || !candidateDir || !outDir) {
  console.error('usage: diff.mjs <baseline-dir> <candidate-dir> <output-dir> [--threshold=0.005]');
  process.exit(2);
}
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(baselineDir).filter(f => f.endsWith('.png'));
let failures = 0;

for (const f of files) {
  const a = PNG.sync.read(fs.readFileSync(path.join(baselineDir, f)));
  const candidatePath = path.join(candidateDir, f);
  if (!fs.existsSync(candidatePath)) {
    console.log(`MISSING ${f}`);
    failures++;
    continue;
  }
  const b = PNG.sync.read(fs.readFileSync(candidatePath));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`SIZE-MISMATCH ${f}: baseline ${a.width}x${a.height}, candidate ${b.width}x${b.height}`);
    failures++;
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPx = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  const ratio = diffPx / (a.width * a.height);
  fs.writeFileSync(path.join(outDir, f), PNG.sync.write(diff));
  const status = ratio > threshold ? 'FAIL' : 'OK  ';
  console.log(`${status} ${f}  ratio=${(ratio * 100).toFixed(3)}%`);
  if (ratio > threshold) failures++;
}

if (failures > 0) {
  console.error(`\n${failures} page(s) failed`);
  process.exit(1);
}
console.log('\nall pages within tolerance');
```

- [ ] **Step 3: Verify syntactically**

```bash
node --check screenshots/diff.mjs
```

- [ ] **Step 4: Commit**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git add eform-client/screenshots/diff.mjs eform-client/package.json eform-client/yarn.lock
git commit -m "chore(screenshots): add pixelmatch diff script with 0.5% threshold

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

### Task 1.3: Capture baseline screenshots from `stable`

**Files:**
- Create: `eform-client/screenshots/baseline/*.png` (24 files: 12 pages × 2 modes)

- [ ] **Step 1: Confirm yarn dev server is running on `stable` SCSS**

User confirmation required: dev server must be serving `stable`'s SCSS, not the dirty `feature/theme-switcher-workspace` state. Restart yarn against the `chore/screenshot-baseline` branch (which is identical to `stable` except for the screenshots dir).

```bash
# In a separate terminal:
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client
yarn start
# Wait for "Compiled successfully"
```

- [ ] **Step 2: Run capture in light mode**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client
node screenshots/capture.mjs screenshots/baseline --mode=light
```

Expected: prints "captured screenshots/baseline/<page>__light.png" for each of the 12 pages.

- [ ] **Step 3: Run capture in dark mode**

```bash
node screenshots/capture.mjs screenshots/baseline --mode=dark
```

Expected: 12 more "captured" lines.

- [ ] **Step 4: Visually sanity-check**

```bash
ls -la eform-client/screenshots/baseline/ | wc -l
# Expected: 26 (24 PNGs + . + ..)
```

Open 2-3 PNGs manually to confirm they're not blank.

- [ ] **Step 5: Commit and push**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git add eform-client/screenshots/baseline/*.png
git commit -m "chore(screenshots): baseline capture from stable

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 2 — Vocabulary (one subagent, sequential)

### Task 2.1: Switch back to consolidation branch

- [ ] **Step 1**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git checkout feature/m3-token-consolidation
```

### Task 2.2: Dispatch the audit subagent

**Files:** none yet — subagent produces files in next task.

- [ ] **Step 1: Dispatch a `general-purpose` subagent with this prompt**

```
You are auditing SCSS for an Angular Material 3 token consolidation. Goal: produce
a complete vocabulary of every visual value used across the host app and 18 plugin
source repos.

Scopes (ripgrep all of these):
  - /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client/src/scss/**/*.scss
  - /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client/src/app/**/*.scss
  - For each of these 18 plugin source repos, the path
    <repo>/eform-client/src/app/plugins/modules/<name>-pn/**/*.scss:
      eform-angular-appointment-plugin, eform-angular-basecustomer-plugin,
      eform-angular-chemical-plugin, eform-angular-eform-dashboard-plugin,
      eform-angular-greate-belt-plugin, eform-angular-insight-dashboard-plugin,
      eform-angular-inventory-plugin, eform-angular-items-planning-plugin,
      eform-angular-monitoring-plugin, eform-angular-outer-inner-resource-plugin,
      eform-angular-rentableitem-plugin, eform-angular-sportfederation-plugin,
      eform-angular-timeplanning-plugin, eform-angular-trash-inspection-plugin,
      eform-angular-workflow-plugin, eform-angular-work-orders-plugin,
      eform-backendconfiguration-plugin, eform-kanban-plugin
  - All under /home/rene/Documents/workspace/microting/

Patterns to extract:
  - Hex colors (#RGB, #RRGGBB, #RRGGBBAA)
  - rgb(), rgba(), hsl(), hsla()
  - Hardcoded px/rem values in these properties only:
    width, height, min-height, max-height, min-width, max-width,
    border-radius, padding, padding-(top|right|bottom|left),
    margin, margin-(top|right|bottom|left), gap, row-gap, column-gap,
    font-size, line-height, letter-spacing, font-weight,
    box-shadow, border, border-(top|right|bottom|left)

Excludes (do not extract):
  - SVG fill/stroke attributes inside Angular templates
  - Values 0, auto, inherit, initial, unset, none
  - Values inside @keyframes, @media, @supports

For each unique value, record: token name (you propose), eform-light value,
eform-dark value (read existing _eform.scss for dark-mode equivalents where they
exist; otherwise mark as "TBD-dark" and we'll resolve in review), source file:line
of the FIRST occurrence, and one example call-site selector.

Output format:
  1. Write a markdown table to
     /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
     with columns: Token | Light | Dark | Source | Example.
     Group rows under H2 sections: ## Color, ## Typography, ## Shape, ## Sizing,
     ## Spacing, ## Elevation. Use H3 sub-sections inside Color (## Surface,
     ## State, ## Brand, etc.) if helpful.
  2. After the tables, add a "## Plugin coverage" section listing each plugin
     with the count of unique values found in it, so we know which plugins
     actually contribute SCSS.

Naming rules:
  - Existing token names in eform-client/src/scss/themes/_eform.scss take
    precedence — reuse them. Do not rename.
  - New tokens follow kebab-case-with-purpose: --primary, --primary-hover,
    --table-row-hover, --nav-item-height, --button-padding-h, etc.
  - Avoid numeric suffixes (--color-1) — use semantic names.

DO NOT edit any SCSS yet. DO NOT populate _eform.scss yet. ONLY produce the
vocabulary doc. Report back with the doc path and total unique-value count.
```

- [ ] **Step 2: Wait for subagent completion. Verify the vocabulary doc exists and is non-trivial**

```bash
ls -la /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
wc -l /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
```

Expected: file exists, > 200 lines.

- [ ] **Step 3: Commit the vocabulary doc**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git add docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
git commit -m "docs: M3 token vocabulary (audit output)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

### Task 2.3: Vocabulary review gate (USER)

- [ ] **Step 1: Pause and present the vocabulary doc to the user**

Ask the user to read `docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md` end-to-end. The user must:
  1. Accept or rename any token they dislike.
  2. Resolve any "TBD-dark" entries.
  3. Confirm the plugin coverage list matches expectations.

Do not proceed past this step without explicit user approval.

### Task 2.4: Populate `_eform.scss` exhaustively

**Files:**
- Modify: `eform-client/src/scss/themes/_eform.scss`

- [ ] **Step 1: Read the locked vocabulary doc and the current `_eform.scss`**

- [ ] **Step 2: Rewrite `_eform.scss` so its `colors` map and top-level keys contain every token from the vocabulary**

For each token in the doc, ensure there's a key in either the top-level map (for shape/sizing/spacing/typography), the `light` sub-map, or the `dark` sub-map. Light values come from the vocabulary; dark values come from the vocabulary's "Dark" column.

- [ ] **Step 3: Verify SCSS compiles**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client
yarn build
```

Expected: build succeeds. Any "undefined variable" or "function not found" SCSS errors must be fixed before continuing.

- [ ] **Step 4: Commit**

```bash
git add eform-client/src/scss/themes/_eform.scss
git commit -m "feat(theme): populate _eform.scss with full token vocabulary

Adds every token from the locked vocabulary doc to the eform token map.
Workspace theme + theme-mixin emission updated in subsequent commits.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

### Task 2.5: Populate `_theme-mixin.scss` to emit every token as a CSS var

**Files:**
- Modify: `eform-client/src/scss/themes/_theme-mixin.scss`

- [ ] **Step 1: For every key in the eform `light`/`dark` sub-maps, emit a `--<key>: #{map.get($mode-colors, <key>)};` line**

For every top-level non-color key (e.g. `nav-item-height`, `button-padding-h`), emit `--<key>: #{map.get($tokens, <key>)};`.

- [ ] **Step 2: For each Material component touched by the vocabulary, ensure there's a `mat.<component>-overrides()` call binding the corresponding tokens**

Example: if vocabulary defines `--button-shape`, ensure `mat.button-overrides((filled-container-shape: map.get($tokens, button-shape), ...))` is present. Refer to the existing `_theme-mixin.scss` calls as a template.

- [ ] **Step 3: Verify build**

```bash
cd eform-client && yarn build
```

Expected: success.

- [ ] **Step 4: Commit**

```bash
git add eform-client/src/scss/themes/_theme-mixin.scss
git commit -m "feat(theme): emit every vocabulary token as a CSS custom property

Every key in the eform token map now appears as --<key> in :root,
making downstream component SCSS able to consume them via var(--key).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

### Task 2.6: Mirror the key set into `_workspace.scss` skeleton

**Files:**
- Modify: `eform-client/src/scss/themes/_workspace.scss`

- [ ] **Step 1: Open `_workspace.scss` and ensure it contains the exact same keys as `_eform.scss`**

Values can be placeholders (e.g. duplicate the eform values) — they will be re-tuned in a follow-up. The point is: no key may be missing, or `apply-theme($workspace-tokens, $mode)` will emit empty CSS vars and break the workspace theme.

- [ ] **Step 2: Verify build**

```bash
cd eform-client && yarn build
```

- [ ] **Step 3: Commit**

```bash
git add eform-client/src/scss/themes/_workspace.scss
git commit -m "feat(theme): mirror full key set into workspace token map

Workspace map now matches eform key-for-key (placeholder values).
Re-tuning the workspace look is a follow-up commit.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 3 — Mechanical replace

### Task 3.1: Initialize the gaps log

**Files:**
- Create: `gaps.md` (project root, transient)

- [ ] **Step 1: Create empty gaps log**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
cat > gaps.md <<'EOF'
# Gaps log — phase 2 mechanical replace

Append-only. One row per hardcoded value with no matching token.

| Subagent | File:line | Value | Surrounding context |
|---|---|---|---|
EOF
git add gaps.md
git commit -m "chore: add transient gaps log for phase 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

### Task 3.2: Dispatch host-global SCSS subagent

**Files (target):**
- Modify: `eform-client/src/scss/components/**/*.scss`
- Modify: `eform-client/src/scss/libs/**/*.scss` (excluding `themes/`)
- Modify: `eform-client/src/scss/utilities/**/*.scss`
- Modify: `eform-client/src/scss/styles.scss`

- [ ] **Step 1: Dispatch a `general-purpose` subagent with this prompt (verbatim, no paraphrasing)**

```
You are doing mechanical token replacement. Read the locked vocabulary at
/home/rene/Documents/workspace/microting/reference/eform-angular-frontend/docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md

Your scope is HOST GLOBAL ONLY:
  - eform-client/src/scss/components/**/*.scss
  - eform-client/src/scss/libs/**/*.scss (EXCLUDING the themes/ subdirectory)
  - eform-client/src/scss/utilities/**/*.scss
  - eform-client/src/scss/styles.scss

For every hardcoded value in your scope that maps to a vocabulary token, replace
it with var(--<token-name>, <original-value>) so the fallback preserves the old
value if the var is undefined.

Examples:
  border-radius: 4px;          ->  border-radius: var(--dropdown-panel-radius, 4px);
  background: #289694;         ->  background: var(--primary, #289694);
  color: #FFFFFF;              ->  color: var(--on-primary, #FFFFFF);
  height: 48px; (in a button)  ->  height: var(--primary-button-height, 48px);

Forbidden actions:
  - Inventing new tokens (if a value has no matching token, append a row to
    /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/gaps.md
    and skip that line).
  - Tweaking any value.
  - Removing or adding !important.
  - Reordering selectors or rules.
  - Touching themes/_eform.scss, themes/_workspace.scss, themes/_theme-mixin.scss.
  - Touching anything outside your scope (no app/, no plugins).

After every file edit, verify yarn still builds (cd eform-client && yarn build).
If a build fails, revert your last edit and append the failing case to gaps.md.

Report at the end:
  - List of files modified
  - Count of substitutions made
  - Number of gaps appended

Do NOT commit. The orchestrator will commit after review.
```

- [ ] **Step 2: After subagent completes, review `git diff --stat` and `gaps.md`**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git diff --stat
cat gaps.md
yarn --cwd eform-client build
```

Expected: build passes, diff is mechanical (no value changes).

- [ ] **Step 3: Spot-check 3 random files in the diff for sanity**

For each of 3 files, confirm the only change is `<value>` → `var(--token, <value>)` — no logic, no rule reordering.

- [ ] **Step 4: Commit**

```bash
git add eform-client/src/scss/
git commit -m "refactor(scss): tokenize host-global SCSS

Mechanical replace of hardcoded color/size/spacing/radius values in
scss/components, scss/libs (excluding themes), scss/utilities, and
styles.scss with var(--token, fallback) references against the locked
vocabulary. No visual or behavioral changes intended.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.3: Dispatch host-components subagent

**Files (target):**
- Modify: `eform-client/src/app/**/*.scss` excluding `src/app/plugins/modules/**`

- [ ] **Step 1: Dispatch a `general-purpose` subagent with the same prompt as Task 3.2 BUT scope replaced with**

```
Your scope is HOST COMPONENTS ONLY:
  - eform-client/src/app/**/*.scss
  EXCLUDING eform-client/src/app/plugins/modules/**
```

All other rules (forbidden actions, gaps log, build verify) identical to Task 3.2.

- [ ] **Step 2: Review diff + gaps + build, same as Task 3.2 Step 2**

- [ ] **Step 3: Spot-check 3 random files**

- [ ] **Step 4: Commit**

```bash
git add eform-client/src/app/
git commit -m "refactor(scss): tokenize host component SCSS

Mechanical replace across eform-client/src/app/**/*.scss (excluding
plugin modules) against the locked vocabulary. No visual changes
intended.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.4: Resolve any gaps before plugin work

- [ ] **Step 1: Read `gaps.md`**

If empty, skip to Task 3.5.

- [ ] **Step 2: For each gap, decide:**

  - **Add a token:** if the value belongs to the visual identity, add it to `_eform.scss`, `_workspace.scss` (placeholder), `_theme-mixin.scss` (CSS var emission), and the vocabulary doc. Then re-dispatch the relevant subagent on just that file(s) to replace the gap.
  - **Mark as out-of-scope:** if the value is genuinely not theme-related (e.g. an offset for a specific overlay positioning), document the rationale next to the gap row in `gaps.md` (move it under a `## Out of scope` section) and leave the value hardcoded.

- [ ] **Step 3: Commit each token-add as its own commit**

```bash
git add eform-client/src/scss/themes/_eform.scss \
        eform-client/src/scss/themes/_workspace.scss \
        eform-client/src/scss/themes/_theme-mixin.scss \
        docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
git commit -m "feat(theme): add <token-name> to vocabulary (gap resolution)

<rationale>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 4: Re-run subagent on the file containing the gap**

Dispatch a focused subagent with the same forbidden-actions list, scope limited to the single file, plus an instruction: "the previous gap at <file>:<line> for value <value> is now resolved by token --<token-name>. Replace it now."

- [ ] **Step 5: Commit and push**

```bash
git add <file>
git commit -m "refactor(scss): resolve gap for <token-name>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

### Task 3.5: Dispatch plugin subagents in parallel

**Files (target):**
- Modify: `eform-client/src/app/plugins/modules/<name>-pn/**/*.scss` for each plugin's host-app copy (since edits happen in dev mode in the host app).

This requires dev mode. Confirm with the user that they are in full dev mode (per CLAUDE.md session-start gate). If not, abort and switch dev mode first.

- [ ] **Step 1: Confirm dev mode**

Ask the user: "Are you in full dev mode (fullblownsetup.py)? Plugin SCSS edits happen in the host app and require local project references."

Do not proceed without confirmation.

- [ ] **Step 2: Dispatch ONE subagent per plugin, in parallel (single message, multiple Agent tool calls)**

For each plugin in the 18-plugin list, dispatch a subagent with this prompt template (substitute `<plugin-name>`):

```
You are doing mechanical token replacement for the <plugin-name> plugin's SCSS.

Vocabulary: /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md

Scope (single plugin):
  /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client/src/app/plugins/modules/<plugin-name>-pn/**/*.scss

Same rules as the host subagents:
  - Replace hardcoded values with var(--token, fallback).
  - No new tokens — append to /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/gaps.md if blocked.
  - No value tweaks, no reordering, no removing !important.
  - Verify build (cd eform-client && yarn build) after each file.

If the plugin has NO .scss files in its module directory, report "no files in scope"
and exit cleanly.

Report: files modified, substitutions made, gaps appended.
Do NOT commit.
```

NOTE: the plugin module directory naming may not be `<plugin-name>-pn` exactly — confirm the actual directory by listing `eform-client/src/app/plugins/modules/` first and pass each subagent its actual directory name.

- [ ] **Step 3: Wait for all subagents to complete. Aggregate diffs and gaps**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git diff --stat eform-client/src/app/plugins/
cat gaps.md  # any new gaps from this round?
yarn --cwd eform-client build
```

If new gaps appeared, return to Task 3.4 to resolve them, then re-dispatch the affected plugin subagents.

- [ ] **Step 4: Commit the plugin SCSS edits in the host app (one commit per plugin) — these will be back-synced shortly**

```bash
# For each plugin:
git add eform-client/src/app/plugins/modules/<plugin-name>-pn/
git commit -m "refactor(scss): tokenize <plugin-name> plugin SCSS

Mechanical replace against the locked vocabulary. Will be back-synced
to the plugin source repo via devgetchanges.sh.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 5: Push host branch**

```bash
git push
```

### Task 3.6: Back-sync plugin edits to source repos

For each plugin that had SCSS edits in Task 3.5:

- [ ] **Step 1: Switch to the plugin source repo and create the consolidation branch**

```bash
cd /home/rene/Documents/workspace/microting/<plugin-repo>
git checkout stable
git pull origin stable
git checkout -b chore/m3-token-consolidation
```

- [ ] **Step 2: Run `devgetchanges.sh`**

```bash
./devgetchanges.sh
```

Expected: SCSS files updated from the host app copy.

- [ ] **Step 3: Reset build artifacts (per CLAUDE.md)**

```bash
git checkout -- '*.csproj' '*.conf.ts' '*.xlsx' '*.docx' 2>/dev/null || true
```

- [ ] **Step 4: Verify only intended files changed**

```bash
git status
git diff --stat
```

Expected: only `.scss` files under `eform-client/src/app/plugins/modules/<plugin>-pn/` (or equivalent) modified.

- [ ] **Step 5: Stage explicitly and commit**

```bash
# Stage only the .scss files surfaced by Step 4 — list them by name, no `git add .`
git add <each .scss file by name>
git commit -m "refactor(scss): tokenize plugin SCSS against host vocabulary

Replaces hardcoded color/size/spacing/radius values with var(--token,
fallback) references. Vocabulary lives in eform-angular-frontend at
docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push -u origin chore/m3-token-consolidation
```

- [ ] **Step 6: Repeat Steps 1-5 for every plugin in the 18-plugin list that had edits**

### Task 3.7: Clean up the gaps log

- [ ] **Step 1: Confirm `gaps.md` is empty or contains only documented out-of-scope entries**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
cat gaps.md
```

- [ ] **Step 2: If empty, delete; if has out-of-scope entries, move into the vocabulary doc as an "Out of scope values" appendix**

- [ ] **Step 3: Commit**

```bash
git rm gaps.md  # or git add gaps.md if moved into vocabulary doc
git add docs/superpowers/specs/2026-04-14-eform-token-vocabulary.md
git commit -m "chore: close phase 2 gaps log

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

---

## Phase 4 — Screenshot regression

### Task 4.1: Capture candidate screenshots from consolidation branch

**Files:**
- Create: `eform-client/screenshots/candidate/*.png` (24 files)

- [ ] **Step 1: Restart yarn dev server against `feature/m3-token-consolidation`**

```bash
# In separate terminal:
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client
# Kill any running yarn start, then:
yarn start
# Wait for "Compiled successfully"
```

- [ ] **Step 2: Run capture in light mode**

```bash
node screenshots/capture.mjs screenshots/candidate --mode=light
```

- [ ] **Step 3: Run capture in dark mode**

```bash
node screenshots/capture.mjs screenshots/candidate --mode=dark
```

- [ ] **Step 4: Verify file count**

```bash
ls eform-client/screenshots/candidate/*.png | wc -l
# Expected: 24
```

### Task 4.2: Run the diff

- [ ] **Step 1: Execute diff script**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend/eform-client
node screenshots/diff.mjs screenshots/baseline screenshots/candidate screenshots/diff
echo "exit: $?"
```

Expected on success: each page prints "OK ratio=0.xxx%", final line "all pages within tolerance", exit 0.

Expected on failure: one or more "FAIL" lines, exit 1.

### Task 4.3: Fix loop

- [ ] **Step 1: For each FAIL line, open the diff PNG**

```bash
xdg-open eform-client/screenshots/diff/<failing-page>.png
```

- [ ] **Step 2: Identify the visual diff cause**

  - **Wrong token value:** the vocabulary captured the wrong color/size for the eform theme. Fix in `_eform.scss`. Re-run capture + diff.
  - **Missed hardcode:** a SCSS file slipped through phase 2. Find it (`grep -rn "<value>" eform-client/src/`), tokenize manually, commit, re-run.
  - **Anti-aliasing noise above threshold:** if a page is failing at 0.6-0.8% with no visible difference to the eye, raise the threshold for that page only by adding it to a per-page override map in `diff.mjs` (don't bump the global threshold).

- [ ] **Step 3: After every fix, commit**

```bash
git add <files>
git commit -m "fix(theme): <what was wrong> on <page>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 4: Re-run Task 4.1 (recapture) and Task 4.2 (diff) until clean**

### Task 4.4: User sign-off

- [ ] **Step 1: Present candidate vs baseline side-by-side to the user**

For 5-6 representative pages, open baseline and candidate PNGs side-by-side. Ask the user to confirm visual equivalence.

- [ ] **Step 2: Wait for user explicit "approved" / "looks identical"**

Do not proceed past this step without it.

---

## Phase 5 — PR coordination & rebase

### Task 5.1: Open PRs

- [ ] **Step 1: Open the host PR**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
gh pr create --base stable --title "M3 token consolidation" --body "$(cat <<'EOF'
## Summary
- Extracts every hardcoded color, size, radius, spacing, and elevation value across host SCSS into the eform token vocabulary.
- Replaces all hardcodes with var(--token, fallback) references.
- Workspace token map mirrored key-for-key (placeholder values for follow-up tuning).
- Adds Playwright screenshot capture + pixelmatch diff harness as a permanent regression guard.

## Verification
- Screenshot diff vs stable: all pages within 0.5% per-page tolerance.
- yarn build, lint, and dotnet build all pass.
- No mat.m2-* references remain in scss/.

## Test plan
- [x] Light + dark mode capture matches stable on 12 pages
- [x] No visible regressions on user-eyeball pass
- [ ] Reviewer eyeballs 3-5 candidate screenshots in screenshots/diff/

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: For each plugin source repo with a `chore/m3-token-consolidation` branch, open a PR**

```bash
# Repeat for each affected plugin:
cd /home/rene/Documents/workspace/microting/<plugin-repo>
gh pr create --base stable --title "M3 token consolidation" --body "$(cat <<'EOF'
## Summary
- Replaces hardcoded SCSS values in this plugin with var(--token, fallback) references against the host eform-angular-frontend vocabulary.
- No visual or behavioral changes.

## Test plan
- [x] Build passes
- [ ] Visual check via host app screenshot diff (covered in eform-angular-frontend PR)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Task 5.2: Coordinate merge

- [ ] **Step 1: Wait for review approval on every PR**

- [ ] **Step 2: Merge plugin PRs first**

For each plugin PR, merge via `gh pr merge --merge`. Plugins consume the host vocabulary — they're safe to merge once the host vocabulary is approved.

- [ ] **Step 3: Merge host PR last**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
gh pr merge feature/m3-token-consolidation --merge
```

### Task 5.3: Rebase the picker UI branch onto consolidated stable

- [ ] **Step 1: Pull updated stable**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git checkout stable
git pull origin stable
```

- [ ] **Step 2: Rebase the picker branch**

```bash
git checkout feature/theme-switcher-workspace
git rebase stable
```

Expected: conflicts in `_eform.scss`, `_theme-mixin.scss`, `_workspace.scss`, possibly `navigation.component.scss`, etc. Resolve each by KEEPING the consolidated stable version, then re-apply only the picker UI + state plumbing changes.

- [ ] **Step 3: Verify build and push**

```bash
yarn --cwd eform-client build
git push --force-with-lease origin feature/theme-switcher-workspace
```

### Task 5.4: Tag the consolidation point

- [ ] **Step 1: Tag stable**

```bash
cd /home/rene/Documents/workspace/microting/reference/eform-angular-frontend
git checkout stable
git pull
git tag -a m3-consolidation-complete -m "M3 token consolidation merged"
git push origin m3-consolidation-complete
```

This is the named "known-good" point that future theme work (workspace tuning, additional themes) builds on.
