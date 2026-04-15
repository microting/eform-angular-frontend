import loginPage from '../../../Login.page';

describe('Dashboard edit values', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('saveWorkdayEntity');

    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.wait('@index-update', {timeout: 60000});
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder f] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.get('#workingHoursSite').click();
    cy.get('.ng-option').contains('ac ad').click();
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
  });

  // Set a timepicker value
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

  // Get error message for a given input path
  const assertInputError = (errorTestId: string, expectedMessage: string) => {
    cy.wait(1000);
    cy.get(`[data-testid="${errorTestId}"]`)
      .should('be.visible')
      .and('contain', expectedMessage);
  };

  // --- Planned Shift Duration Validator ---
  it('should show an error when planned stop time is before start time', () => {
    setTimepickerValue('plannedStartOfShift1', '10', '00');
    setTimepickerValue('plannedEndOfShift1', '9', '00');
    assertInputError('plannedEndOfShift1-Error', 'Stop må ikke være før start');
  });

  it('should show an error when planned break is longer than the shift duration', () => {
    setTimepickerValue('plannedStartOfShift1', '1', '00');
    setTimepickerValue('plannedEndOfShift1', '10', '00');
    setTimepickerValue('plannedBreakOfShift1', '9', '00');
    assertInputError('plannedBreakOfShift1-Error', 'Pausen må ikke være lige så lang som eller længere end skiftets varighed');
  });

  it('should show an error when planned start and stop are the same', () => {
    setTimepickerValue('plannedStartOfShift1', '9', '00');
    setTimepickerValue('plannedEndOfShift1', '9', '00');
    assertInputError('plannedEndOfShift1-Error', 'Start og stop kan ikke være det samme');
  });

  // --- Actual Shift Duration Validator ---
  it('should show an error when actual stop time is before start time', () => {
    setTimepickerValue('start1StartedAt', '11', '00');
    setTimepickerValue('stop1StoppedAt', '9', '00');
    setTimepickerValue('pause1Id', '0', '00');
    assertInputError('stop1StoppedAt-Error', 'Stop må ikke være før start');
  });

  it('should show an error when actual pause is longer than the shift duration', () => {
    setTimepickerValue('start1StartedAt', '8', '00');
    setTimepickerValue('stop1StoppedAt', '10', '00');
    setTimepickerValue('pause1Id', '2', '00');
    assertInputError('pause1Id-Error', 'Pausen må ikke være lige så lang som eller længere end skiftets varighed');
  });

  it('should show an error when actual start and stop are the same', () => {
    setTimepickerValue('start1StartedAt', '9', '00');
    setTimepickerValue('stop1StoppedAt', '9', '00');
    setTimepickerValue('pause1Id', '0', '00');
    assertInputError('stop1StoppedAt-Error', 'Start og stop kan ikke være det samme');
  });

  // --- Shift-Wise Validator ---
  it('should show an error if planned Shift 2 starts before planned Shift 1 ends', () => {
    setTimepickerValue('plannedStartOfShift1', '8', '00');
    setTimepickerValue('plannedEndOfShift1', '12', '00');
    setTimepickerValue('plannedStartOfShift2', '11', '00');
    assertInputError('plannedStartOfShift2-Error', 'Start kan ikke være tidligere end stop for den forrige skift');
  });

  it('should show an error if actual Shift 2 starts before actual Shift 1 ends', () => {
    setTimepickerValue('start1StartedAt', '8', '00');
    setTimepickerValue('stop1StoppedAt', '12', '00');
    setTimepickerValue('start2StartedAt', '11', '00');
    assertInputError('start2StartedAt-Error', 'Start kan ikke være tidligere end stop for den forrige skift');
  });


  it('should select midnight to some hours', () => {
    setTimepickerValue('plannedStartOfShift1', '00', '00');
    setTimepickerValue('plannedEndOfShift1', '2', '00');
    setTimepickerValue('start1StartedAt', '00', '00');
    setTimepickerValue('stop1StoppedAt', '2', '00');
    cy.get('#planHours').should('have.value', '2');
    cy.get('#todaysFlex').should('have.value', '0.00');
  });

  it('should select some hours to midnight', () => {
    setTimepickerValue('plannedStartOfShift1', '2', '00');
    setTimepickerValue('plannedEndOfShift1', '00', '00');
    setTimepickerValue('start1StartedAt', '2', '00');
    setTimepickerValue('stop1StoppedAt', '00', '00');
    cy.get('#planHours').should('have.value', '22');
    cy.get('#todaysFlex').should('have.value', '0.00');
  });
});
