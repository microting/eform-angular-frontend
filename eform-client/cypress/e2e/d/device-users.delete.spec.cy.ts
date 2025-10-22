import loginPage from '../Login.page';
import deviceUsersPage from '../DeviceUsers.page';
import { Guid } from 'guid-typescript';
import { expect } from 'chai';

describe('Device users page - Delete device user', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    deviceUsersPage.Navbar.goToDeviceUsersPage();

    // Create a test user to delete
    const firstName = Guid.create().toString();
    const lastName = Guid.create().toString();
    cy.get('#newDeviceUserBtn').should('be.visible').click();
    cy.get('#firstName').should('be.visible').type(firstName);
    cy.get('#lastName').should('be.visible').type(lastName);
    cy.get('#saveCreateBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist');
    cy.get('#newDeviceUserBtn').should('be.visible');
  });

  it('should not delete device user if cancel was clicked', () => {
    deviceUsersPage.rowNum().then((rowNumBeforeDelete) => {
      cy.get('#deviceUserId').should('be.visible');

      // Click delete button on last row
      cy.get('#deleteDeviceUserBtn').last().should('be.visible').click();
      cy.get('#cancelDeleteBtn').should('be.visible').click();

      // Navigate back to device users page
      deviceUsersPage.Navbar.goToDeviceUsersPage();

      // Verify count hasn't changed
      deviceUsersPage.rowNum().then((rowNumAfterCancelDelete) => {
        expect(rowNumBeforeDelete).to.equal(rowNumAfterCancelDelete);
      });
    });
  });

  it('should delete device user successfully', () => {
    deviceUsersPage.Navbar.goToDeviceUsersPage();

    deviceUsersPage.rowNum().then((rowNumBeforeDelete) => {
      cy.get('#deviceUserId').should('be.visible');

      // Click delete button on last row
      cy.get('#deleteDeviceUserBtn').last().should('be.visible').click();
      cy.get('#saveDeleteBtn').should('be.visible').click();
      cy.get('#spinner-animation').should('not.exist');

      // Navigate back to device users page
      deviceUsersPage.Navbar.goToDeviceUsersPage();

      // Verify count decreased
      deviceUsersPage.rowNum().then((rowNumAfterDelete) => {
        expect(rowNumBeforeDelete, 'User deleted incorrectly').to.equal(
          rowNumAfterDelete + 1
        );
      });
    });
  });
});
