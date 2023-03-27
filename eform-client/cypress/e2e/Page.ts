export default class Page {
  constructor() {}

  open(path) {
    cy.visit(path);
  }

  async spinnerAnimation() {
    return cy.get('#spinner-animation');
  }

  async waitForSpinnerHide(timeout = 90000) {
    await cy.waitUntil(() => cy.get('#spinner-animation').should('not.exist'), { timeout: timeout });
  }

  async waitForSpinnerShow(timeout = 90000) {
    await cy.waitUntil(() => cy.get('#spinner-animation').should('exist'), { timeout: timeout });
  }
}
