export default class Page {
  constructor() {}

  open(path) {
    cy.visit(path);
  }

  spinnerAnimation() {
    return cy.get('#spinner-animation');
  }

  waitForSpinnerHide(timeout = 90000) {
    cy.waitUntil(() => cy.get('#spinner-animation').should('not.exist'), { timeout: timeout });
  }

  waitForSpinnerShow(timeout = 90000) {
    cy.waitUntil(() => cy.get('#spinner-animation').should('exist'), { timeout: timeout });
  }
}
