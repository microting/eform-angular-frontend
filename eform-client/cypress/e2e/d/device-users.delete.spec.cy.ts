import loginPage from '../Login.page';
import deviceUsersPage from '../DeviceUsers.page';
import { Guid } from 'guid-typescript';
import { expect } from 'chai';

describe('Device users page - Delete device user', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('POST', '**/api/device-users/index').as('loadDeviceUsers');
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.wait('@loadDeviceUsers', { timeout: 30000 });

    // Create a test user to delete
    const firstName = Guid.create().toString();
    const lastName = Guid.create().toString();
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible').click();
    cy.get('#firstName').should('be.visible').type(firstName);
    cy.get('#lastName').should('be.visible').type(lastName);
    
    cy.intercept('POST', '**/api/device-users/create').as('createUser');
    cy.get('#saveCreateBtn').should('be.visible').click();
    cy.wait('@createUser', { timeout: 30000 });
    cy.get('#newDeviceUserBtn').should('be.visible');
  });

  it('should not delete device user if cancel was clicked', () => {
    // Ensure table is visible before counting rows
    cy.get('tbody > tr', { timeout: 10000 }).should('have.length.gt', 0);
    
    deviceUsersPage.rowNum().then((rowNumBeforeDelete) => {
      cy.get('#deviceUserId').should('be.visible');

      // Click delete button on last row
      cy.get('#deleteDeviceUserBtn').last().should('be.visible').click();
      cy.get('#cancelDeleteBtn').should('be.visible').click();

      // Navigate back to device users page
      cy.intercept('POST', '**/api/device-users/index').as('reloadList');
      deviceUsersPage.Navbar.goToDeviceUsersPage();
      cy.wait('@reloadList', { timeout: 30000 });
      
      // Ensure table is visible before counting rows
      cy.get('tbody > tr', { timeout: 10000 }).should('have.length.gt', 0);

      // Verify count hasn't changed
      deviceUsersPage.rowNum().then((rowNumAfterCancelDelete) => {
        expect(rowNumBeforeDelete).to.equal(rowNumAfterCancelDelete);
      });
    });
  });

  it('should delete device user successfully', () => {
    cy.intercept('POST', '**/api/device-users/index').as('loadDeviceUsers1');
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.wait('@loadDeviceUsers1', { timeout: 30000 });
    
    // Ensure table is visible before counting rows
    cy.get('tbody > tr', { timeout: 10000 }).should('have.length.gt', 0);

    deviceUsersPage.rowNum().then((rowNumBeforeDelete) => {
      cy.get('#deviceUserId').should('be.visible');

      // Click delete button on last row
      cy.intercept('POST', '**/api/device-users/delete').as('deleteUser');
      cy.intercept('POST', '**/api/device-users/index').as('reloadAfterDelete');
      cy.get('#deleteDeviceUserBtn').last().should('be.visible').click();
      cy.get('#saveDeleteBtn').should('be.visible').click();
      cy.wait('@deleteUser', { timeout: 30000 });
      cy.wait('@reloadAfterDelete', { timeout: 30000 });

      // Navigate back to device users page
      cy.intercept('POST', '**/api/device-users/index').as('loadDeviceUsers2');
      deviceUsersPage.Navbar.goToDeviceUsersPage();
      cy.wait('@loadDeviceUsers2', { timeout: 30000 });
      
      // Ensure table is visible before counting rows
      cy.get('tbody > tr', { timeout: 10000 }).should('have.length.gt', 0);

      // Verify count decreased
      deviceUsersPage.rowNum().then((rowNumAfterDelete) => {
        expect(rowNumBeforeDelete, 'User deleted incorrectly').to.equal(
          rowNumAfterDelete + 1
        );
      });
    });
  });
});
