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
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.get('#newDeviceUserBtn').should('be.visible');
    deviceUsersPage.createNewDeviceUser(deviceUserFirstName, deviceUserLastName);
    cy.wait(1000);
    
    // Navigate to Workers page and create a test worker
    workersPage.Navbar.goToWorkers();
    cy.get('#workerCreateBtn').should('be.visible');
    
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
    cy.get('#workerSaveBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist');
    cy.get('#workerCreateBtn').should('be.visible');
  });

  it('should edit worker\'s first name and last name', () => {
    const newFirstName = 'Foo';
    const newLastName = 'Bar';

    cy.get('#workerFirstName').should('be.visible');

    // Get last worker data before edit
    cy.get('#workerFirstName').last().invoke('text').then((oldFirstName) => {
      // Click edit button on last row
      cy.get('#workerEditBtn').last().should('be.visible').click();
      cy.get('#firstNameEdit').should('be.visible');

      // Edit both fields
      cy.get('#firstNameEdit').clear().type(newFirstName);
      cy.get('#lastNameEdit').clear().type(newLastName);
      cy.wait(500);
      cy.get('#workerEditSaveBtn').should('be.visible').click();
      cy.get('#spinner-animation').should('not.exist');
      cy.get('#workerCreateBtn').should('be.visible');

      // Verify changes
      cy.get('#workerFirstName').last().should('have.text', newFirstName);
      cy.get('#workerLastName').last().should('have.text', newLastName);
    });
  });

  it('should edit worker with special characters', () => {
    const newFirstName = 'tóíǻøæ';
    const newLastName = '¡@£$½';

    cy.get('#workerFirstName').should('be.visible');

    // Click edit button on last row
    cy.get('#workerEditBtn').last().should('be.visible').click();
    cy.get('#firstNameEdit').should('be.visible');

    // Edit both fields with special characters
    cy.get('#firstNameEdit').clear().type(newFirstName);
    cy.get('#lastNameEdit').clear().type(newLastName);
    cy.wait(500);
    cy.get('#workerEditSaveBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist');
    cy.get('#workerCreateBtn').should('be.visible');

    // Verify changes
    cy.get('#workerFirstName').last().should('have.text', newFirstName);
    cy.get('#workerLastName').last().should('have.text', newLastName);
  });

  it('should not change worker if cancel was clicked', () => {
    const newFirstName = Guid.create().toString();
    const newLastName = Guid.create().toString();

    // Get count and data before edit
    workersPage.rowNum().then((rowNumBeforeEdit) => {
      cy.get('#workerFirstName').last().invoke('text').then((oldFirstName) => {
        cy.get('#workerLastName').last().invoke('text').then((oldLastName) => {

          // Click edit button on last row
          cy.get('#workerEditBtn').last().should('be.visible').click();
          cy.get('#firstNameEdit').should('be.visible');

          // Try to edit both fields
          cy.get('#firstNameEdit').clear().type(newFirstName);
          cy.get('#lastNameEdit').clear().type(newLastName);
          cy.wait(500);
          cy.get('#cancelEditBtn').should('be.visible').click();
          cy.get('#workerCreateBtn').should('be.visible');

          // Verify no changes occurred
          workersPage.rowNum().then((rowNumAfterEdit) => {
            expect(rowNumBeforeEdit).to.equal(rowNumAfterEdit);
          });

          cy.get('#workerFirstName').last().should('have.text', oldFirstName);
          cy.get('#workerLastName').last().should('have.text', oldLastName);
        });
      });
    });
  });

  after(() => {
    // Clean up: Delete the test worker
    cy.get('#workerDeleteBtn').last().should('be.visible').click();
    cy.get('#saveDeleteBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist');
    cy.wait(500);

    // Clean up: Delete the device user
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    cy.get('#newDeviceUserBtn').should('be.visible');
    
    cy.get('#deviceUserFirstName').each(($el, index) => {
      if ($el.text() === deviceUserFirstName) {
        cy.get('#deleteDeviceUserBtn').eq(index).click();
        cy.get('#saveDeleteBtn').should('be.visible').click();
        cy.get('#spinner-animation').should('not.exist');
        cy.get('#newDeviceUserBtn').should('be.visible');
        return false; // break the loop
      }
    });
  });
});
