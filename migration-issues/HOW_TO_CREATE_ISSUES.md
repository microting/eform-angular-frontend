# How to Create GitHub Sub-Issues for Migration

This guide explains how to create GitHub issues from the sub-issue templates in this directory.

## Quick Start

For each of the 11 sub-issues, follow these steps:

### Step 1: Open the Template
Navigate to the appropriate markdown file:
- `01-device-users.md`
- `02-password-settings.md`
- `03-user-administration.md`
- `04-navigation-menu.md`
- `05-folders.md`
- `06-application-settings.md`
- `07-searchable-lists.md`
- `08-selectable-lists.md`
- `09-workers.md`
- `10-profile-settings.md`
- `11-eform-visual-editor-create.md`

### Step 2: Copy the Content
Open the file and copy its entire content (the markdown text).

### Step 3: Create GitHub Issue
1. Go to https://github.com/microting/eform-angular-frontend/issues/new
2. Paste the copied content into the issue description
3. Set the title:
   - For issue 01: "Migrate Device Users Tests to Cypress"
   - For issue 02: "Migrate Password Settings Tests to Cypress"
   - etc. (use the title from each file)

### Step 4: Add Labels
Add appropriate labels to categorize the issue:
- `testing` - All issues
- `cypress` - All issues
- `e2e` - All issues
- `migration` - All issues
- `high-priority` - Issues 01, 02, 03, 11
- `medium-priority` - Issues 04-10

### Step 5: Add to Project (Optional)
If you have a project board for the migration:
1. Add the issue to the project
2. Set status to "To Do" or "Backlog"

### Step 6: Assign (Optional)
- Assign to yourself or the team member who will work on it
- Or leave unassigned if you want to let people self-assign

### Step 7: Link to Parent Issue (Optional)
If there's a parent/epic issue for the overall migration:
- Reference it in the issue description
- Use "Part of #XXX" at the top of the description

## Example: Creating Issue #01

1. Open `01-device-users.md`
2. Copy all content
3. Go to GitHub Issues → New Issue
4. Paste content
5. Title: "Migrate Device Users Tests to Cypress"
6. Labels: `testing`, `cypress`, `e2e`, `migration`, `high-priority`
7. (Optional) Assign to developer
8. Create issue

## Bulk Creation Script (Optional)

If you want to create all issues programmatically, you can use the GitHub CLI:

```bash
# Install GitHub CLI if needed
# https://cli.github.com/

# For each sub-issue
gh issue create \
  --title "Migrate Device Users Tests to Cypress" \
  --body-file migration-issues/01-device-users.md \
  --label testing,cypress,e2e,migration,high-priority

gh issue create \
  --title "Migrate Password Settings Tests to Cypress" \
  --body-file migration-issues/02-password-settings.md \
  --label testing,cypress,e2e,migration,high-priority

# ... repeat for all 11 issues
```

### Full Bulk Script

Save this as `create-all-issues.sh`:

```bash
#!/bin/bash

# Ensure you're in the repository root
cd "$(dirname "$0")/.."

# Issue 01
gh issue create \
  --title "Migrate Device Users Tests to Cypress" \
  --body-file migration-issues/01-device-users.md \
  --label testing,cypress,e2e,migration,high-priority

# Issue 02
gh issue create \
  --title "Migrate Password Settings Tests to Cypress" \
  --body-file migration-issues/02-password-settings.md \
  --label testing,cypress,e2e,migration,high-priority

# Issue 03
gh issue create \
  --title "Migrate User Administration Tests to Cypress" \
  --body-file migration-issues/03-user-administration.md \
  --label testing,cypress,e2e,migration,high-priority

# Issue 04
gh issue create \
  --title "Migrate Navigation Menu Tests to Cypress" \
  --body-file migration-issues/04-navigation-menu.md \
  --label testing,cypress,e2e,migration,medium-priority

# Issue 05
gh issue create \
  --title "Migrate Folders Tests to Cypress" \
  --body-file migration-issues/05-folders.md \
  --label testing,cypress,e2e,migration,medium-priority

# Issue 06
gh issue create \
  --title "Migrate Application Settings Tests to Cypress" \
  --body-file migration-issues/06-application-settings.md \
  --label testing,cypress,e2e,migration,medium-priority

# Issue 07
gh issue create \
  --title "Migrate Searchable Lists Tests to Cypress" \
  --body-file migration-issues/07-searchable-lists.md \
  --label testing,cypress,e2e,migration,medium-priority

# Issue 08
gh issue create \
  --title "Migrate Selectable Lists Tests to Cypress" \
  --body-file migration-issues/08-selectable-lists.md \
  --label testing,cypress,e2e,migration,medium-priority

# Issue 09
gh issue create \
  --title "Migrate Workers Tests to Cypress" \
  --body-file migration-issues/09-workers.md \
  --label testing,cypress,e2e,migration,medium-priority

# Issue 10
gh issue create \
  --title "Migrate Profile Settings Tests to Cypress" \
  --body-file migration-issues/10-profile-settings.md \
  --label testing,cypress,e2e,migration,medium-priority

# Issue 11
gh issue create \
  --title "Migrate eForm Visual Editor Create Tests to Cypress" \
  --body-file migration-issues/11-eform-visual-editor-create.md \
  --label testing,cypress,e2e,migration,high-priority

echo "All 11 migration issues created successfully!"
```

Make it executable:
```bash
chmod +x create-all-issues.sh
```

Run it:
```bash
./create-all-issues.sh
```

## After Creating Issues

1. **Review Issues**: Check that all issues were created correctly
2. **Prioritize**: Ensure high-priority issues are addressed first
3. **Link Issues**: If using a project board, link issues appropriately
4. **Notify Team**: Let team members know issues are ready to be worked on
5. **Track Progress**: Update `WDIO_TO_CYPRESS_MIGRATION.md` as issues are completed

## Tips

- **Don't create all at once**: Consider creating high-priority issues first, then medium-priority as work progresses
- **Add milestones**: Create a milestone for "E2E Test Migration" and add all issues to it
- **Use templates**: If you have issue templates in `.github/ISSUE_TEMPLATE/`, you can adapt these sub-issues to fit that format
- **Include context**: Add a link to `WDIO_TO_CYPRESS_MIGRATION.md` in each issue for broader context

## Questions?

If you have questions about creating these issues, refer to:
- [GitHub Issues Documentation](https://docs.github.com/en/issues)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
