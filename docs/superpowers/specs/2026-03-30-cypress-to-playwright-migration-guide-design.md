# Cypress to Playwright Migration Guide — Design Spec

## Purpose

A reusable reference for the Microting team when migrating Cypress e2e tests to Playwright across any of the ~135 repositories. Based on hard-won lessons from the eform-angular-frontend migration (38 specs, 10 CI matrix jobs, all green).

## Audience

Any Microting developer migrating Cypress tests to Playwright, in any repository.

## Deliverable

A single file: `CYPRESS_TO_PLAYWRIGHT_MIGRATION.md` at the repository root, alongside the existing `WDIO_TO_CYPRESS_MIGRATION.md`.

---

## Document Structure

The guide follows a practitioner's workflow — read top to bottom while migrating. Each section includes every pitfall we encountered, embedded in context with before/after code examples.

### Sections

1. **Prerequisites & Setup** — Config, dependencies, project structure
2. **Structural Differences** — Mental model shift from Cypress to Playwright
3. **Selector Migration** — Every selector pattern, with before/after
4. **Timing & Waiting** — Replacing Cypress auto-retry with Playwright waits
5. **Assertions** — Cypress `should()` vs Playwright `expect()` patterns
6. **Page Object Migration** — Converting page objects to Playwright classes
7. **CI/CD Integration** — GitHub Actions, matrix jobs, retry strategies
8. **Full Pitfall Catalog** — All ~20 issues in a consistent template
9. **Checklist** — Pre-migration, during, and post-migration verification

---

## Section Details

### 1. Prerequisites & Setup

Content:
- Install `@playwright/test` and browser binaries (`npx playwright install chromium`)
- `playwright.config.ts` structure with recommended settings:
  - `baseURL`, `retries: process.env.CI ? 1 : 0`, `timeout: 120_000`
  - `video: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, `trace: 'retain-on-failure'`
  - `workers: 1` for serial test suites
- Project directory layout:
  - `playwright/e2e/Tests/{a-j}/` for specs (matching CI matrix groups)
  - `playwright/e2e/Page objects/` for page objects
  - `playwright/e2e/helper-functions.ts` for shared utilities
- Running tests: `npx playwright test`, `--project=chromium`, `--grep`, `--headed`

### 2. Structural Differences

Core mental model shifts:

| Cypress | Playwright |
|---------|-----------|
| Commands auto-chain, auto-retry | Explicit `async/await` on every call |
| Implicit subject (`cy.get().click()`) | `Locator` objects (`page.locator().click()`) |
| `beforeEach` fresh login per test | `test.describe.serial` + `test.beforeAll` shares page across suite |
| `cy.intercept().as(); cy.wait()` | `page.waitForResponse()` or `page.route()` |
| Single-element by default | **Strict mode**: locators matching multiple elements throw |
| Sync-looking chainable API | True async — every interaction is `await`ed |

Key difference to emphasize: Playwright strict mode. If a locator resolves to multiple elements, it throws immediately. This catches real bugs but requires more precise selectors or explicit `.first()` / `.nth()`.

### 3. Selector Migration

Every pattern encountered, with before/after code:

1. **Basic selectors**: `cy.get('#id')` / `cy.get('.class')` → `page.locator('#id')` / `page.locator('.class')`

2. **Text content**: `cy.contains('text')` → `page.locator('text=...')` or `.filter({ hasText: '...' })`

3. **ng-select dropdowns** (critical — 20 occurrences):
   - WDIO syntax `.ng-option=${text}` carried into Cypress is NOT valid Playwright CSS
   - The `ng-dropdown-panel` renders at `<body>` level, not inside the ng-select component
   - Fix: `page.locator('ng-dropdown-panel').locator('.ng-option').filter({ hasText: text }).first()`

4. **Angular Material checkboxes**:
   - Auto-generated `#mat-checkbox-N` IDs are unstable
   - Check the template for explicit `id="checkbox{{value}}"` attributes
   - Access the real input: `page.locator('#checkbox${id}').locator('input[type="checkbox"]')`

5. **Strict mode violations**:
   - `.folder-tree-name` matching 9 elements → add `.first()` or narrow with parent context
   - `mat-tree-node button` matching multiple expand buttons → use `.first()` or index

6. **mtx-grid templates**:
   - Duplicate `#idTpl` template references — Angular uses the last declaration
   - The element you expect may not exist in DOM; verify with browser DevTools

7. **Tree node structure**:
   - `ng-container` is transparent in DOM
   - Parent nodes: `<small>` is direct child of `mat-tree-node` (via transparent `ng-container`)
   - Leaf/child nodes: `<small>` is inside `<div>` inside `mat-tree-node`
   - `mat-tree-node > small` only matches parents, not children
   - Use `.children` CSS class to target child nodes: `mat-tree-node.children`

### 4. Timing & Waiting

Replacing Cypress auto-retry:

1. **Element visibility**:
   - Cypress: `cy.get('#el').should('be.visible')`
   - Playwright: `await page.locator('#el').waitFor({ state: 'visible', timeout: 40000 })`

2. **Fixed waits**:
   - `cy.wait(2000)` → `await page.waitForTimeout(2000)`
   - Prefer DOM-based waits over fixed timeouts

3. **Spinner waits**:
   - Verify `waitForSpinnerHide()` is actually implemented
   - We found a no-op override where the entire method body was commented out
   - The override in a subclass silently replaced the working base class implementation

4. **API response waits**:
   - Cypress: `cy.intercept('GET', '**/api/endpoint').as('alias'); cy.wait('@alias')`
   - Playwright: `await page.waitForResponse(url => url.url().includes('/api/endpoint'))`

5. **Async UI updates (row counts, grid refresh)**:
   - Never snapshot-assert immediately after a mutation
   - Use `expect.poll()`: `await expect.poll(async () => await locator.count(), { timeout: 10000 }).toBe(expected)`

6. **Post-dialog navigation**:
   - After closing a create/edit dialog, the grid may not repopulate immediately
   - Option A: Navigate away and back to force reload
   - Option B: Use `expect.poll` to wait for row count to update
   - Option C: Wait for a specific data element (e.g., `#email-0`) to appear

7. **SPA navigation**:
   - `page.goto('/route')` can lose auth state in SPAs
   - Prefer navbar click navigation
   - If the page doesn't load, retry with `page.reload()` in a loop (up to 3 attempts)

8. **Blind waits are CI killers**:
   - `await page.waitForTimeout(8000)` fails when CI is slow
   - Replace with `await page.locator('#knownElement').waitFor({ state: 'visible', timeout: 40000 })`

### 5. Assertions

1. **Text content**:
   - Cypress: `cy.get('#el').should('contain', 'text')`
   - Playwright: `expect(await locator.textContent()).toContain('text')`
   - **Always `.trim()`** — Angular elements include surrounding whitespace

2. **Element count**:
   - Cypress: `cy.get('.items').should('have.length', 3)`
   - Playwright: `expect(await locator.count()).toBe(3)`

3. **innerHTML whitespace**:
   - Format varies between local and CI environments
   - Normalize: `html.replace(/\s+/g, '')` and compare against compact expected string
   - Example: `<div>\n  <b>text</b>\n</div>` in local → `<div><b>text</b></div>` in CI

4. **Checkbox state**:
   - Cypress: `cy.get('#cb').should('be.checked')`
   - Playwright: `expect(await page.locator('#cb input[type="checkbox"]').isChecked()).toBe(true)`
   - Angular Material wraps the real `<input>` inside the component

5. **Async count assertions after mutations**:
   - Wrong: `expect(await count()).toBe(n)` — races with DOM update
   - Right: `await expect.poll(async () => await count(), { timeout: 10000 }).toBe(n)`

6. **Per-test timeout**:
   - Wrong: `test('name', { timeout: 240000 }, async () => {})` — doesn't override Playwright default
   - Right: `test.setTimeout(240000)` inside the test body

### 6. Page Object Migration

1. **Class structure**:
   - Cypress: plain objects with methods, no constructor
   - Playwright: classes that accept `Page` in the constructor, extend a base page class

   ```typescript
   // Cypress
   export default {
     login() { cy.get('#email').type('admin@admin.com'); }
   };

   // Playwright
   export class LoginPage {
     constructor(private page: Page) {}
     async login() { await this.page.locator('#email').fill('admin@admin.com'); }
   }
   ```

2. **Locator accessor methods**:
   - Return `Locator` (not `Promise<Locator>`) from accessor methods
   - Call async methods (`.click()`, `.fill()`, `.textContent()`) at the call site
   ```typescript
   public editBtn(): Locator { return this.page.locator('#editBtn'); }
   // Usage: await this.editBtn().click();
   ```

3. **Row objects (indexable grid rows)**:
   - Constructor takes `page` + row number
   - `getRow(n)` / `init()` reads DOM state into properties (id, name, email, etc.)
   - Wait for a known element before reading: `await locator.waitFor({ state: 'visible', timeout: 40000 })`
   - Handle missing elements gracefully: check `.count() > 0` before reading `.textContent()`

4. **Row menu pattern**:
   - `openRowMenu()`: click action menu button → wait for menu items → click specific action
   - Watch for off-by-one: if constructor takes 1-based index, `openRowMenu` must subtract 1 for 0-based DOM IDs
   - Verify the selector produces a valid ID (e.g., `#action-items-${index}` with index=-1 produces `#action-items--1`)

5. **Create/edit lifecycle**:
   - `openCreate()` fills the form, `closeCreate()` clicks save and waits for list to return
   - Always wait for a known element after dialog closes (e.g., create button visible again)
   - For edit: navigate away and back after save to ensure grid refresh

6. **Conditional form fields**:
   - Check Angular template `*ngIf` conditions
   - Fields may not exist in all modes (e.g., password field hidden during edit: `*ngIf="!edit"`)
   - Don't pass values for fields that won't be rendered — the test will timeout waiting for a non-existent element

7. **Tree structures**:
   - `mat-tree` parent vs child nodes have different DOM structure
   - Always call `expandChildren()` before accessing child nodes — the tree may have collapsed
   - After tree mutations (create/delete child), re-fetch the parent folder object and re-expand

8. **Self-contained test suites**:
   - Each `test.describe.serial` block runs in its own browser context
   - Don't assume state from other spec files
   - Create your own test data in `beforeAll`
   - Example: `workers.edit.spec.ts` must create its own worker, not rely on `workers.add.spec.ts`

### 7. CI/CD Integration

1. **GitHub Actions matrix**:
   - Split tests into groups (a-j) for parallel execution
   - Each group runs in its own job with independent browser and backend
   - Configure with `matrix: { group: [a, b, c, d, e, f, g, h, i, j] }`

2. **Retry config**:
   - `retries: process.env.CI ? 1 : 0` — catches flaky tests without hiding real failures
   - Per-file override: `test.describe.configure({ retries: 2 })` for known-flaky suites

3. **Artifacts**:
   - `retain-on-failure` for video, screenshot, and trace
   - Essential for debugging CI-only failures — always upload as GitHub Actions artifacts
   - View traces: `npx playwright show-trace path/to/trace.zip`

4. **Backend dependencies**:
   - Some tests depend on external services (e.g., Microting cloud API for `SiteWorkerCreate`)
   - Use `test.skip()` with a descriptive message when the backend is unavailable:
     ```typescript
     test.skip(await workers.rowNum() === 0, 'SiteWorkerCreate failed on backend');
     ```
   - Retry backend-dependent setup in `beforeAll` (up to 3 attempts)

5. **Grid/table async loading**:
   - Components like `mtx-grid` load data asynchronously
   - The create button may appear before row data
   - Always wait for actual data elements, not just page chrome

6. **Fetching CI logs for debugging**:
   - `gh api repos/OWNER/REPO/actions/runs/RUN_ID/jobs` — list jobs with status/conclusion
   - `gh api repos/OWNER/REPO/actions/jobs/JOB_ID/logs` — full logs
   - Search logs for `Expected`, `Received`, `Error`, `.spec.ts:` to find failures quickly

### 8. Full Pitfall Catalog

Each pitfall follows a consistent template: **Symptom** (what you see), **Cause** (why), **Fix** (what to do), **Before/After** (code).

---

#### Pitfall 1: Invalid CSS selector `.ng-option=${text}`

**Symptom**: `Error: Unexpected token "=" while parsing css selector ".ng-option=Dansk"`

**Cause**: `.ng-option=${text}` is WDIO custom syntax for selecting by text content. It's not valid CSS and was carried through the Cypress migration unchanged.

**Fix**: Use Playwright's `.filter({ hasText })` API. Also, `ng-dropdown-panel` renders at `<body>` level, not inside the component.

**Before**:
```typescript
this.page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`)
```

**After**:
```typescript
this.page.locator('ng-dropdown-panel').locator('.ng-option').filter({ hasText: da.text }).first()
```

**Scope**: 20 occurrences across Folders.page.ts and folder test specs.

---

#### Pitfall 2: Playwright test timeout syntax

**Symptom**: Test still shows 120000ms timeout despite setting `{ timeout: 240000 }` in test options.

**Cause**: `test('name', { timeout: 240000 }, async () => {})` does not override the Playwright default timeout. The options object syntax is not supported for timeout.

**Fix**: Use `test.setTimeout()` inside the test body.

**Before**:
```typescript
test('should pair several device users', { timeout: 240000 }, async () => {
  // ...
});
```

**After**:
```typescript
test('should pair several device users', async () => {
  test.setTimeout(240000);
  // ...
});
```

---

#### Pitfall 3: Wrong checkbox selector for Angular Material

**Symptom**: Checkbox verification fails — element not found or always unchecked.

**Cause**: Angular Material generates IDs like `mat-checkbox-0`, `mat-checkbox-1`, etc. But if the template has an explicit `id="checkbox{{value}}"`, that overrides the auto-generated ID. The real `<input type="checkbox">` is nested inside the component.

**Fix**: Check the Angular template for explicit ID bindings. Access the real input element inside the component.

**Before**:
```typescript
const checkbox = page.locator(`#mat-checkbox-${index}`);
expect(await checkbox.isChecked()).toBe(true);
```

**After**:
```typescript
const checkbox = page.locator(`#checkbox${users[index].siteId}`).locator('input[type="checkbox"]');
expect(await checkbox.isChecked()).toBe(true);
```

---

#### Pitfall 4: Duplicate variable declarations after refactoring

**Symptom**: `SyntaxError: Identifier 'folder' has already been declared`

**Cause**: When adding code before existing code (e.g., adding `expandChildren()` before a block that already declares `const folder`), you create a duplicate `const` in the same scope.

**Fix**: Change the first declaration to `let` and subsequent ones to reassignment.

**Before**:
```typescript
const folder = await foldersPage.getFolderByName(nameFolder); // added
await folder.expandChildren();                                 // added
// ... later in same scope:
const folder = await foldersPage.getFolderByName(nameFolder); // original — SyntaxError!
```

**After**:
```typescript
let folder = await foldersPage.getFolderByName(nameFolder);
await folder.expandChildren();
// ... later:
folder = await foldersPage.getFolderByName(nameFolder);
```

---

#### Pitfall 5: Strict mode violations on multiple elements

**Symptom**: `locator('.folder-tree-name') resolved to 9 elements` or `locator('button') resolved to 2 elements`

**Cause**: Playwright strict mode throws when a locator matches multiple elements and you call an action on it. Cypress silently uses the first match.

**Fix**: Add `.first()` to use the first match, `.nth(n)` for a specific one, or narrow the selector with parent context.

**Before**:
```typescript
await page.locator('.folder-tree-name').waitFor({ state: 'visible', timeout: 40000 });
```

**After**:
```typescript
await page.locator('.folder-tree-name').first().waitFor({ state: 'visible', timeout: 40000 });
```

---

#### Pitfall 6: innerHTML whitespace mismatch between local and CI

**Symptom**: `expect(html).toBe('<div>\n  <b>text</b>\n</div>')` passes locally but fails in CI with `<div><b>text</b></div>`.

**Cause**: HTML rendering whitespace varies by environment. Angular may minify HTML differently in CI builds.

**Fix**: Normalize whitespace before comparing.

**Before**:
```typescript
expect(html).toBe(`<div>\n  <b>${description}</b>\n</div>`);
```

**After**:
```typescript
expect(html.replace(/\s+/g, '')).toBe(`<div><b>${description}</b></div>`);
```

---

#### Pitfall 7: Duplicate Angular template references

**Symptom**: `#userAdministrationId-0` never appears in DOM, causing `waitFor` to hang for 40 seconds.

**Cause**: Two `<ng-template #idTpl>` declarations in the same component. Angular uses the last one. If the mtx-grid component binds to the first one (without the test ID attributes), those attributes never render.

**Fix**: Don't rely on potentially missing elements. Check `.count() > 0` before reading, or use a different selector that's guaranteed to exist.

**Before**:
```typescript
await this.page.locator('#userAdministrationId-' + rowNum).waitFor({ state: 'visible', timeout: 40000 });
this.id = +(await this.page.locator('#userAdministrationId-' + rowNum).textContent() || '0');
```

**After**:
```typescript
await this.page.locator('#userAdministrationEmail-' + rowNum).waitFor({ state: 'visible', timeout: 40000 });
const idLocator = this.page.locator('#userAdministrationId-' + rowNum);
this.id = (await idLocator.count()) > 0 ? +(await idLocator.textContent() || '0') : 0;
```

---

#### Pitfall 8: `rowChildrenNum()` counting wrong node type

**Symptom**: Child count assertion always wrong — expected 1, got 0.

**Cause**: `mat-tree-node > small` only matches parent nodes. In child (leaf) nodes, `<small>` is inside a `<div>`, not a direct child of `mat-tree-node`. The `ng-container` wrapper is transparent in DOM for parent nodes but children use a different template.

**Fix**: Count nodes by CSS class instead of DOM structure.

**Before**:
```typescript
// rowChildrenNum() counts mat-tree-node > small — only matches parents!
const count = await foldersPage.rowChildrenNum();
```

**After**:
```typescript
const childrenLocator = page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node.children');
const count = await childrenLocator.count();
```

---

#### Pitfall 9: Parent folder can't be deleted with children

**Symptom**: Delete assertion fails — row count doesn't decrease after deleting parent folder.

**Cause**: The backend refuses to delete a parent folder that still has children. The test tried to delete the parent without first deleting the child.

**Fix**: Delete children first, then delete the parent.

**Before**:
```typescript
const folder = await foldersPage.getFolderByName(nameFolder);
await folder.delete();
```

**After**:
```typescript
let folder = await foldersPage.getFolderByName(nameFolder);
await folder.expandChildren();
const child = await foldersPage.getFolderFromTree(
  await foldersPage.getFolderRowNumByName(nameFolder), 1
);
await child.delete();
await page.waitForTimeout(2000);
folder = await foldersPage.getFolderByName(nameFolder);
await folder.delete();
```

---

#### Pitfall 10: SPA navigation losing auth state

**Symptom**: Page shows login screen or empty content after `page.goto('/route')`.

**Cause**: `page.goto()` in an SPA can trigger a full page reload that clears the auth token from memory (even though it may be in localStorage). Navbar click navigation maintains the SPA session.

**Fix**: Use navbar navigation instead of `page.goto()`. If the page doesn't load, retry with `page.reload()`.

**Before**:
```typescript
await page.goto('/user-administration');
```

**After**:
```typescript
await myEformsPage.Navbar.goToUserAdministration();
// Retry if grid doesn't load
for (let attempt = 0; attempt < 3; attempt++) {
  await page.waitForTimeout(5000);
  if (await page.locator('#userAdministrationEmail-0').isVisible()) break;
  if (attempt < 2) {
    await page.reload();
    await page.waitForTimeout(3000);
  }
}
```

---

#### Pitfall 11: Password field hidden in edit mode

**Symptom**: `TimeoutError: locator.waitFor: Timeout 40000ms exceeded` waiting for `#editPassword`.

**Cause**: The Angular template uses `*ngIf="!edit"` on the password field — it only renders during user creation, not during edit. Passing `password` in the edit user object causes a 40-second timeout waiting for a non-existent element.

**Fix**: Check the Angular template for conditional rendering. Don't pass values for fields that won't be rendered.

**Before**:
```typescript
const user: UserAdministrationObject = {
  firstName: 'Foo',
  lastName: 'Bar',
  password: 'secretpassword',  // field doesn't exist in edit mode!
};
await userObject.edit(user);
```

**After**:
```typescript
const user: UserAdministrationObject = {
  firstName: 'Foo',
  lastName: 'Bar',
  // password omitted — field not rendered during edit
};
await userObject.edit(user);
```

---

#### Pitfall 12: Grid not repopulating after create/delete

**Symptom**: `expect.poll` times out — `rowNum()` stays at 0 after creating a user.

**Cause**: After the create dialog closes, the Angular component may not automatically refresh the grid data. The button becomes visible but the data hasn't loaded.

**Fix**: Navigate away and back to force a data reload, then use `expect.poll` for the assertion.

**Before**:
```typescript
await userAdministration.createNewUser(user);
expect(countBefore + 1).toBe(await userAdministration.rowNum());
```

**After**:
```typescript
// In closeCreateNewUser():
await this.createAdministrationUserBtn().click();
await this.createNewUserBtn().waitFor({ state: 'visible', timeout: 40000 });
await this.page.goto('/');
await this.Navbar.goToUserAdministration();
await this.createNewUserBtn().waitFor({ state: 'visible', timeout: 40000 });

// In test:
await userAdministration.createNewUser(user);
await expect.poll(async () => await userAdministration.rowNum(), { timeout: 40000 }).toBe(countBefore + 1);
```

---

#### Pitfall 13: `rowNum()` using wrong selector

**Symptom**: `rowNum()` returns 0 even though rows are visible in the grid.

**Cause**: `rowNum()` counted `.userAdministrationId` elements, but the duplicate `#idTpl` template issue meant those elements never rendered. The email elements (`[id^="userAdministrationEmail-"]`) did render correctly.

**Fix**: Use a selector for elements that are guaranteed to exist.

**Before**:
```typescript
public async rowNum(): Promise<number> {
  return await this.page.locator('.userAdministrationId').count();
}
```

**After**:
```typescript
public async rowNum(): Promise<number> {
  return await this.page.locator('[id^="userAdministrationEmail-"]').count();
}
```

---

#### Pitfall 14: Worker edit tests with no workers (separate browser context)

**Symptom**: `waiting for locator('#action-items--1 #actionMenu') to be visible` — note the double-dash indicating index=-1.

**Cause**: `workers.edit.spec.ts` and `workers.add.spec.ts` are separate files. Each `test.describe` gets its own browser context. The edit tests assumed workers created by the add tests would be available — they weren't.

**Fix**: Each spec file must create its own test data in `beforeAll`.

**Before**:
```typescript
test.beforeAll(async ({ browser }) => {
  // Just navigate — assumes workers already exist
  await myEformsPage.Navbar.goToWorkers();
  await page.waitForTimeout(8000);
});
```

**After**:
```typescript
test.beforeAll(async ({ browser }) => {
  // Create own test data
  await myEformsPage.Navbar.goToDeviceUsersPage();
  await deviceUsersPage.createNewDeviceUser('EditTest', 'User');
  await myEformsPage.Navbar.goToWorkers();
  await page.locator('#workerCreateBtn').waitFor({ state: 'visible', timeout: 40000 });
  await workers.createNewWorker('InitialFirst', 'InitialLast');
  await page.waitForTimeout(2000);
});
```

---

#### Pitfall 15: `SiteWorkerCreate` backend intermittent failure

**Symptom**: `SqlController.SiteWorkerCreate failed` in backend logs. Worker not created. Tests fail because table is empty.

**Cause**: The Microting cloud API for site/worker creation intermittently fails in CI. This is a backend infrastructure issue, not a test code problem.

**Fix**: Use `test.skip()` to gracefully handle backend unavailability. Retry creation in `beforeAll`.

```typescript
// In beforeAll — retry creation
for (let attempt = 0; attempt < 3; attempt++) {
  await workers.createNewWorker('Name', 'Surname');
  await page.waitForTimeout(3000);
  if (await workers.rowNum() > 0) break;
}

// In test — skip gracefully
test('should edit worker', async () => {
  test.skip(await workers.rowNum() === 0, 'SiteWorkerCreate failed on backend — worker not created');
  // ... test body
});
```

---

#### Pitfall 16: `waitForSpinnerHide` no-op override

**Symptom**: Tests proceed while the app is still loading, causing stale or missing element errors.

**Cause**: The `Navbar` class declared its own `waitForSpinnerHide()` that overrode the working `BasePage` implementation. The method body was entirely commented out (a TODO referencing a WebDriverIO bug from before the Playwright migration).

**Fix**: Delete the override so callers use the base class implementation, or re-implement it.

**Before** (in Navbar.page.ts):
```typescript
public async waitForSpinnerHide(timeout: number = 90000) {
  // TODO: fix this
  // while (await this.spinnerAnimation().isVisible()) {
  //   await this.page.waitForTimeout(100);
  // }
}
```

**Fix**: Delete the method entirely, or implement properly:
```typescript
public async waitForSpinnerHide(timeout: number = 90000) {
  try {
    await this.spinnerAnimation().waitFor({ state: 'hidden', timeout });
  } catch {
    // Spinner may not appear at all
  }
}
```

---

#### Pitfall 17: Blind wait instead of DOM-based wait

**Symptom**: Tests timeout in CI but pass locally. An 8-second `waitForTimeout` isn't enough on slow CI runners.

**Cause**: Fixed timeouts are unreliable across environments. CI runners vary in speed.

**Fix**: Replace with a wait for a known DOM element.

**Before**:
```typescript
await myEformsPage.Navbar.goToWorkers();
await page.waitForTimeout(8000);
```

**After**:
```typescript
await myEformsPage.Navbar.goToWorkers();
await page.locator('#workerCreateBtn').waitFor({ state: 'visible', timeout: 40000 });
```

---

#### Pitfall 18: Off-by-one in row menu index calculation

**Symptom**: Action menu selector `#action-items--1` (double-dash = negative index).

**Cause**: `this.index` was 0 (from `getWorker(0)` when table is empty). `openRowMenu` does `index = this.index - 1 = -1`. The CSS selector `#action-items--1` doesn't match anything.

**Fix**: Guard against empty tables. The root cause is usually missing test data (see Pitfall 14), but defensive code helps:
```typescript
async openRowMenu() {
  const index = this.index - 1;
  if (index < 0) throw new Error(`Invalid row index: ${this.index}. Is the table empty?`);
  const menuBtn = this.page.locator(`#action-items-${index} #actionMenu`);
  await menuBtn.waitFor({ state: 'visible', timeout: 40000 });
  await menuBtn.scrollIntoViewIfNeeded();
  await menuBtn.click();
}
```

---

#### Pitfall 19: `ng-dropdown-panel` rendering at body level

**Symptom**: `page.locator('#selectId .ng-option')` finds nothing even though the dropdown is open.

**Cause**: ng-select's dropdown panel (`ng-dropdown-panel`) is appended to `<body>` by default (via `appendTo="body"` or ng-select's default behavior), not inside the `ng-select` component.

**Fix**: Search for the panel at the body level, not inside the select component.

**Before**:
```typescript
await this.page.locator('#createLanguageSelector .ng-option').click();
```

**After**:
```typescript
await this.page.locator('ng-dropdown-panel').locator('.ng-option').filter({ hasText: 'Dansk' }).first().click();
```

---

#### Pitfall 20: `textContent()` returning untrimmed whitespace

**Symptom**: `expect(name).toBe('Foo')` fails with `' Foo '` or `'\n  Foo\n'`.

**Cause**: Angular template whitespace (newlines, indentation) is included in `textContent()`. Cypress `should('contain')` was lenient; Playwright `toBe()` is exact.

**Fix**: Always `.trim()` the result of `textContent()`.

**Before**:
```typescript
this.name = await this.page.locator('#folderName').textContent() || '';
```

**After**:
```typescript
this.name = (await this.page.locator('#folderName').textContent() || '').trim();
```

---

### 9. Checklist

#### Pre-Migration
- [ ] Playwright installed and `playwright.config.ts` configured
- [ ] CI workflow updated with Playwright test jobs
- [ ] Page object base classes created (BasePage, PageWithNavbar)
- [ ] Helper functions migrated (e.g., `generateRandmString`, `selectValueInNgSelector`)
- [ ] Login flow working in Playwright

#### During Migration (per spec file)
- [ ] All `cy.get()` → `page.locator()` conversions done
- [ ] All `cy.contains()` → `.filter({ hasText })` conversions done
- [ ] All `should()` → `expect()` assertions converted
- [ ] ng-select dropdown selectors use body-level `ng-dropdown-panel` lookup
- [ ] `textContent()` calls include `.trim()`
- [ ] `innerHTML` comparisons normalize whitespace
- [ ] Strict mode handled (`.first()`, `.nth()`, or narrower selectors)
- [ ] Fixed waits replaced with DOM-based waits where possible
- [ ] `test.describe.serial` used for stateful test suites
- [ ] `beforeAll` creates its own test data (no cross-file dependencies)
- [ ] `afterAll` cleans up test data and closes the page
- [ ] Angular template `*ngIf` conditions checked for conditional fields
- [ ] Async mutations use `expect.poll()` instead of snapshot assertions

#### Post-Migration
- [ ] All tests pass locally with `npx playwright test`
- [ ] All CI matrix jobs green
- [ ] Retry count in CI is 1 (not masking real failures)
- [ ] Failed test artifacts (screenshots, traces) uploading correctly
- [ ] Backend-dependent tests have graceful skip logic
- [ ] Migration tracking document updated
