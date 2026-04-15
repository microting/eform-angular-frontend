import loginPage from '../../../Login.page';
import pluginPage from '../../../Plugin.page';

describe('Time Planning - Leave policies', () => {
  const testSiteSearchText = 'c d';

  const leavePolicies: { labelInFlags: string; expectedTooltip: string }[] = [
    { labelInFlags: 'Fridag',              expectedTooltip: 'Fridag' },
    { labelInFlags: 'Ferie',               expectedTooltip: 'Ferie' },
    { labelInFlags: 'Syg',                 expectedTooltip: 'Syg' },
    { labelInFlags: 'Kursus',              expectedTooltip: 'Kursus' },
    { labelInFlags: 'Orlov',               expectedTooltip: 'Orlov' },
    { labelInFlags: 'Barns 1. sygedag',    expectedTooltip: 'Barns 1. sygedag' },
    { labelInFlags: 'Barns 2. sygedag',    expectedTooltip: 'Barns 2. sygedag' },
    { labelInFlags: 'Ferie fridag',        expectedTooltip: 'Ferie fridag' },
    { labelInFlags: 'Helligdag',           expectedTooltip: 'Helligdag' },
    { labelInFlags: 'Afspadsering',        expectedTooltip: 'Afspadsering' },
    { labelInFlags: 'Barselsorlov',        expectedTooltip: 'Barselsorlov' },
  ];

  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();

    pluginPage.Navbar.goToPluginsPage();
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });

    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('plannings-index');
    cy.get('#plugin-settings-link0').click({ force: true });

    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.wait('@plannings-index', { timeout: 60000 });
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');

    cy.get('mat-toolbar > div > button .mat-mdc-button-persistent-ripple')
      .first()
      .parent()
      .click();

    cy.get('#workingHoursSite').clear().type(testSiteSearchText);
    cy.get('.ng-option.ng-option-marked').click();

    cy.wait('@plannings-index', { timeout: 60000 });
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
  });

  it('should set and persist all leave policies in dashboard planning table', () => {
    const dayCellSelector = '#cell0_0';

    leavePolicies.forEach(({ labelInFlags, expectedTooltip }) => {
      cy.get(dayCellSelector).click({ force: true });

      cy.get('#flags').scrollIntoView();

      cy.get('#flags mat-checkbox').each(($checkbox) => {
        cy.wrap($checkbox)
          .find('input[type="checkbox"]')
          .then(($input) => {
            if ($input.prop('checked')) {
              cy.wrap($checkbox).click({ force: true, animationDistanceThreshold: 1 });
            }
          });
      });

      cy.get('#flags mat-checkbox .mdc-label')
        .contains(labelInFlags)
        .scrollIntoView()
        .click({ force: true, animationDistanceThreshold: 1 });

      cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('planning-save');
      cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('plannings-index-after-save');

      cy.get('#saveButton')
        .scrollIntoView()
        .click({ force: true, animationDistanceThreshold: 1 });

      cy.wait('@planning-save', { timeout: 60000 });
      cy.wait('@plannings-index-after-save', { timeout: 60000 });
      cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');

      cy.wait(1000);

      cy.get(dayCellSelector)
        .scrollIntoView()
        .find('.plan-icons mat-icon.mat-mdc-tooltip-trigger')
        .first()
        .scrollIntoView()
        .trigger('mouseover', { force: true });

      cy.wait(1000);

      cy.get(dayCellSelector)
        .scrollIntoView()
        .find('.plan-icons mat-icon.mat-mdc-tooltip-trigger')
        .first()
        .scrollIntoView()
        .invoke('attr', 'aria-describedby')
        .then((tooltipId) => {
          expect(tooltipId, 'tooltip id should be set on icon')
            .to.be.a('string')
            .and.not.be.empty;

          cy.wait(500);

          cy.get(`#${tooltipId}`)
            .should('exist')
            .then(($tooltip) => {
              const text = $tooltip.text().trim();
              expect(text).to.contain(expectedTooltip);
            });
        });

      cy.wait(1000);
    });
  });
});
