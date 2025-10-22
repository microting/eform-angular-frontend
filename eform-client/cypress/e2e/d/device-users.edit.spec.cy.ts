import loginPage from '../Login.page';
import deviceUsersPage from '../DeviceUsers.page';
import { Guid } from 'guid-typescript';
import { expect } from 'chai';

describe('Device users page - Edit device user', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    deviceUsersPage.Navbar.goToDeviceUsersPage();
    
    // Create a test user
    const firstName = Guid.create().toString();
    const lastName = Guid.create().toString();
    cy.get('#newDeviceUserBtn').should('be.visible').click();
    cy.get('#firstName').should('be.visible').type(firstName);
    cy.get('#lastName').should('be.visible').type(lastName);
    cy.get('#saveCreateBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist');
    cy.get('#newDeviceUserBtn').should('be.visible');
  });

  it('should edit device user\'s first name', () => {
    const newName = Guid.create().toString();
    
    cy.get('#deviceUserFirstName').should('be.visible');
    
    // Get last device user data before edit
    cy.get('#deviceUserFirstName').last().invoke('text').then((oldFirstName) => {
      cy.get('#deviceUserLastName').last().invoke('text').then((oldLastName) => {
        
        // Click edit button on last row
        cy.get('#editDeviceUserBtn').last().should('be.visible').click();
        cy.get('#firstName').should('be.visible');
        
        // Edit first name
        cy.get('#firstName').clear().type(newName);
        cy.get('#saveEditBtn').should('be.visible').click();
        cy.get('#spinner-animation').should('not.exist');
        cy.get('#newDeviceUserBtn').should('be.visible');
        
        // Verify changes
        cy.get('#deviceUserFirstName').last().should('have.text', newName);
        cy.get('#deviceUserLastName').last().should('have.text', oldLastName);
      });
    });
  });

  it('should edit device user\'s last name', () => {
    const newSurname = Guid.create().toString();
    
    cy.get('#deviceUserFirstName').should('be.visible');
    
    // Get last device user data before edit
    cy.get('#deviceUserFirstName').last().invoke('text').then((oldFirstName) => {
      
      // Click edit button on last row
      cy.get('#editDeviceUserBtn').last().should('be.visible').click();
      cy.get('#firstName').should('be.visible');
      
      // Edit last name
      cy.get('#lastName').clear().type(newSurname);
      cy.get('#saveEditBtn').should('be.visible').click();
      cy.get('#spinner-animation').should('not.exist');
      cy.get('#newDeviceUserBtn').should('be.visible');
      
      // Verify changes
      cy.get('#deviceUserFirstName').last().should('have.text', oldFirstName);
      cy.get('#deviceUserLastName').last().should('have.text', newSurname);
    });
  });

  it('should edit both first name and last name', () => {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    
    cy.get('#deviceUserFirstName').should('be.visible');
    
    // Click edit button on last row
    cy.get('#editDeviceUserBtn').last().should('be.visible').click();
    cy.get('#firstName').should('be.visible');
    
    // Edit both fields
    cy.get('#firstName').clear().type(newName);
    cy.get('#lastName').clear().type(newSurname);
    cy.get('#saveEditBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist');
    cy.get('#newDeviceUserBtn').should('be.visible');
    
    // Verify changes
    cy.get('#deviceUserFirstName').last().should('have.text', newName);
    cy.get('#deviceUserLastName').last().should('have.text', newSurname);
  });

  it('should not change first name and last name if cancel was clicked', () => {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    
    // Get count and data before edit
    deviceUsersPage.rowNum().then((rowNumBeforeEdit) => {
      cy.get('#deviceUserFirstName').last().invoke('text').then((oldFirstName) => {
        cy.get('#deviceUserLastName').last().invoke('text').then((oldLastName) => {
          
          // Click edit button on last row
          cy.get('#editDeviceUserBtn').last().should('be.visible').click();
          cy.get('#firstName').should('be.visible');
          
          // Try to edit both fields
          cy.get('#firstName').clear().type(newName);
          cy.get('#lastName').clear().type(newSurname);
          cy.get('#cancelEditBtn').should('be.visible').click();
          cy.get('#newDeviceUserBtn').should('be.visible');
          
          // Verify no changes occurred
          deviceUsersPage.rowNum().then((rowNumAfterEdit) => {
            expect(rowNumBeforeEdit).to.equal(rowNumAfterEdit);
          });
          
          cy.get('#deviceUserFirstName').last().should('have.text', oldFirstName);
          cy.get('#deviceUserLastName').last().should('have.text', oldLastName);
        });
      });
    });
  });
});
