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

    deviceUsersPage.rowNum().then((rowCountBeforeCreation) => {
      countDeviceUsersBeforeCreating = rowCountBeforeCreation;

      // Create new device user
      cy.get('#newDeviceUserBtn').should('be.visible').click();
      cy.get('#firstName').should('be.visible').type(nameDeviceUser);
      cy.get('#lastName').should('be.visible').type(surname);
      cy.get('#saveCreateBtn').should('be.visible').should('be.enabled').click();
      cy.get('#spinner-animation').should('not.exist');
      cy.get('#newDeviceUserBtn').should('be.visible');

      // Verify the user was created
      deviceUsersPage.rowNum().then((rowCountAfterCreation) => {
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
    cy.wait(500);
  });

  it('should NOT add device user with only last name', () => {
    const lastName = generateRandmString();

    cy.get('#newDeviceUserBtn').should('be.visible').click();
    cy.get('#lastName').should('be.visible').type(lastName);

    // Verify save button is disabled
    cy.get('#saveCreateBtn').should('be.disabled');

    cy.get('#cancelCreateBtn').should('be.visible').click();
    cy.wait(500);
  });

  it('should NOT add device user without first and last names', () => {
    cy.get('#newDeviceUserBtn').should('be.visible').click();
    cy.get('#firstName').should('be.visible');

    // Verify save button is disabled
    cy.get('#saveCreateBtn').should('be.disabled');

    cy.get('#cancelCreateBtn').should('be.visible').click();
    cy.wait(500);
  });

  it('should NOT create user if cancel was clicked', () => {
    deviceUsersPage.rowNum().then((rowCountBeforeCreation) => {
      cy.get('#newDeviceUserBtn').should('be.visible').click();
      cy.get('#firstName').should('be.visible');
      cy.wait(500);
      cy.get('#cancelCreateBtn').should('be.visible').click();
      cy.get('#newDeviceUserBtn').should('be.visible');
      cy.wait(500);

      deviceUsersPage.rowNum().then((rowCountAfterCreation) => {
        expect(
          rowCountAfterCreation,
          'Number of rows has changed after cancel'
        ).to.equal(rowCountBeforeCreation);
      });
    });
  });

  it('should clean up created test data', () => {
    // Find and delete the test user
    cy.get('#deviceUserFirstName').each(($el, index) => {
      if ($el.text() === nameDeviceUser) {
        cy.get('#deleteDeviceUserBtn').eq(index).click();
        cy.get('#saveDeleteBtn').should('be.visible').click();
        cy.get('#spinner-animation').should('not.exist');
        cy.get('#newDeviceUserBtn').should('be.visible');
        return false; // break the loop
      }
    });

    // Verify count is back to original
    deviceUsersPage.rowNum().then((currentCount) => {
      expect(currentCount).to.equal(countDeviceUsersBeforeCreating);
    });
  });
});
