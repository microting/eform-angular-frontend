import loginPage from '../Login.page';
import deviceUsersPage, {
  DeviceUsersRowObject,
} from '../DeviceUsers.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';

const nameDeviceUser = generateRandmString();
let countDeviceUsersBeforeCreating = 0;

describe('Device users page - Add new device user', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('POST', '**/api/device-users/index').as('loadDeviceUsers');
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.wait('@loadDeviceUsers', { timeout: 30000 });
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');
  });

  it('should add new device user with first name and last name', () => {
    const surname = generateRandmString();

    // Count rows (may be 0 if table is empty)
    cy.get('tbody').then(($tbody) => {
      const rowCountBeforeCreation = $tbody.find('tr').length;
      countDeviceUsersBeforeCreating = rowCountBeforeCreation;

      // Create new device user
      cy.get('#newDeviceUserBtn').should('be.visible').click();
      cy.get('#firstName').should('be.visible').type(nameDeviceUser);
      cy.get('#lastName').should('be.visible').type(surname);
      
      cy.intercept('POST', '**/api/device-users/create').as('createUser');
      cy.intercept('POST', '**/api/device-users/index').as('reloadDeviceUsers');
      cy.get('#saveCreateBtn').should('be.visible').should('be.enabled').click();
      cy.wait('@createUser', { timeout: 30000 });
      cy.wait('@reloadDeviceUsers', { timeout: 30000 });
      cy.get('#newDeviceUserBtn').should('be.visible');

      // Verify the user was created
      cy.get('tbody').then(($tbody) => {
        const rowCountAfterCreation = $tbody.find('tr').length;
        expect(
          rowCountAfterCreation,
          'Number of rows hasn\'t changed after creating new user'
        ).to.equal(rowCountBeforeCreation + 1);

        // Verify the last user has correct data
        cy.get('#deviceUserFirstName').last().should('have.text', nameDeviceUser);
        cy.get('#deviceUserLastName').last().should('have.text', surname);
      });
    });
  });
});

describe('Device users page - Should not add new device user', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('POST', '**/api/device-users/index').as('loadDeviceUsers');
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.wait('@loadDeviceUsers', { timeout: 30000 });
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');
  });

  it('should NOT add device user with only first name', () => {
    const name = generateRandmString();

    cy.get('#newDeviceUserBtn').should('be.visible').click();
    cy.get('#firstName').should('be.visible').type(name);

    // Verify save button is disabled
    cy.get('#saveCreateBtn').should('be.disabled');

    cy.get('#cancelCreateBtn').should('be.visible').click();
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');
  });

  it('should NOT add device user with only last name', () => {
    const lastName = generateRandmString();

    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible').click();
    cy.get('#lastName').should('be.visible').type(lastName);

    // Verify save button is disabled
    cy.get('#saveCreateBtn').should('be.disabled');

    cy.get('#cancelCreateBtn').should('be.visible').click();
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');
  });

  it('should NOT add device user without first and last names', () => {
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible').click();
    cy.get('#firstName').should('be.visible');

    // Verify save button is disabled
    cy.get('#saveCreateBtn').should('be.disabled');

    cy.get('#cancelCreateBtn').should('be.visible').click();
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');
  });

  it('should NOT create user if cancel was clicked', () => {
    // Count rows (may be 0 if table is empty at start)
    cy.get('tbody').then(($tbody) => {
      const rowCountBeforeCreation = $tbody.find('tr').length;

      cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible').click();
      cy.get('#firstName').should('be.visible');
      cy.get('#cancelCreateBtn').should('be.visible').click();
      cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');

      cy.get('tbody').then(($tbody2) => {
        const rowCountAfterCreation = $tbody2.find('tr').length;
        expect(
          rowCountAfterCreation,
          'Number of rows has changed after cancel'
        ).to.equal(rowCountBeforeCreation);
      });
    });
  });

  it('should clean up created test data', () => {
    // Check if there are any rows to clean up
    cy.get('tbody').then(($tbody) => {
      if ($tbody.find('tr').length > 0) {
        // Find and delete the test user
        cy.get('#deviceUserFirstName').each(($el, index) => {
          if ($el.text() === nameDeviceUser) {
            cy.intercept('POST', '**/api/device-users/delete').as('deleteUser');
            cy.intercept('POST', '**/api/device-users/index').as('reloadDeviceUsers');
            cy.get('#deleteDeviceUserBtn').eq(index).click();
            cy.get('#saveDeleteBtn').should('be.visible').click();
            cy.wait('@deleteUser', { timeout: 30000 });
            cy.wait('@reloadDeviceUsers', { timeout: 30000 });
            cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');
            return false; // break the loop
          }
        });
      }

      // Verify count is back to original
      cy.get('tbody').then(($tbody2) => {
        const currentCount = $tbody2.find('tr').length;
        expect(currentCount).to.equal(countDeviceUsersBeforeCreating);
      });
    });
  });
});
