import loginPage from '../../../Login.page';

describe('Dashboard edit values', () => {
  beforeEach(() => {
    cy.task('log', '[Folder i - Dashboard Edit] ========== BeforeEach: Setting up test ==========');
    cy.task('log', '[Folder i - Dashboard Edit] Visiting homepage and logging in');
    cy.visit('http://localhost:4200');
    loginPage.login();

    cy.task('log', '[Folder i - Dashboard Edit] Clicking on Timeregistrering menu');
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('saveWorkdayEntity');

    cy.task('log', '[Folder i - Dashboard Edit] Clicking on Dashboard menu');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.task('log', '[Folder i - Dashboard Edit] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder i - Dashboard Edit] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder i - Dashboard Edit] Index updated successfully');

    cy.task('log', '[Folder i - Dashboard Edit] Selecting site "ac ad"');
    cy.get('#workingHoursSite').click();
    cy.get('.ng-option').contains('ac ad').click();
    cy.task('log', '[Folder i - Dashboard Edit] BeforeEach setup complete');
  });

  const setTimepickerValue = (selector: string, hour: string, minute: string) => {
    let newSelector = '[data-testid="' + selector + '"]';
    cy.get(newSelector).click();
    cy.get('ngx-material-timepicker-face').contains(hour).click({ force: true });
    cy.get('ngx-material-timepicker-face').contains(minute).click({ force: true });
    cy.wait(1000);
    cy.contains('button', /^Ok$/).click({ force: true });
  };

  it('should edit time planned in last week', () => {
    cy.task('log', '[Folder i - Dashboard Edit] ========== Test: Edit time planned in last week ==========');
    // Planned time
    cy.task('log', '[Folder i - Dashboard Edit] Clicking on cell0_0');
    cy.get('#cell0_0').click();

    cy.task('log', '[Folder i - Dashboard Edit] Setting plannedStartOfShift1 to 1:00');
    setTimepickerValue('plannedStartOfShift1', '1', '00');
    cy.task('log', '[Folder i - Dashboard Edit] Setting plannedEndOfShift1 to 23:35');
    setTimepickerValue('plannedEndOfShift1', '23', '35');

    cy.task('log', '[Folder i - Dashboard Edit] Clicking Ok button');
    cy.contains('button', /^Ok$/).click({ force: true });
    cy.wait(1000);

    cy.task('log', '[Folder i - Dashboard Edit] Clicking Save button');
    cy.get('#saveButton').click();
    cy.task('log', '[Folder i - Dashboard Edit] Waiting for saveWorkdayEntity API call');
    cy.wait('@saveWorkdayEntity', { timeout: 60000 });
    cy.task('log', '[Folder i - Dashboard Edit] Workday entity saved successfully');
    
    cy.task('log', '[Folder i - Dashboard Edit] Re-opening cell0_0');
    cy.get('#cell0_0').click();

    cy.task('log', '[Folder i - Dashboard Edit] Reading flexToDate value and calculating paidOutFlex');
    // Read the exact value from #flexToDate and set it to #paidOutFlex
    cy.get('#flexToDate')
      .then(($el) => {
        // Support for both input and text elements
        const val = ($el.is('input, textarea') ? $el.val() : $el.text()) as string;
        const cleaned = (val || '').trim().replace(',', '.');
        const parsedValue = parseFloat(cleaned || '0').toFixed(2);

        cy.task('log', `[Folder i - Dashboard Edit] flexToDate value: ${parsedValue}`);

        // @ts-ignore
        const actualValue = (parsedValue - 22.58).toFixed(2);
        cy.task('log', `[Folder i - Dashboard Edit] Setting paidOutFlex to: ${actualValue}`);

        cy.get('#paidOutFlex')
          .scrollIntoView().should('be.visible')
          .clear({ force: true })
          .type(actualValue, { delay: 0, force: true });

        cy.task('log', '[Folder i - Dashboard Edit] Clicking Save button again');
        cy.get('#saveButton').click({ force: true });
      });

    cy.task('log', '[Folder i - Dashboard Edit] Waiting for second saveWorkdayEntity API call');
    cy.wait('@saveWorkdayEntity', { timeout: 60000 });
    cy.task('log', '[Folder i - Dashboard Edit] Second save completed');
    
    cy.task('log', '[Folder i - Dashboard Edit] Re-opening cell0_0 for verification');
    cy.get('#cell0_0').click();
    cy.wait(1000);

    cy.task('log', '[Folder i - Dashboard Edit] Verifying flexIncludingToday is 0.00');
    cy.get('#flexIncludingToday').should('have.value', '0.00');
    cy.task('log', '[Folder i - Dashboard Edit] Verification successful');
    
    cy.task('log', '[Folder i - Dashboard Edit] Clicking Save button to finalize');
    cy.get('#saveButton').click();
    cy.task('log', '[Folder i - Dashboard Edit] Test completed successfully');
  });

  afterEach(() => {
    cy.task('log', '[Folder i - Dashboard Edit] ========== AfterEach: Cleanup ==========');
    cy.task('log', '[Folder i - Dashboard Edit] Opening cell0_0 for cleanup');
    cy.get('#cell0_0').click();

    cy.task('log', '[Folder i - Dashboard Edit] Deleting time entries');
    ['plannedStartOfShift1', 'plannedEndOfShift1', 'start1StartedAt', 'stop1StoppedAt'].forEach(
      (selector) => {
        cy.task('log', `[Folder i - Dashboard Edit] Deleting ${selector}`);
        let newSelector = '[data-testid="' + selector + '"]';
        cy.get(newSelector)
          .closest('.flex-row')
          .find('button mat-icon')
          .contains('delete')
          .click({ force: true });
        cy.wait(500);
      }
    );

    cy.task('log', '[Folder i - Dashboard Edit] Resetting paidOutFlex to 0');
    cy.get('#paidOutFlex')
      .scrollIntoView().should('be.visible')
      .clear({ force: true })
      .type('0', { delay: 0, force: true });

    cy.task('log', '[Folder i - Dashboard Edit] Waiting for saveWorkdayEntity API call');
    cy.wait('@saveWorkdayEntity', { timeout: 60000 });

    cy.task('log', '[Folder i - Dashboard Edit] Clicking Save button to complete cleanup');
    cy.get('#saveButton').click();
    cy.task('log', '[Folder i - Dashboard Edit] Waiting for final saveWorkdayEntity API call');
    cy.wait('@saveWorkdayEntity', { timeout: 60000 });
    cy.wait(1000);
    cy.task('log', '[Folder i - Dashboard Edit] Cleanup completed');
  });
});
