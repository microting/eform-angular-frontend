// Temporarily disabled tests
// import loginPage from '../../../Login.page';

// describe('Break Policies Tests', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:4200');
//     loginPage.login();
//   });

//   const navigateToBreakPolicies = () => {
//     // Navigate using menu (Danish locale: Timeregistrering -> Pausepolitikker)
//     cy.get('#spinner-animation').should('not.exist');
//     cy.contains('Timeregistrering').click();
//     cy.wait(500);
//     cy.contains('Pausepolitikker').click();
//     cy.wait(500);
//   };

//   it('should navigate to break policies page', () => {
//     navigateToBreakPolicies();
    
//     cy.url().should('include', '/break-policies');
//   });

//   it('should display break policies list', () => {
//     navigateToBreakPolicies();
    
//     // Check that mtx-grid is present
//     cy.get('mtx-grid').should('exist');
//   });

//   it('should open create modal', () => {
//     navigateToBreakPolicies();
    
//     cy.contains('button', 'Create Break Policy').click();
//     cy.wait(500);
    
//     cy.contains('Create Break Policy').should('be.visible');
//     cy.get('input[formcontrolname="name"]').should('exist');
//   });

//   it('should create new break policy', () => {
//     navigateToBreakPolicies();
    
//     cy.contains('button', 'Create Break Policy').click();
//     cy.wait(500);
    
//     // Fill form
//     cy.get('input[formcontrolname="name"]').type('Test Break Policy');
    
//     // Submit
//     cy.contains('button', 'Create').click();
//     cy.wait(1000);
    
//     // Verify success
//     cy.contains('Test Break Policy').should('exist');
//   });

//   it('should edit break policy', () => {
//     navigateToBreakPolicies();
    
//     // Click edit button on first row
//     cy.get('mtx-grid').within(() => {
//       cy.get('button[mattooltip="Edit"]').first().click();
//     });
//     cy.wait(500);
    
//     cy.contains('Edit Break Policy').should('be.visible');
    
//     // Modify name
//     cy.get('input[formcontrolname="name"]').clear().type('Updated Break Policy');
    
//     // Save
//     cy.contains('button', 'Save').click();
//     cy.wait(1000);
    
//     // Verify update
//     cy.contains('Updated Break Policy').should('exist');
//   });

//   it('should delete break policy', () => {
//     navigateToBreakPolicies();
    
//     // Get initial count
//     cy.get('mtx-grid tbody tr').its('length').then((initialCount) => {
//       // Click delete button on first row
//       cy.get('mtx-grid').within(() => {
//         cy.get('button[mattooltip="Delete"]').first().click();
//       });
//       cy.wait(500);
      
//       cy.contains('Are you sure').should('be.visible');
      
//       // Confirm deletion
//       cy.contains('button', 'Delete').click();
//       cy.wait(1000);
      
//       // Verify deletion
//       cy.get('mtx-grid tbody tr').should('have.length', initialCount - 1);
//     });
//   });

//   it('should validate required fields', () => {
//     navigateToBreakPolicies();
    
//     cy.contains('button', 'Create Break Policy').click();
//     cy.wait(500);
    
//     // Try to submit without filling required fields
//     cy.contains('button', 'Create').should('be.disabled');
    
//     // Fill name
//     cy.get('input[formcontrolname="name"]').type('Test');
    
//     // Now button should be enabled
//     cy.contains('button', 'Create').should('not.be.disabled');
//   });
// });
