import loginPage from '../../../Login.page';
import pluginPage from '../../../Plugin.page';

describe('Dashboard edit values', () => {
  let storedValues = {};

  beforeEach(() => {
    cy.task('log', '[Folder j - Auto Break Settings] ========== BeforeEach: Setting up test ==========');
    cy.task('log', '[Folder j - Auto Break Settings] Visiting homepage and logging in');
    cy.visit('http://localhost:4200');
    loginPage.login();

    cy.task('log', '[Folder j - Auto Break Settings] Navigating to plugins page');
    pluginPage.Navbar.goToPluginsPage();
    cy.task('log', '[Folder j - Auto Break Settings] Clicking action menu');
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
    cy.task('log', '[Folder j - Auto Break Settings] Clicking plugin settings link');
    cy.get('#plugin-settings-link0').click();
    cy.task('log', '[Folder j - Auto Break Settings] Waiting for settings-get API call');
    cy.wait('@settings-get', { timeout: 60000 });
    cy.task('log', '[Folder j - Auto Break Settings] Settings loaded successfully');

    cy.task('log', '[Folder j - Auto Break Settings] Checking autoBreakCalculationActiveToggle state');
    cy.get('#autoBreakCalculationActiveToggle button[role="switch"]')
      .then(($btn) => {
        const isChecked = $btn.attr('aria-checked') === 'true';
        cy.task('log', `[Folder j - Auto Break Settings] Toggle is currently: ${isChecked ? 'ON' : 'OFF'}`);
        if (!isChecked) {
          cy.task('log', '[Folder j - Auto Break Settings] Turning toggle ON');
          cy.wrap($btn)
            .scrollIntoView()
            .click({force: true});
        }
      });

    // Confirm it's ON
    cy.task('log', '[Folder j - Auto Break Settings] Verifying toggle is ON');
    cy.get('#autoBreakCalculationActiveToggle button[role="switch"]')
      .should('have.attr', 'aria-checked', 'true');

    cy.task('log', '[Folder j - Auto Break Settings] Clicking saveSettings button');
    cy.get('#saveSettings')
      .scrollIntoView()
      .should('be.visible')
      .click({force: true});
    cy.task('log', '[Folder j - Auto Break Settings] BeforeEach setup complete');
  });

  it('should validate the values from global gets set', () => {
    cy.task('log', '[Folder j - Auto Break Settings] ========== Test: Validate values from global gets set ==========');

    cy.task('log', '[Folder j - Auto Break Settings] Clicking Timeregistrering menu');
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('saveWorkdayEntity');

    cy.task('log', '[Folder j - Auto Break Settings] Clicking Dashboard menu');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.task('log', '[Folder j - Auto Break Settings] Waiting for index-update API call');
    cy.wait('@index-update', {timeout: 60000});
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder j - Auto Break Settings] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder j - Auto Break Settings] Index updated successfully');

    cy.task('log', '[Folder j - Auto Break Settings] Clicking workingHoursSite dropdown');
    cy.get('#workingHoursSite').click();
    cy.task('log', '[Folder j - Auto Break Settings] Selecting site "ac ad"');
    cy.get('.ng-option').contains('ac ad').click();
    cy.task('log', '[Folder j - Auto Break Settings] Waiting for index-update API call after site selection');
    cy.wait('@index-update', {timeout: 60000});
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder j - Auto Break Settings] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder j - Auto Break Settings] Site selection completed');
    
    cy.task('log', '[Folder j - Auto Break Settings] Clicking firstColumn0 to open dialog');
    cy.get('#firstColumn0').click();

    cy.task('log', '[Folder j - Auto Break Settings] Waiting for dialog to appear');
    cy.get('mat-dialog-container', {timeout: 10000})
      .scrollIntoView().should('be.visible');
    cy.task('log', '[Folder j - Auto Break Settings] Dialog is visible');

    // Ensure the checkbox is active
    cy.task('log', '[Folder j - Auto Break Settings] Checking autoBreakCalculationActive-input checkbox state');
    cy.get('#autoBreakCalculationActive-input')
      .scrollIntoView()
      .then(($checkbox) => {
        const isChecked = $checkbox.is(':checked');
        cy.task('log', `[Folder j - Auto Break Settings] Checkbox is currently: ${isChecked ? 'checked' : 'unchecked'}`);
        if (!isChecked) {
          cy.task('log', '[Folder j - Auto Break Settings] Clicking checkbox to enable');
          cy.wrap($checkbox).click({force: true});
        }
      });

    cy.task('log', '[Folder j - Auto Break Settings] Verifying checkbox is checked');
    cy.get('#autoBreakCalculationActive-input').should('be.checked');

    // Click the "Auto break calculation settings" tab
    cy.task('log', '[Folder j - Auto Break Settings] Clicking "Auto break calculation settings" tab');
    cy.contains('.mat-mdc-tab', 'Auto break calculation settings')
      .scrollIntoView()
      .should('be.visible')
      .click({force: true});
    cy.task('log', '[Folder j - Auto Break Settings] Tab clicked successfully');

    // Click all refresh buttons (Monday–Sunday)
    cy.task('log', '[Folder j - Auto Break Settings] Finding and clicking all LoadDefaults buttons');
    cy.get('button[id$="LoadDefaults"]')
      .should('have.length.at.least', 1)
      .each(($btn, index) => {
        cy.task('log', `[Folder j - Auto Break Settings] Clicking LoadDefaults button ${index + 1}`);
        cy.wrap($btn)
          .scrollIntoView()
          .should('be.visible')
          .click({force: true});
        cy.wait(500);
      });
    cy.task('log', '[Folder j - Auto Break Settings] All LoadDefaults buttons clicked');

    // Capture all current input values
    cy.task('log', '[Folder j - Auto Break Settings] Capturing all current input values');
    cy.get('mat-dialog-container mat-tab-body[aria-hidden="false"]', {timeout: 10000})
      .scrollIntoView().should('be.visible')
      .within(() => {
        cy.get('input[readonly="true"]', {timeout: 10000})
          .should('have.length.at.least', 3)
          .then(($inputs) => {
            storedValues = {};
            $inputs.each((_, input) => {
              const id = input.id;
              const val = input.value;
              storedValues[id] = val;
              cy.task('log', `[Folder j - Auto Break Settings] Stored ${id}: ${val}`);
            });
            cy.task('log', `[Folder j - Auto Break Settings] Total stored values: ${Object.keys(storedValues).length}`);
          });
      });

    cy.intercept('PUT', '**/api/time-planning-pn/settings/assigned-site').as('assign-site');
    cy.task('log', '[Folder j - Auto Break Settings] Clicking saveButton to save settings');
    cy.get('#saveButton').scrollIntoView().click({force: true});
    cy.task('log', '[Folder j - Auto Break Settings] Waiting for assign-site API call');
    cy.wait('@assign-site', {timeout: 60000});
    cy.task('log', '[Folder j - Auto Break Settings] Site assigned successfully');
    cy.task('log', '[Folder j - Auto Break Settings] Waiting for index-update API call');
    cy.wait('@index-update', {timeout: 60000});
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder j - Auto Break Settings] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder j - Auto Break Settings] Index updated successfully');
    cy.task('log', '[Folder j - Auto Break Settings] Verifying dialog is closed');
    cy.get('mat-dialog-container', {timeout: 500}).should('not.exist');
    cy.wait(500);

    cy.task('log', '[Folder j - Auto Break Settings] Double-checking dialog is closed');
    cy.get('mat-dialog-container', {timeout: 500}).should('not.exist');
    cy.wait(500);

    cy.task('log', '[Folder j - Auto Break Settings] Reopening dialog by clicking firstColumn0');
    cy.get('#firstColumn0').click();

    cy.task('log', '[Folder j - Auto Break Settings] Waiting for dialog to reappear');
    cy.get('mat-dialog-container', {timeout: 500}).scrollIntoView().should('be.visible');
    cy.task('log', '[Folder j - Auto Break Settings] Dialog is visible');

    cy.task('log', '[Folder j - Auto Break Settings] Clicking "Auto break calculation settings" tab again');
    cy.contains('.mat-mdc-tab', 'Auto break calculation settings')
      .scrollIntoView()
      .should('be.visible')
      .click({force: true});
    cy.task('log', '[Folder j - Auto Break Settings] Tab clicked successfully');

    cy.task('log', '[Folder j - Auto Break Settings] Verifying tab content is visible');
    cy.get('#mat-tab-group-1-content-1')
      .should('exist')
      .and('not.have.attr', 'aria-hidden', 'true');
    cy.task('log', '[Folder j - Auto Break Settings] Tab content verified');

    // Verify all input values match the stored ones
    cy.task('log', '[Folder j - Auto Break Settings] Verifying all input values match stored values');
    cy.get('#mat-tab-group-1-content-1 input[readonly="true"]').each(($input, index) => {
      const id = $input.attr('id');
      const val = $input.val();
      cy.task('log', `[Folder j - Auto Break Settings] Verifying input ${index + 1} (${id}): current=${val}, expected=${storedValues[id]}`);
      cy.wrap(val).should('eq', storedValues[id]);
    });
    cy.task('log', '[Folder j - Auto Break Settings] All input values verified successfully');

    cy.task('log', '[Folder j - Auto Break Settings] Clicking saveButton to close dialog');
    cy.get('#saveButton').scrollIntoView().click({force: true});
    cy.task('log', '[Folder j - Auto Break Settings] Verifying dialog is closed');
    cy.get('mat-dialog-container', {timeout: 500}).should('not.exist');
    cy.wait(500);

    cy.task('log', '[Folder j - Auto Break Settings] Test completed successfully');
  });

  // Since we only have one test in j suite, we can skip the afterEach cleanup
  // afterEach(() => {
  //   cy.get('#firstColumn0').click();
  //
  //   // Ensure the checkbox inactive
  //   cy.get('#autoBreakCalculationActive-input')
  //     .scrollIntoView()
  //     .then(($checkbox) => {
  //       if ($checkbox.is(':checked')) {
  //         cy.wrap($checkbox).click({force: true});
  //       }
  //     });
  //
  //   cy.get('#saveButton').scrollIntoView().click({force: true});
  //   cy.get('mat-dialog-container', {timeout: 500}).should('not.exist');
  //   cy.wait(500);
  //
  //   pluginPage.Navbar.goToPluginsPage();
  //   cy.get('#actionMenu')
  //     .should('be.visible')
  //     .click({ force: true });
  //   cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
  //   cy.get('#plugin-settings-link0').click();
  //   cy.wait('@settings-get', { timeout: 60000 });
  //
  //   cy.url().should('include', '/plugins/time-planning-pn/settings');
  //
  //   cy.get('#autoBreakCalculationActiveToggle button[role="switch"]')
  //     .then(($btn) => {
  //       const isChecked = $btn.attr('aria-checked') === 'true';
  //       if (isChecked) {
  //         cy.wrap($btn)
  //           .scrollIntoView()
  //           .click({force: true});
  //       }
  //     });
  //
  //   // Confirm it's OFF
  //   cy.get('#autoBreakCalculationActiveToggle button[role="switch"]')
  //     .should('have.attr', 'aria-checked', 'false');
  //
  //   cy.get('#saveSettings')
  //     .scrollIntoView()
  //     .should('be.visible')
  //     .click({force: true});
  // });
});
