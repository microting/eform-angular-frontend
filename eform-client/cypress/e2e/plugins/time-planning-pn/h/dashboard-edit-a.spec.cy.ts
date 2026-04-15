import loginPage from '../../../Login.page';

describe('Dashboard edit values', () => {
  const setTimepickerValue = (selector: string, hour: string, minute: string) => {
    let newSelector = '[data-testid="' + selector + '"]';
    cy.get(newSelector).click();
    cy.get('ngx-material-timepicker-face').contains(hour).click({ force: true });
    cy.get('ngx-material-timepicker-face').contains(minute).click({ force: true });
    cy.wait(1000);
    cy.contains('button', /^Ok$/).click({ force: true });
  };

  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('saveWorkdayEntity');

    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder h] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.get('#workingHoursSite').click();
    cy.get('.ng-option').contains('ac ad').click();
    cy.get('#cell0_0').click();
    cy.wait(500);
  });

  it('should set paid out flex value', () => {
    cy.get('#paidOutFlex').clear().type('1.2');
  });

  it('should accepts decimal values with dot', () => {
    cy.get('#paidOutFlex').should('have.value', '1.2');
    cy.get('#paidOutFlex').clear().type('1,2');

  });

  it('should accepts decimal values with comma', () => {
    cy.get('#paidOutFlex').should('have.value', '1.2');
    cy.get('#paidOutFlex').clear().type('1,2');
  });

  it('should accepts whole numbers', () => {
    cy.get('#paidOutFlex').should('have.value', '1.2');
    cy.get('#paidOutFlex').clear().type('0');
  });

  afterEach(() => {
    cy.get('#saveButton').click();
    cy.wait('@saveWorkdayEntity', { timeout: 60000 });
    cy.wait(1000);
  });

});
