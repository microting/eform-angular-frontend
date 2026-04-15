import loginPage from '../../../Login.page';
import pluginPage from '../../../Plugin.page';

describe('Enable Backend Config plugin', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    pluginPage.Navbar.goToPluginsPage();
    // pluginPage.rowNum()
    //   .should('not.eq', 0) // we have plugins list
    //   .should('eq', 1); // we have only 1 plugin: time planning
  });

    it('should enabled Time registration plugin', () => {
    const pluginName = 'Microting Time Planning Plugin';

    // Open action menu for the plugin
    cy.contains('.mat-mdc-row', pluginName).first().find('#actionMenu').click();
    cy.wait(500);

    // Click the status button inside the menu to enable the plugin
    cy.get('#plugin-status-button0').scrollIntoView().should('be.visible').click();
    cy.wait(500);

    // Confirm activation in the modal if present
    cy.get('body').then(($body) => {
      if ($body.find('#pluginOKBtn').length > 0) {
        cy.get('#pluginOKBtn').click();
        cy.wait(100000); // Wait for plugin activation
      }
    });

      cy.visit('http://localhost:4200');
      loginPage.login();
      pluginPage.Navbar.goToPluginsPage();

    // Verify the plugin is enabled by checking the status
    // Re-open the action menu to check the status
    cy.contains('.mat-mdc-row', pluginName).first().find('#actionMenu').click();
    cy.wait(500);

    cy.get('#plugin-status-button0')
      .find('mat-icon')
      .should('contain.text', 'toggle_on'); // plugin is enabled
  });
});
