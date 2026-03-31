import loginPage from '../Login.page';
import workersPage from '../Workers.page';
import deviceUsersPage from '../DeviceUsers.page';
import { Guid } from 'guid-typescript';
import { expect } from 'chai';

const deviceUserFirstName = Guid.create().toString();
const deviceUserLastName = Guid.create().toString();
const deviceUserFullName = `${deviceUserFirstName} ${deviceUserLastName}`;

describe('Workers page - Edit worker', function () {
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
    
    // Navigate to Workers page and create a test worker
    cy.intercept('POST', '**/api/workers/index').as('loadWorkers');
    workersPage.Navbar.goToWorkers();
    cy.wait('@loadWorkers', { timeout: 30000 });
    cy.get('#workerCreateBtn', { timeout: 10000 }).should('be.visible');
    
    const initialFirstName = Guid.create().toString();
    const initialLastName = Guid.create().toString();
    
    cy.get('#workerCreateBtn').should('be.visible').click();
    cy.get('#firstName').should('be.visible');
    cy.get('#workerSelector').should('be.visible').click();
    cy.wait(500);
    cy.contains('.custom', deviceUserFullName).should('be.visible').click();
    cy.wait(500);
    cy.get('#firstName').should('be.visible').type(initialFirstName);
    cy.get('#lastName').should('be.visible').type(initialLastName);
    cy.wait(500);
    
    cy.intercept('POST', '**/api/workers/create').as('createWorker');
    cy.get('#workerSaveBtn').should('be.visible').click();
    cy.wait('@createWorker', { timeout: 30000 });
    cy.get('#workerCreateBtn').should('be.visible');
  });

  it('should edit worker\'s first name and last name', () => {
    const newFirstName = 'Foo';
    const newLastName = 'Bar';

    cy.get('[id^="workerFirstName-"]').should('be.visible');

    // Get last worker data before edit
    cy.get('[id^="workerFirstName-"]').last().invoke('text').then((oldFirstName) => {
      // Open action menu and click edit button on last row
      cy.get('[id^=action-items-] #actionMenu').last().should('be.visible').click();
      cy.wait(200);
      cy.get('[id^=workerEditBtn]').last().should('be.visible').click();
      cy.get('#firstName').should('be.visible');

      // Edit both fields
      cy.get('#firstName').clear().type(newFirstName);
      cy.get('#lastName').clear().type(newLastName);
      cy.wait(500);
      
      cy.intercept('POST', '**/api/workers/update').as('updateWorker');
      cy.get('#workerEditSaveBtn').should('be.visible').click();
      cy.wait('@updateWorker', { timeout: 30000 });
      cy.get('#workerCreateBtn').should('be.visible');

      // Verify changes
      cy.get('[id^="workerFirstName-"]').last().should('have.text', newFirstName);
      cy.get('[id^="workerLastName-"]').last().should('have.text', newLastName);
    });
  });

  it('should edit worker with special characters', () => {
    const newFirstName = 'tóíǻøæ';
    const newLastName = '¡@£$½';

    cy.get('[id^="workerFirstName-"]').should('be.visible');

    // Open action menu and click edit button on last row
    cy.get('[id^=action-items-] #actionMenu').last().should('be.visible').click();
    cy.wait(200);
    cy.get('[id^=workerEditBtn]').last().should('be.visible').click();
    cy.get('#firstName').should('be.visible');

    // Edit both fields with special characters
    cy.get('#firstName').clear().type(newFirstName);
    cy.get('#lastName').clear().type(newLastName);
    cy.wait(500);
    
    cy.intercept('POST', '**/api/workers/update').as('updateWorker');
    cy.get('#workerEditSaveBtn').should('be.visible').click();
    cy.wait('@updateWorker', { timeout: 30000 });
    cy.get('#workerCreateBtn').should('be.visible');

    // Verify changes
    cy.get('[id^="workerFirstName-"]').last().should('have.text', newFirstName);
    cy.get('[id^="workerLastName-"]').last().should('have.text', newLastName);
  });

  it('should not change worker if cancel was clicked', () => {
    const newFirstName = Guid.create().toString();
    const newLastName = Guid.create().toString();

    // Get count and data before edit
    workersPage.rowNum().then((rowNumBeforeEdit) => {
      cy.get('[id^="workerFirstName-"]').last().invoke('text').then((oldFirstName) => {
        cy.get('[id^="workerLastName-"]').last().invoke('text').then((oldLastName) => {

          // Open action menu and click edit button on last row
          cy.get('[id^=action-items-] #actionMenu').last().should('be.visible').click();
          cy.wait(200);
          cy.get('[id^=workerEditBtn]').last().should('be.visible').click();
          cy.get('#firstName').should('be.visible');

          // Try to edit both fields
          cy.get('#firstName').clear().type(newFirstName);
          cy.get('#lastName').clear().type(newLastName);
          cy.wait(500);
          cy.get('#workerCancelEditBtn').should('be.visible').click();
          cy.get('#workerCreateBtn').should('be.visible');

          // Verify no changes occurred
          workersPage.rowNum().then((rowNumAfterEdit) => {
            expect(rowNumBeforeEdit).to.equal(rowNumAfterEdit);
          });

          cy.get('[id^="workerFirstName-"]').last().should('have.text', oldFirstName);
          cy.get('[id^="workerLastName-"]').last().should('have.text', oldLastName);
        });
      });
    });
  });

  after(() => {
    // Clean up: Delete the test worker - open action menu first
    cy.intercept('POST', '**/api/workers/delete').as('deleteWorker');
    cy.get('[id^=action-items-] #actionMenu').last().should('be.visible').click();
    cy.wait(200);
    cy.get('[id^=workerDeleteBtn]').last().should('be.visible').click();
    cy.get('#deleteWorkerDeleteBtn').should('be.visible').click();
    cy.wait('@deleteWorker', { timeout: 30000 });
    cy.wait(500);

    // Clean up: Delete the device user
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.get('#newDeviceUserBtn').should('be.visible');
    
    cy.get('[id^="deviceUserFirstName-"]').each(($el, index) => {
      if ($el.text() === deviceUserFirstName) {
        cy.intercept('POST', '**/api/device-users/delete').as('deleteUser');
        cy.get(`#action-items-${index} #actionMenu`).should('be.visible').click();
        cy.wait(200);
        cy.get(`#deleteDeviceUserBtn${index}`).should('be.visible').click();
        cy.get('#saveDeleteBtn').should('be.visible').click();
        cy.wait('@deleteUser', { timeout: 30000 });
        cy.get('#newDeviceUserBtn').should('be.visible');
        return false; // break the loop
      }
    });
  });
});
