import {PageWithNavbarPage} from './PageWithNavbar.page';
import loginPage from './Login.page';

class PluginPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public rowNum(): Cypress.Chainable<number> {
    return cy.get('.mat-mdc-row').its('length').should('be.gt', 0);
  }

  public marketplaceBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#newSecurityGroupBtn')
      .should('be.enabled')
      .should('be.visible');
  }

  public pluginCancelBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#pluginCancelBtn')
      .should('be.enabled')
      .should('be.visible');
  }

  public pluginOKBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#pluginOKBtn')
      .should('be.enabled')
      .should('be.visible');
  }

  public enablePluginByName(pluginName: string, msForWait: number = 100000) {
    let row = cy.contains('.mat-mdc-row', pluginName).first();
    let switchElement = row
      .find('.mat-column-actions button')
      .should('contain.text', 'toggle_off');  // plugin is disabled
    switchElement.click(); // call warning modal
    this.pluginOKBtn().should('be.visible')
      .should('be.enabled').click(); // button in warning modal
    cy.wait(msForWait); // wait for server
    cy.visit('http://localhost:4200');// migrate db plugin
    loginPage.login();
    this.Navbar.goToPluginsPage();
  }
/*
  getFirstPluginRowObj(): PluginRowObject {
    return this.getPluginRowObjByIndex(1);
  }

  getPluginRowObjByIndex(index: number): PluginRowObject {
    const pluginObj = new PluginRowObject();
    return pluginObj.getRow(index);
  }*/

  /*getPluginRowObjByName(namePlugin: string): Cypress.Chainable<PluginRowObject> {
    cy.wait(500);
    return this.rowNum().then((rowNum) => {
      for (let i = 1; i < this.rowNum(); i++) {
        const plugin = this.getPluginRowObjByIndex(i);
        if (plugin.name === namePlugin) {
          return plugin;
        }
      }
    })
  }*/
}

const pluginPage = new PluginPage();
export default pluginPage;

/*class PluginRowObject {
  constructor() {
  }

  id: number;
  name: string;
  version: string;
  statusBtn;
  status: string;
  settingsBtn;
  rowNumber: number;

  public getRow(rowNum: number): PluginRowObject {
    this.rowNumber = rowNum - 1;

    this.id = +($('#plugin-id' + this.rowNumber)).getText();
    this.name = ($('#plugin-name' + this.rowNumber)).getText();
    this.version = ($('#plugin-version' + this.rowNumber)).getText();
    this.settingsBtn = $('#plugin-settings-link' + this.rowNumber);
    this.statusBtn = $('#plugin-status-button' + this.rowNumber);
    const pluginStatus = $('#plugin-status' + this.rowNumber);
    this.status = (this.statusBtn.$('mat-icon')).getText();
    return this;
  }

  enableOrDisablePlugin(timeout = 100000) {
    this.statusBtn.click();
    browser.pause(500);
    (pluginPage.pluginOKBtn()).waitForDisplayed({timeout: 40000});
    (pluginPage.pluginOKBtn()).click();
    browser.pause(timeout); // We need to wait 100 seconds for the plugin to create db etc.
    loginPage.open('/');
    loginPage.login();
    pluginPage.Navbar.goToPluginsPage();
    browser.pause(500);
  }
}*/
