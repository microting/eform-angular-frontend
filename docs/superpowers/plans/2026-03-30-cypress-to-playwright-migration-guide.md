# Cypress-to-Playwright Migration Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable `CYPRESS_TO_PLAYWRIGHT_MIGRATION.md` guide at the repo root, based on the design spec at `docs/superpowers/specs/2026-03-30-cypress-to-playwright-migration-guide-design.md`.

**Architecture:** Single markdown file, written in one task. Content comes directly from the design spec — the spec IS the content, just needs reformatting from "design spec" framing to "practitioner guide" framing (remove "Section Details" wrappers, add intro paragraph, clean up headings).

**Tech Stack:** Markdown

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `CYPRESS_TO_PLAYWRIGHT_MIGRATION.md` | The migration guide — all content lives here |

---

### Task 1: Write the migration guide

**Files:**
- Create: `CYPRESS_TO_PLAYWRIGHT_MIGRATION.md`
- Reference: `docs/superpowers/specs/2026-03-30-cypress-to-playwright-migration-guide-design.md` (design spec — source of all content)

- [ ] **Step 1: Create `CYPRESS_TO_PLAYWRIGHT_MIGRATION.md`**

Write the file at the repo root. The content is a reformatted version of the design spec with these changes:

1. **Title**: `# Cypress to Playwright Migration Guide`
2. **Intro**: Replace the spec's Purpose/Audience/Deliverable header with a short paragraph: what this guide is, who it's for, that it's based on the eform-angular-frontend migration
3. **Table of Contents**: Add a linked TOC for all 9 sections
4. **Section headings**: Promote from `### N. Title` to `## N. Title`
5. **Pitfall catalog**: Each pitfall keeps its template (Symptom/Cause/Fix/Before/After) exactly as written in the spec
6. **Checklist**: Keep as-is — the checkbox format is already correct
7. **Remove**: The "Document Structure" overview section (redundant with the TOC), and all "Content:" prefixes from section descriptions

The full content of each section comes verbatim from the spec sections 1-9. Do not summarize or abbreviate — copy the full code examples, tables, and explanations.

- [ ] **Step 2: Verify the file reads correctly**

Run: `head -30 CYPRESS_TO_PLAYWRIGHT_MIGRATION.md`
Expected: Title, intro paragraph, start of table of contents.

Run: `grep -c '####' CYPRESS_TO_PLAYWRIGHT_MIGRATION.md`
Expected: 20 (one per pitfall)

Run: `grep -c '\- \[ \]' CYPRESS_TO_PLAYWRIGHT_MIGRATION.md`
Expected: ~25-30 (checklist items)

- [ ] **Step 3: Commit**

```bash
git add CYPRESS_TO_PLAYWRIGHT_MIGRATION.md
git commit -m "Add Cypress-to-Playwright migration guide

Comprehensive practitioner's guide covering setup, structural differences,
selector migration, timing, assertions, page objects, CI/CD, and a full
catalog of 20 pitfalls with before/after code examples.

Based on lessons from the eform-angular-frontend migration (38 specs,
10 CI matrix jobs).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Update existing migration tracking doc

**Files:**
- Modify: `WDIO_TO_CYPRESS_MIGRATION.md` (add a "Next Step" section pointing to the new guide)

- [ ] **Step 1: Add reference to Playwright guide**

Append to the end of `WDIO_TO_CYPRESS_MIGRATION.md`, before the final `## References` section:

```markdown
## Next Step: Cypress to Playwright

The Cypress tests have been migrated to Playwright. See [CYPRESS_TO_PLAYWRIGHT_MIGRATION.md](CYPRESS_TO_PLAYWRIGHT_MIGRATION.md) for the complete migration guide, including setup, patterns, and a catalog of 20 pitfalls with solutions.
```

- [ ] **Step 2: Verify the link**

Run: `grep -A2 'Next Step' WDIO_TO_CYPRESS_MIGRATION.md`
Expected: The section with the link to the new guide.

- [ ] **Step 3: Commit**

```bash
git add WDIO_TO_CYPRESS_MIGRATION.md
git commit -m "Add reference to Playwright migration guide in WDIO tracking doc

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
