import loginPage from '../../../Login.page';

describe('Dashboard edit values', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('saveWorkdayEntity');

    cy.get('mat-tree-node').contains('Dashboard').click();
    // cy.get('#backwards').click();
    cy.wait('@index-update', {timeout: 60000});
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder d] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.get('#workingHoursSite').click();
    cy.get('.ng-option').contains('ac ad').click();
  });

  const setTimepickerValue = (selector: string, hour: string, minute: string) => {
    let newSelector = '[data-testid="' + selector + '"]';
    cy.get(newSelector).click();
    cy.get('ngx-material-timepicker-face')
      .contains(hour)
      .click({force: true});
    cy.get('ngx-material-timepicker-face')
      .contains(minute)
      .click({force: true});
    cy.wait(1000);
    cy.contains('button', /^Ok$/).click({force: true});
  };

  it('should edit time planned in last week', () => {

    // Planned time
    cy.get('#cell0_0').click();

    setTimepickerValue('plannedStartOfShift1', '00', '00');
    setTimepickerValue('plannedEndOfShift1', '1', '00');

    cy.contains('button', /^Ok$/).click({force: true});
    cy.get('[data-testid="plannedEndOfShift1"]').should('have.value', '01:00');
    cy.get('#planHours').should('have.value', '1');
    cy.get('#saveButton').click();
    cy.wait('@saveWorkdayEntity', {timeout: 60000});
    cy.wait(1000);
  });

  it('should edit time registration in last week', () => {
    // Registrar time
    cy.get('#cell0_0').click();

    setTimepickerValue('start1StartedAt', '00', '00');
    setTimepickerValue('stop1StoppedAt', '1', '00');

    cy.contains('button', /^Ok$/).click({force: true});
    cy.wait(1000);
    cy.get('[data-testid="stop1StoppedAt"]').should('have.value', '01:00');
    cy.get('#saveButton').click();
    cy.wait('@saveWorkdayEntity', {timeout: 60000});
  });

  afterEach(() => {
    cy.get('#cell0_0').scrollIntoView();
    cy.get('#cell0_0').click();

    ['plannedStartOfShift1', 'start1StartedAt'].forEach(
      (selector) => {
        let newSelector = '[data-testid="' + selector + '"]';
        cy.get(newSelector)
          .closest('.flex-row')
          .find('button mat-icon')
          .contains('delete')
          .click({ force: true });
        cy.wait(500);
      }
    );

    cy.get('#saveButton').click();
    cy.wait('@saveWorkdayEntity', {timeout: 60000});
    cy.wait(1000);

  })

});
