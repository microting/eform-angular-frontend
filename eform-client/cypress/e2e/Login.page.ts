import loginConstants from '../../e2e/Constants/LoginConstants';

class LoginPage {

  getMainText() {
    return cy.get('#loginMainText');
  }

  getSecondaryText() {
    return cy.get('#loginSecondaryText');
  }

  getImage() {
    return cy.get('#loginImage');
  }

  getUsernameInput() {
    return cy.get('#username').as('usernameInput');
  }

  getPasswordInput() {
    return cy.get('#password').as('passwordInput');
  }

  getLoginButton() {
    return cy.get('#loginBtn');
  }

  login(username = loginConstants.username, password = loginConstants.password) {
    this.getUsernameInput().type(username);
    this.getPasswordInput().type(password);
    this.getLoginButton().click();
    cy.wait(5000);
    cy.get('#newEFormBtn').should('be.visible');
  }

  loginWithNewPassword() {
    this.getUsernameInput().type(loginConstants.username);
    this.getPasswordInput().type(loginConstants.newPassword);
    this.getLoginButton().click();
    cy.get('#newEFormBtn').should('be.visible');
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const loginPage = new LoginPage();
export default loginPage;
