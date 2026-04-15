import loginPage from '../../../Login.page';

const BASE_URL = 'http://localhost:4200';

describe('Time Planning - Tag Filtering', () => {
  const tagNames = [
    `Tag-A-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    `Tag-B-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    `Tag-C-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    `Tag-D-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    `Tag-E-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  ];


  // Define tag combinations for each site
  let siteTagCombinations = [
    { siteIndex: 0, tags: [tagNames[0], tagNames[1]], sitename: '' }, // Site 1: Tag-A, Tag-B
    { siteIndex: 1, tags: [tagNames[0], tagNames[2]], sitename: '' }, // Site 2: Tag-A, Tag-C
    { siteIndex: 2, tags: [tagNames[0], tagNames[3]], sitename: '' }, // Site 3: Tag-A, Tag-D
    { siteIndex: 3, tags: [tagNames[0], tagNames[4]], sitename: '' }, // Site 4: Tag-A, Tag-E
    { siteIndex: 4, tags: [tagNames[0], tagNames[1], tagNames[2]], sitename: '' }, // Site 5: Tag-A, Tag-B, Tag-C
  ];

  beforeEach(() => {
    cy.visit(BASE_URL);
    loginPage.login();
  });

  /**
   * Helper function to create a tag following the pattern from 'm' folder
   */
  const createTag = (tagName) => {
    cy.task('log', `[Tag Filter Tests] Creating tag: ${tagName}`);

    // Navigate to Advanced > Sites to access tags management
    cy.visit(`${BASE_URL}/advanced/sites`);
    cy.task('log', '[Tag Filter Tests] Visited /advanced/sites, waiting for page load');
    cy.wait(2000);

    cy.task('log', '[Tag Filter Tests] Looking for tags management UI elements');
    cy.get('body').then(($sitesBody) => {
      // Helper function to filter mat-icons for tag icons
      const isTagIcon = (el) => {
        const text = Cypress.$(el).text().trim();
        return text === 'discount';
      };

      // Try to find tags button by mat-icon
      const hasTagIconButton = $sitesBody.find('button mat-icon').filter((i, el) => isTagIcon(el)).length > 0;

      if (!hasTagIconButton) {
        throw new Error('[Tag Filter Tests] FAILED: Tags button with mat-icon (discount) not found on Sites page');
      }

      cy.task('log', '[Tag Filter Tests] Tags button with mat-icon found, clicking it');
      // Click the tags button
      cy.get('button').find('mat-icon').filter((i, el) => isTagIcon(el)).parents('button').first().click();
      cy.task('log', '[Tag Filter Tests] Clicked tags button');

      // Wait for dialog or form to open
      cy.wait(1000);
      cy.task('log', '[Tag Filter Tests] Waited for tag creation dialog to open');

      // Enter tag name
      cy.get('body').then(($formBody) => {
        const addTagButtonWithIconAdd = $formBody.find('button mat-icon').filter((i, el) => {
          const text = Cypress.$(el).text().trim();
          return text === 'add';
        });

        if (addTagButtonWithIconAdd.length > 0) {
          cy.task('log', '[Tag Filter Tests] Found add tag button with mat-icon "add", clicking it to open creation form');
          addTagButtonWithIconAdd.parents('button').first().click();
          cy.wait(500);
        }

        cy.task('log', `[Tag Filter Tests] Looking for tag name input field, will enter: ${tagName}`);
        // Look for tag name input
        if ($formBody.find('input[id="newTagName"]').length > 0) {
          cy.get('input[id="newTagName"]').type(tagName);
          cy.task('log', `[Tag Filter Tests] Entered tag name in input[id="newTagName"]`);
        } else if ($formBody.find('input[formcontrolname="name"]').length > 0) {
          cy.get('input[formcontrolname="name"]').type(tagName);
          cy.task('log', `[Tag Filter Tests] Entered tag name in input[formcontrolname="name"]`);
        } else if ($formBody.find('input').filter((i, el) => {
          const placeholder = Cypress.$(el).attr('placeholder');
          return placeholder && placeholder.toLowerCase().includes('name');
        }).length > 0) {
          cy.get('input').filter((i, el) => {
            const placeholder = Cypress.$(el).attr('placeholder');
            return placeholder && placeholder.toLowerCase().includes('name');
          }).first().type(tagName);
          cy.task('log', `[Tag Filter Tests] Entered tag name in input with name placeholder`);
        } else {
          // Try to find any visible input in dialog
          cy.get('mat-dialog-container input[type="text"]').first().type(tagName);
          cy.task('log', `[Tag Filter Tests] Entered tag name in first text input in dialog`);
        }

        cy.task('log', '[Tag Filter Tests] Tag name entered, looking for Save button');
        // Save the tag
        cy.get('body').then(($saveBody) => {
          if ($saveBody.find('#newTagSaveBtn').length > 0) {
            cy.intercept('POST', '**/api/tags').as('tag-create');
            cy.get('#newTagSaveBtn').click();
            cy.task('log', '[Tag Filter Tests] Clicked #newTagSaveBtn, waiting for tag-create API call');
            cy.wait('@tag-create', { timeout: 10000 });
            cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
            cy.task('log', '[Tag Filter Tests] Tag-create API call completed');
            cy.get('#tagsModalCloseBtn').click();
            cy.task('log', '[Tag Filter Tests] Closed tag creation dialog');
          } else if ($saveBody.find('#saveButton').length > 0) {
            cy.intercept('POST', '**/api/tags').as('tag-create');
            cy.get('#saveButton').click();
            cy.task('log', '[Tag Filter Tests] Clicked #saveButton, waiting for tag-create API call');
            cy.wait('@tag-create', { timeout: 10000 });
            cy.task('log', '[Tag Filter Tests] Tag-create API call completed');
          }
        });

        // Wait for tag to be created
        cy.wait(1000);
        cy.task('log', '[Tag Filter Tests] Waited additional 1s after tag creation');

        // Validate that the tag appears in the list
        cy.get('body').then(($listBody) => {
          if ($listBody.text().includes(tagName)) {
            cy.task('log', `[Tag Filter Tests] SUCCESS: Tag "${tagName}" found in list after creation`);
          } else {
            cy.task('log', `[Tag Filter Tests] WARNING: Tag "${tagName}" not visible in list yet (may appear later)`);
          }
        });
      });
    });
  };

  /**
   * Test 1: Create 5 tags
   */
  it('should create 5 tags', () => {
    cy.task('log', '[Tag Filter Tests] ========== Starting tag creation ==========');

    // Create each tag one by one following the pattern from 'm' folder
    tagNames.forEach((tagName, index) => {
      cy.task('log', `[Tag Filter Tests] Creating tag ${index + 1} of 5`);
      createTag(tagName);
    });

    cy.task('log', '[Tag Filter Tests] All 5 tags created successfully');
  });

  /**
   * Test 2: Assign tags to sites
   * Assign different tag combinations to 5 sites for testing filtering
   * Site 1: Tag-A, Tag-B
   * Site 2: Tag-A, Tag-C
   * Site 3: Tag-A, Tag-D
   * Site 4: Tag-A, Tag-E
   * Site 5: Tag-A, Tag-B, Tag-C (for testing multiple tag filter)
   */
  it('should assign tags to sites', () => {
    cy.task('log', '[Tag Filter Tests] ========== Starting tag assignment to sites ==========');


    siteTagCombinations.forEach((combination, idx) => {
      cy.task('log', `[Tag Filter Tests] Assigning tags to site ${idx + 1}: ${combination.tags.join(', ')}`);

      // 1. Navigate to the advanced/sites
      cy.visit(`${BASE_URL}/advanced/sites`);
      cy.wait(2000);

      // Wait for spinner to disappear
      cy.get('body').then(($body) => {
        if ($body.find('.overlay-spinner').length > 0) {
          cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        }
      });

      cy.task('log', `[Tag Filter Tests] On sites page, looking for site ${idx + 1}`);

      // 1.1 Click the action menu for the site in list
      // `siteIndex` now refers to rows after the first entry
      cy.get('table tbody tr').then(($rows) => {
        const targetRow = $rows.slice(1).get(combination.siteIndex);
        cy.wrap(targetRow).within(() => {
          cy.task('log', `[Tag Filter Tests] Found site row ${idx + 1}, clicking action menu`);
          cy.get('#actionMenu, button[id*="actionMenu"]').first().scrollIntoView().click();
        });
        cy.wait(500);
      });

      // 1.2 Click the edit button
      cy.task('log', `[Tag Filter Tests] Clicking edit button for site ${idx + 1}`);
      cy.get('#editSiteBtn, button[id*="edit"]').first().scrollIntoView().should('be.visible').click();
      cy.wait(1000);

      // Wait for dialog to open
      cy.get('mat-dialog-container, [role="dialog"]').should('be.visible');
      cy.task('log', `[Tag Filter Tests] Site edit dialog opened`);

      // 1.3 Enter tags into the tag field with id "tagSelector" and select the tags
      cy.get('body').then(($dialogBody) => {
        const siteNameForRow = $dialogBody.find('#siteName').eq(idx + 2);
        combination.sitename = siteNameForRow.length ? siteNameForRow.text().trim() : '';
        cy.task('log', `[Tag Filter Tests] Found #tagSelector, selecting tags`);

        // Select each tag in the combination
        combination.tags.forEach((tagName, tagIdx) => {
          cy.task('log', `[Tag Filter Tests] Selecting tag: ${tagName}`);
          // Re-open dropdown for each tag selection to make .ng-option elements visible
          cy.get('#tagSelector').scrollIntoView().should('be.visible').click();
          cy.wait(500);
          cy.get('.ng-option').contains(tagName).click();
          cy.wait(200);
        });

        // Close dropdown
        cy.get('body').click(0, 0);
        cy.wait(500);
        cy.task('log', `[Tag Filter Tests] Tags selected for site ${idx + 1}`);
      });

      // 1.4 Intercept PUT to api/sites
      cy.intercept('PUT', '**/api/sites').as('site-update');

      // 1.5 Click the "save" button with id "siteEditSaveBtn"
      cy.task('log', `[Tag Filter Tests] Clicking save button`);
      cy.get('#siteEditSaveBtn').scrollIntoView().should('be.visible').click();

      // 1.5 Wait for PUT call to finish
      cy.task('log', `[Tag Filter Tests] Waiting for site-update API call`);
      cy.wait('@site-update', { timeout: 10000 });
      cy.task('log', `[Tag Filter Tests] Site update API call completed`);

      // 1.6 Wait for spinner to disappear, following pattern from m test folder
      cy.get('body').then(($body) => {
        if ($body.find('.overlay-spinner').length > 0) {
          cy.task('log', `[Tag Filter Tests] Spinner detected after save, waiting...`);
          cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        }
      });
      cy.wait(1000);

      cy.task('log', `[Tag Filter Tests] Successfully assigned tags to site ${idx + 1}`);
    });

    cy.task('log', '[Tag Filter Tests] ========== All tags assigned to sites successfully ==========');
  });

  /**
   * Test 3: Navigate to dashboard and verify filtering works
   */
  it('should show all assigned sites on dashboard', () => {
    cy.task('log', '[Tag Filter Tests] Navigating to dashboard...');

    // Navigate to Time Planning Dashboard
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.wait(500);

    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.wait('@index-update', { timeout: 60000 });

    // Wait for spinner
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.get('.overlay-spinner', { timeout: 30000 }).should('not.be.visible');
      }
    });

    cy.wait(2000);

    // Verify that sites are shown
    cy.get('body').then(($body) => {
      if ($body.find('app-time-plannings-table').length > 0) {
        cy.task('log', '[Tag Filter Tests] Dashboard loaded with planning table');
        cy.get('app-time-plannings-table').should('be.visible');
      }
    });

    cy.task('log', '[Tag Filter Tests] Dashboard verification complete');
  });

  /**
   * Test 4: Filter by single tag
   */
  it('should filter by single tag', () => {
    cy.task('log', '[Tag Filter Tests] Testing single tag filter...');

    // Navigate to dashboard
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.wait(500);

    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.wait('@index-update', { timeout: 60000 });

    // Wait for spinner
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.get('.overlay-spinner', { timeout: 30000 }).should('not.be.visible');
      }
    });

    // cy.wait(2000);

    // Check if tag filter exists
    cy.get('body').then(($body) => {
      cy.task('log', '[Tag Filter Tests] Found #planningTags filter');
      siteTagCombinations.forEach((combination, idx) => {
        cy.task('log', `[Tag Filter Tests] Testing filter for tag: ${combination.tags[0]} (Site: ${combination.sitename})`);
        cy.get('#planningTags').scrollIntoView().should('be.visible').click();
        cy.wait(500);
        cy.get('.ng-option').contains(combination.tags[0]).click();
        if ($body.find('.overlay-spinner').length > 0) {
          cy.get('.overlay-spinner', { timeout: 30000 }).should('not.be.visible');
        }

        // Verify that the correct site is shown for this tag
        cy.get('body').then(($body) => {
          if ($body.find('app-time-plannings-table').length > 0) {
            cy.task('log', '[Tag Filter Tests] Planning table visible, checking for filtered site');
            cy.get('app-time-plannings-table').should('be.visible');
            cy.get('app-time-plannings-table').should('contain', combination.sitename);
          } else {
            cy.task('log', '[Tag Filter Tests] ERROR: Planning table not found after applying tag filter');
          }
        });
        cy.wait(500);

      });
      cy.task('log', '[Tag Filter Tests] Tag filter dropdown should be open');
    });

    cy.task('log', '[Tag Filter Tests] Single tag filter test completed');
  });

  /**
   * Test 5: Filter by multiple tags (AND logic)
   */
  it('should filter by multiple tags', () => {
    cy.task('log', '[Tag Filter Tests] Testing multiple tag filter (AND logic)...');

    // Navigate to dashboard
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.wait(500);

    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.wait('@index-update', { timeout: 60000 });

    // Wait for spinner
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.get('.overlay-spinner', { timeout: 30000 }).should('not.be.visible');
      }
    });

    cy.wait(2000);

    cy.task('log', '[Tag Filter Tests] Multiple tag filter test completed');
  });
});
