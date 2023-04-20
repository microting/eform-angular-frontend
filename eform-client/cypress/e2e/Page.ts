export default class Page {
  constructor() {
  }

  open(path) {
    cy.visit(path);
  }

  spinnerAnimation() {
    return cy.get('#spinner-animation');
  }

  waitForSpinnerHide(timeout = 10000) {
    if (this.spinnerAnimation().should('exist')) {
      this.spinnerAnimation().should('not.exist');
      return;
    }
    this.spinnerAnimation().should('not.exist');
  }

  waitForSpinnerShow(timeout = 90000) {
    if (this.spinnerAnimation().should('not.exist')) {
      this.spinnerAnimation().should('exist');
      return;
    }
    this.spinnerAnimation().should('exist');
  }
}
