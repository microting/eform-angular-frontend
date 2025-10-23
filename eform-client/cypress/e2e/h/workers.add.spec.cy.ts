import loginPage from '../Login.page';
import workersPage from '../Workers.page';
import deviceUsersPage from '../DeviceUsers.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';

const deviceUserFirstName = generateRandmString();
const deviceUserLastName = generateRandmString();
const deviceUserFullName = `${deviceUserFirstName} ${deviceUserLastName}`;
let countWorkersBeforeCreating = 0;

describe('Workers page - Add new worker', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    
    // First, create a device user that will be associated with the worker
    cy.intercept('POST', '**/api/device-users/index').as('loadDeviceUsers');
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.wait('@loadDeviceUsers', { timeout: 30000 });
    cy.get('#newDeviceUserBtn', { timeout: 10000 }).should('be.visible');
    deviceUsersPage.createNewDeviceUser(deviceUserFirstName, deviceUserLastName);
    cy.wait(1000);
    
    // Navigate to Workers page
    cy.intercept('POST', '**/api/workers/index').as('loadWorkers');
    workersPage.Navbar.goToWorkers();
    cy.wait('@loadWorkers', { timeout: 30000 });
    cy.get('#workerCreateBtn', { timeout: 10000 }).should('be.visible');
  });

  it('should add new worker with first and last name', () => {
    const firstName = 'Monty';
    const lastName = 'Python';

    workersPage.rowNum().then((rowCountBeforeCreation) => {
      countWorkersBeforeCreating = rowCountBeforeCreation;

      // Create new worker
      cy.get('#workerCreateBtn').should('be.visible').click();
      cy.get('#firstName').should('be.visible');
      
      // Select device user from dropdown
      cy.get('#workerSelector').should('be.visible').click();
      cy.wait(500);
      cy.contains('.custom', deviceUserFullName).should('be.visible').click();
      cy.wait(500);
      
      // Fill in worker details
      cy.get('#firstName').should('be.visible').type(firstName);
      cy.get('#lastName').should('be.visible').type(lastName);
      cy.wait(500);
      
      cy.intercept('POST', '**/api/workers/create').as('createWorker');
      cy.get('#workerSaveBtn').should('be.visible').should('be.enabled').click();
      cy.wait('@createWorker', { timeout: 30000 });
      cy.get('#workerCreateBtn').should('be.visible');

      // Verify the worker was created
      workersPage.rowNum().then((rowCountAfterCreation) => {
        expect(
          rowCountAfterCreation,
          'Number of rows hasn\'t changed after creating new worker'
        ).to.equal(rowCountBeforeCreation + 1);

        // Verify the last worker has correct data
        cy.get('#workerFirstName').last().should('have.text', firstName);
        cy.get('#workerLastName').last().should('have.text', lastName);
      });
    });
  });

  it('should add new worker with special characters', () => {
    const firstName = 'René';
    const lastName = 'Éhl©µ';

    workersPage.rowNum().then((rowCountBeforeCreation) => {
      // Create new worker
      cy.get('#workerCreateBtn').should('be.visible').click();
      cy.get('#firstName').should('be.visible');
      
      // Select device user from dropdown
      cy.get('#workerSelector').should('be.visible').click();
      cy.wait(500);
      cy.contains('.custom', deviceUserFullName).should('be.visible').click();
      cy.wait(500);
      
      // Fill in worker details
      cy.get('#firstName').should('be.visible').type(firstName);
      cy.get('#lastName').should('be.visible').type(lastName);
      cy.wait(500);
      
      cy.intercept('POST', '**/api/workers/create').as('createWorker');
      cy.get('#workerSaveBtn').should('be.visible').should('be.enabled').click();
      cy.wait('@createWorker', { timeout: 30000 });
      cy.get('#workerCreateBtn').should('be.visible');

      // Verify the worker was created
      workersPage.rowNum().then((rowCountAfterCreation) => {
        expect(
          rowCountAfterCreation,
          'Number of rows hasn\'t changed after creating new worker'
        ).to.equal(rowCountBeforeCreation + 1);

        // Verify the last worker has correct data
        cy.get('#workerFirstName').last().should('have.text', firstName);
        cy.get('#workerLastName').last().should('have.text', lastName);
      });
    });
  });

  it('should clean up created test data', () => {
    // Delete all created workers (in reverse order)
    workersPage.rowNum().then((currentRows) => {
      const workersToDelete = currentRows - countWorkersBeforeCreating;
      
      for (let i = 0; i < workersToDelete; i++) {
        // Always delete the last worker
        cy.intercept('POST', '**/api/workers/delete').as('deleteWorker');
        cy.get('#workerDeleteBtn').last().should('be.visible').click();
        cy.get('#saveDeleteBtn').should('be.visible').click();
        cy.wait('@deleteWorker', { timeout: 30000 });
        cy.wait(500);
      }
      
      // Verify count is back to original
      workersPage.rowNum().then((finalCount) => {
        expect(finalCount).to.equal(countWorkersBeforeCreating);
      });
    });

    // Clean up the device user
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.get('#newDeviceUserBtn').should('be.visible');
    
    cy.get('#deviceUserFirstName').each(($el, index) => {
      if ($el.text() === deviceUserFirstName) {
        cy.intercept('POST', '**/api/device-users/delete').as('deleteUser');
        cy.get('#deleteDeviceUserBtn').eq(index).click();
        cy.get('#saveDeleteBtn').should('be.visible').click();
        cy.wait('@deleteUser', { timeout: 30000 });
        cy.get('#newDeviceUserBtn').should('be.visible');
        return false; // break the loop
      }
    });
  });
});
