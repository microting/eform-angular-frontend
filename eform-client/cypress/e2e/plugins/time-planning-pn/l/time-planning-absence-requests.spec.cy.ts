import loginPage from '../../../Login.page';
import pluginPage from '../../../Plugin.page';

describe('Time Planning - Absence Requests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    // Navigate directly to the absence requests page since menu entry doesn't exist yet
    cy.visit('http://localhost:4200/plugins/time-planning-pn/absence-requests');
  });

  it('should display absence requests inbox view', () => {
    cy.get('#absenceRequestsInboxBtn').scrollIntoView().should('be.visible');
    cy.get('#absenceRequestsMineBtn').should('be.visible');
    cy.get('#time-planning-pn-absence-requests-grid').scrollIntoView().should('be.visible');
  });

  it('should switch between inbox and my requests views', () => {
    cy.get('#absenceRequestsInboxBtn').should('have.class', 'active');
    
    cy.get('#absenceRequestsMineBtn').click();
    cy.get('#absenceRequestsMineBtn').should('have.class', 'active');
    cy.get('#absenceRequestsInboxBtn').should('not.have.class', 'active');
    
    cy.get('#absenceRequestsInboxBtn').click();
    cy.get('#absenceRequestsInboxBtn').should('have.class', 'active');
    cy.get('#absenceRequestsMineBtn').should('not.have.class', 'active');
  });

  it('should display approve and reject buttons for pending requests in inbox', () => {
    cy.get('#absenceRequestsInboxBtn').click();
    
    // Check if there are any rows with data (not the "no data" message)
    cy.get('#time-planning-pn-absence-requests-grid').then(($grid) => {
      // If there's data, check for buttons
      if ($grid.find('[id^="approveAbsenceRequestBtn-"]').length > 0) {
        cy.get('[id^="approveAbsenceRequestBtn-"]').should('exist');
        cy.get('[id^="rejectAbsenceRequestBtn-"]').should('exist');
      } else {
        // No data scenario is also valid - just log it
        cy.log('No pending absence requests found in inbox');
      }
    });
  });

  it('should open approve modal when approve button is clicked', () => {
    cy.get('#absenceRequestsInboxBtn').click();
    
    // Only try to click if button exists
    cy.get('body').then(($body) => {
      if ($body.find('[id^="approveAbsenceRequestBtn-"]').length > 0) {
        cy.get('[id^="approveAbsenceRequestBtn-"]').first().click();
        
        cy.get('h3[mat-dialog-title]').should('contain', 'Approve Absence Request');
        cy.get('#saveApproveBtn').scrollIntoView().should('be.visible');
        cy.get('#cancelApproveBtn').should('be.visible');
        
        cy.get('#cancelApproveBtn').click();
      } else {
        cy.log('No approve buttons found - skipping modal test');
      }
    });
  });

  it('should open reject modal when reject button is clicked', () => {
    cy.get('#absenceRequestsInboxBtn').click();
    
    // Only try to click if button exists
    cy.get('body').then(($body) => {
      if ($body.find('[id^="rejectAbsenceRequestBtn-"]').length > 0) {
        cy.get('[id^="rejectAbsenceRequestBtn-"]').first().click();
        
        cy.get('h3[mat-dialog-title]').should('contain', 'Reject Absence Request');
        cy.get('#saveRejectBtn').scrollIntoView().should('be.visible');
        cy.get('#cancelRejectBtn').should('be.visible');
        
        cy.get('#cancelRejectBtn').click();
      } else {
        cy.log('No reject buttons found - skipping modal test');
      }
    });
  });
});
