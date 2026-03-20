import loginPage from '../Login.page';
import cmsPage from '../Cms.page';

const testPageTitle = 'Cypress CMS Landing Page';
const testPageContent = '<h1>Welcome from Cypress</h1><p>This is automated test content for the CMS landing page.</p>';

describe('CMS - landing page shown to unauthenticated visitors', () => {
  before(() => {
    cy.visit('http://localhost:4200/auth');
    loginPage.login();
  });

  it('should navigate to CMS manager', () => {
    cmsPage.Navbar.goToCmsPage();
    cy.url().should('include', '/cms');
    cy.get('#cmsTabGroup').should('be.visible');
  });

  it('should enable CMS in settings', () => {
    cmsPage.goToTab('Settings');
    cy.get('#cmsEnabledToggle').should('be.visible');
    cmsPage.Settings.enable();
    cy.get('#cmsEnabledToggle').should('be.visible'); // still on page after save
  });

  it('should create a new page with content and mark it as landing page', () => {
    cmsPage.goToTab('Pages');
    cy.get('#cmsNewPageBtn').should('be.visible');
    cmsPage.Pages.clickNewPage();

    // Fill in the page form
    cy.url().should('include', '/cms/pages');
    cmsPage.PageEdit.setTitle(testPageTitle);

    // Set body content via TinyMCE API (avoids iframe complexity)
    cy.window().should(win => {
      expect((win as any).tinymce).to.exist;
    });
    cy.window().then(win => {
      (win as any).tinymce.activeEditor.setContent(testPageContent);
    });

    // Mark as landing page and published
    cmsPage.PageEdit.enableLandingPage();
    cmsPage.PageEdit.enablePublished();

    // Save the page
    cy.intercept('POST', '**/api/cms/pages').as('createPage');
    cy.get('#cmsPageSaveBtn').should('be.visible').click();
    cy.wait('@createPage', {timeout: 30000});

    // Should navigate back to /cms
    cy.url().should('include', '/cms');
  });

  it('should show the page in the pages list as landing page', () => {
    cmsPage.goToTab('Pages');
    cy.contains('mat-cell', testPageTitle).should('be.visible');
    // Landing page icon (home) should be shown
    cy.contains('mat-row', testPageTitle).find('mat-icon').contains('home').should('exist');
  });

  it('should show the CMS landing page body after logging out', () => {
    // Intercept the public landing API call
    cy.intercept('GET', '**/api/cms/public/config').as('getCmsConfig');
    cy.intercept('GET', '**/api/cms/public/landing').as('getLanding');

    cmsPage.Navbar.logout();

    // The guard should redirect to /landing (not /auth) because CMS is enabled
    cy.url().should('include', '/landing');

    // Wait for the landing page data to load
    cy.wait('@getLanding', {timeout: 30000});

    // The page body should contain the content we entered
    cy.get('#cmsPageBody').should('be.visible');
    cy.get('#cmsPageBody').should('contain.html', 'Welcome from Cypress');
    cy.get('#cmsPageBody').should('contain.text', 'This is automated test content for the CMS landing page.');
  });

  after(() => {
    // Clean up: log back in and disable CMS so other tests are not affected
    cy.visit('http://localhost:4200/auth');
    loginPage.login();
    cmsPage.Navbar.goToCmsPage();
    cmsPage.goToTab('Settings');
    cmsPage.Settings.disable();
  });
});
