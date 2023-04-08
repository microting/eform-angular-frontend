export class Navbar {
  public header() {
    return cy.get('#header').should('be.visible');
  }

  public applicationSettingsBtn() {
    return cy.get('#application-settings').should('be.visible');
  }

  public signOutDropdown() {
    return cy.get('#sign-out-dropdown').should('be.visible').click();
  }

  public advancedBtn() {
    return cy.get('#advanced').should('be.visible').click();
  }

  public logoutBtn() {
    return cy.get('#sign-out').should('be.visible').click();
  }

  public settingsBtn() {
    return cy.get('#settings').should('be.visible');
  }

  public changePasswordBtn() {
    return cy.get('#change-password').should('be.visible');
  }

  public userAdministrationBtn() {
    return cy.get('#user-management-menu').should('be.visible').click();
  }

  public workersBtn() {
    return cy.get('#workers').should('be.visible');
  }

  public sitesBtn() {
    return cy.get('#sites').should('be.visible');
  }

  public foldersBtn() {
    return cy.get('#folders').should('be.visible');
  }

  public pluginsBtn() {
    return cy.get('#plugins-settings').should('be.visible');
  }

  public menuEditorBtn() {
    return cy.get('#menu-editor').should('be.visible');
  }

  public securityBtn() {
    return cy.get('#security').should('be.visible');
  }

  public deviceUsersBtn() {
    return cy.get('#device-users').should('be.visible');
  }

  public entitySearchBtn() {
    return cy.get('#search').should('be.visible');
  }

  public entitySelectBtn() {
    return cy.get('#selectable-list').should('be.visible');
  }

  public myEformsBtn() {
    return cy.get('#my-eforms').should('be.visible').click();
  }

  public clickOnSubMenuItem(menuItem) {
    return cy.contains('.fadeInDropdown', menuItem).should('be.visible').click();
  }

  public advancedDropdownClick() {
    this.advancedBtn();
    cy.wait(500);
  }

  public clickOnHeaderMenuItem(headerMenuItem) {
    return cy.contains('#header', headerMenuItem).parentsUntil('#header').last().click();
  }

  public verifyHeaderMenuItem(headerMenuItem) {
    return cy.contains('#header', headerMenuItem).should('be.visible');
  }

  public clickOnHeaderMenuItem2(headerMenuItem) {
    return cy.contains('[mat-tree-node]', headerMenuItem).parentsUntil('[mat-tree-node]').last().click();
  }

  public logout() {
    cy.get(this.signOutDropdown()).click();
    cy.wait(500);
    cy.get(this.logoutBtn()).click();
    cy.wait(500);
  }

  public goToProfileSettings() {
    cy.get(this.signOutDropdown()).click();
    cy.get(this.settingsBtn()).should('be.visible').should('be.enabled').click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToApplicationSettings() {
    cy.get('#spinner-animation').should('not.be.visible');
    cy.get('#application-settings').should('be.visible').then(isDisplayed => {
      if (!isDisplayed) {
        this.advancedDropdownClick();
      }
    });
    cy.get(this.applicationSettingsBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToWorkers() {
    this.advancedDropdownClick();
    cy.get(this.workersBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToSites() {
    this.advancedDropdownClick();
    cy.get(this.sitesBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToUserAdministration() {
    cy.get(this.signOutDropdown()).click();
    cy.get(this.userAdministrationBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToPasswordSettings() {
    cy.get(this.signOutDropdown()).click();
    cy.get(this.changePasswordBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToDeviceUsersPage() {
    cy.get(this.deviceUsersBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToEntitySelect() {
    this.advancedDropdownClick();
    cy.get(this.entitySelectBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToEntitySearch() {
    this.advancedDropdownClick();
    cy.get(this.entitySearchBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
    cy.wait(500);
  }

  public goToFolderPage() {
    cy.get(`#folders`).should('be.visible').then(isDisplayed => {
      if (isDisplayed) {
        cy.get(this.foldersBtn()).click();
        cy.wait(500);
        cy.get('#spinner-animation').should('not.be.visible');
      } else {
        this.advancedDropdownClick();
        cy.get(this.foldersBtn()).should('be.visible').should('be.enabled').click();
        cy.get('#spinner-animation').should('not.be.visible');
        cy.wait(500);
      }
    });
  }

  public goToPluginsPage() {
    this.advancedDropdownClick();
    cy.get(this.pluginsBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
  }

  public goToMenuEditorPage() {
    cy.get(this.signOutDropdown()).click();
    cy.get(this.menuEditorBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
  }

  public goToMyEForms() {
    cy.get(this.myEformsBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
  }

  public goToSecurity() {
    cy.get(this.signOutDropdown()).click();
    cy.get(this.securityBtn()).click();
    cy.get('#spinner-animation').should('not.be.visible');
  }
}
