import { PageWithNavbarPage } from './PageWithNavbar.page';
import { expect } from 'chai';

export interface UserAdministrationObject {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  group?: string;
  password?: string;
}

class UserAdministrationPage extends PageWithNavbarPage {
  newUserBtn() {
    return cy.get('#createNewUserBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  // Edit user fields
  editFirstNameInput() {
    return cy.get('#editFirstName')
      .should('be.visible');
  }

  editLastNameInput() {
    return cy.get('#editLastName')
      .should('be.visible');
  }

  editEmailInput() {
    return cy.get('#emailEdit')
      .should('be.visible');
  }

  editRoleSelect() {
    return cy.get('#editRole')
      .should('be.visible');
  }

  editGroupSelect() {
    return cy.get('#editGroup')
      .should('be.visible');
  }

  editPasswordInput() {
    return cy.get('#editPassword')
      .should('be.visible');
  }

  editUserSaveBtn() {
    return cy.get('#editUserSaveBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  editUserCancelBtn() {
    return cy.get('#editUserCancelSaveBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  // Create user fields
  createFirstNameInput() {
    return cy.get('#createFirstName')
      .should('be.visible');
  }

  createLastNameInput() {
    return cy.get('#createLastName')
      .should('be.visible');
  }

  createEmailInput() {
    return cy.get('#createEmail')
      .should('be.visible');
  }

  createRoleSelect() {
    return cy.get('#createRole')
      .should('be.visible');
  }

  createGroupSelect() {
    return cy.get('#createGroup')
      .should('be.visible');
  }

  createPasswordInput() {
    return cy.get('#createPassword')
      .should('be.visible');
  }

  createUserSaveBtn() {
    return cy.get('#createAdministrationUserBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  createUserCancelBtn() {
    return cy.get('#createAdministrationUserCancelBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  // Delete user fields
  userDeleteBtn() {
    return cy.get('#userDeleteBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  userDeleteCancelBtn() {
    return cy.get('#userDeleteCancelBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  // Table operations
  rowNum(): Cypress.Chainable<number> {
    return cy.get('.userAdministrationId')
      .should('have.length.gt', 0)
      .then($rows => $rows.length);
  }

  getUserByNumber(rowNum: number = 1): UserAdministrationRowObject {
    const userObj = new UserAdministrationRowObject();
    userObj.getRow(rowNum);
    return userObj;
  }

  // Helper to create new user
  createNewUser(user: UserAdministrationObject) {
    this.newUserBtn().click();
    cy.wait(500);
    this.createUserCancelBtn().should('be.visible');
    
    if (user.firstName) {
      this.createFirstNameInput().clear().type(user.firstName);
    }
    if (user.lastName) {
      this.createLastNameInput().clear().type(user.lastName);
    }
    if (user.email) {
      this.createEmailInput().clear().type(user.email);
    }
    if (user.password) {
      this.createPasswordInput().clear().type(user.password);
    }
    if (user.role) {
      this.createRoleSelect().click();
      cy.get('#createRole input').type(user.role);
      cy.wait(200);
      cy.get('body').type('{enter}');
    }
    if (user.group) {
      this.createGroupSelect().click();
      cy.get('#createGroup input').type(user.group);
      cy.wait(200);
      cy.get('body').type('{enter}');
    }
    
    this.createUserSaveBtn().click();
    cy.get('#spinner-animation').should('not.exist');
    this.newUserBtn().should('be.visible');
  }
}

const userAdministrationPage = new UserAdministrationPage();
export default userAdministrationPage;

export class UserAdministrationRowObject {
  index: number;
  id: number;
  email: string;
  fullName: string;
  role: string;
  editBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  deleteBtn: Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum: number) {
    this.index = rowNum;
    const index = rowNum - 1;
    
    cy.get(`#userAdministrationId-${index}`).invoke('text').then(text => {
      this.id = +text;
    });
    cy.get(`#userAdministrationEmail-${index}`).invoke('text').then(text => {
      this.email = text;
    });
    cy.get(`#userAdministrationFullName-${index}`).invoke('text').then(text => {
      this.fullName = text;
    });
    cy.get(`#userAdministrationRole-${index}`).invoke('text').then(text => {
      this.role = text;
    });
    
    this.editBtn = cy.get(`#userAdministrationEditBtn-${index}`);
    this.deleteBtn = cy.get(`#userAdministrationDeleteBtn-${index}`);
    
    return this;
  }

  openRowMenu() {
    const index = this.index - 1;
    cy.get(`#action-items-${index} #actionMenu`).should('be.visible').click();
    cy.wait(200);
  }

  edit(user: UserAdministrationObject, clickCancel = false) {
    const index = this.index - 1;
    this.openRowMenu();
    cy.get(`#userAdministrationEditBtn-${index}`).should('be.visible').click();
    cy.get('#editFirstName').should('be.visible');
    
    if (user.firstName) {
      cy.get('#editFirstName').clear();
      cy.wait(200);
      cy.get('#editFirstName').type(user.firstName);
      cy.wait(200);
    }
    if (user.lastName) {
      cy.get('#editLastName').clear();
      cy.wait(200);
      cy.get('#editLastName').type(user.lastName);
      cy.wait(200);
    }
    if (user.email) {
      cy.get('#emailEdit').clear();
      cy.wait(200);
      cy.get('#emailEdit').type(user.email);
    }
    if (user.role) {
      cy.get('#editRole').click();
      cy.wait(200);
      cy.get('#editRole input').type(user.role);
      cy.wait(200);
      cy.get('body').type('{enter}');
    }
    if (user.group) {
      cy.get('#editGroup').click();
      cy.wait(200);
      cy.get('#editGroup input').type(user.group);
      cy.wait(200);
      cy.get('body').type('{enter}');
    }
    if (user.password) {
      cy.get('#editPassword').clear();
      cy.wait(200);
      cy.get('#editPassword').type(user.password);
      cy.wait(200);
    }
    
    if (clickCancel) {
      cy.get('#editUserCancelSaveBtn').should('be.visible').click();
    } else {
      cy.get('#editUserSaveBtn').should('be.visible').click();
    }
    
    cy.get('#spinner-animation').should('not.exist');
    // Navigate back to refresh the page
    cy.visit('http://localhost:4200');
    cy.wait(500);
    userAdministrationPage.Navbar.goToUserAdministration();
    cy.get('#createNewUserBtn').should('be.visible');
    cy.wait(500);
  }

  delete(clickCancel = false) {
    const index = this.index - 1;
    this.openRowMenu();
    cy.get(`#userAdministrationDeleteBtn-${index}`).should('be.visible').click();
    cy.get('#userDeleteCancelBtn').should('be.visible');
    
    if (clickCancel) {
      cy.get('#userDeleteCancelBtn').click();
    } else {
      cy.get('#userDeleteBtn').click();
    }
    
    cy.get('#spinner-animation').should('not.exist');
    cy.get('#createNewUserBtn').should('be.visible');
  }
}
