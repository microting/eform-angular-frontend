import { Navbar } from './Navbar.page';
import loginConstants from '../../e2e/Constants/LoginConstants';

export class PasswordSettingsPage {
  public Navbar = new Navbar();

  oldPasswordField() {
    return cy.get('#oldPassword');
  }

  newPasswordField() {
    return cy.get('#newPassword');
  }

  newPasswordConfirmationField() {
    return cy.get('#newPasswordConfirmation');
  }

  saveBtn() {
    return cy.get('#changePasswordSaveBtn');
  }

  setNewPassword(oldPassword = loginConstants.password, newPassword = loginConstants.newPassword) {
    this.oldPasswordField().should('be.visible').clear().type(oldPassword);
    cy.wait(500);
    this.newPasswordField().should('be.visible').clear().type(newPassword);
    cy.wait(500);
    this.newPasswordConfirmationField().should('be.visible').clear().type(newPassword);
    cy.wait(500);
    cy.intercept('PUT', '**/api/auth/change-password').as('changePassword');
    this.saveBtn().should('be.visible').should('be.enabled').click();
    cy.wait('@changePassword', { timeout: 10000 });
    cy.get('#spinner-animation').should('not.exist');
    cy.wait(500);
  }

  revertToOldPassword(oldPassword = loginConstants.newPassword, newPassword = loginConstants.password) {
    this.oldPasswordField().should('be.visible').clear().type(oldPassword);
    cy.wait(500);
    this.newPasswordField().should('be.visible').clear().type(newPassword);
    cy.wait(500);
    this.newPasswordConfirmationField().should('be.visible').clear().type(newPassword);
    cy.wait(500);
    cy.intercept('PUT', '**/api/auth/change-password').as('changePassword');
    this.saveBtn().should('be.visible').should('be.enabled').click();
    cy.wait('@changePassword', { timeout: 10000 });
    cy.get('#spinner-animation').should('not.exist');
    cy.wait(500);
  }
}

const passwordSettingsPage = new PasswordSettingsPage();
export default passwordSettingsPage;
