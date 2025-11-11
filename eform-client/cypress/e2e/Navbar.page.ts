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
    return cy.get('#folders');
  }

  public pluginsBtn() {
    return cy.get('#plugins-settings');
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
    this.signOutDropdown().click();
    cy.wait(500);
    this.logoutBtn().click();
    cy.wait(500);
  }

  public goToProfileSettings() {
    this.signOutDropdown().click();
    this.settingsBtn().should('be.visible').should('be.enabled').click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToApplicationSettings() {
    cy.get('#application-settings').should('be.visible').then(isDisplayed => {
      if (!isDisplayed) {
        this.advancedBtn();
      }
    });
    this.applicationSettingsBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToWorkers() {
    this.advancedBtn();
    this.workersBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToSites() {
    this.advancedBtn();
    this.sitesBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToUserAdministration() {
    this.signOutDropdown().click();
    this.userAdministrationBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToPasswordSettings() {
    this.signOutDropdown().click();
    this.changePasswordBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToDeviceUsersPage() {
    this.deviceUsersBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToEntitySelect() {
    this.advancedBtn();
    this.entitySelectBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToEntitySearch() {
    this.advancedBtn();
    this.entitySearchBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
    cy.wait(500);
  }

  public goToFolderPage() {
    this.foldersBtn().should('be.visible').then(isDisplayed => {
      if (isDisplayed) {
        this.foldersBtn().click();
        cy.wait(500);
      } else {
        this.advancedBtn();
        this.foldersBtn().should('be.visible').should('be.enabled').click();
        cy.wait(500);
      }
    });
  }

  public goToPluginsPage() {
    this.advancedBtn();
    this.pluginsBtn().should('be.visible').then(isDisplayed => {
      if (isDisplayed) {
        this.pluginsBtn().click();
        cy.wait(500);
      } else {
        this.advancedBtn();
        this.pluginsBtn().should('be.visible').should('be.enabled').click();
        cy.wait(500);
      }
    });
    cy.get('app-installed-plugins-page .mat-mdc-row').should('be.visible'); // required need 1+ plugin
  }

  public goToMenuEditorPage() {
    this.signOutDropdown().click();
    this.menuEditorBtn().click();
    // Note: Tests should intercept GET /api/navigation-menu after navigation
  }

  public goToMyEForms() {
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    this.myEformsBtn().click();
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });
    // Note: Tests should intercept appropriate API calls after navigation
  }

  public goToSecurity() {
    this.signOutDropdown().click();
    this.securityBtn().click();
    // Note: Tests should intercept appropriate API calls after navigation
  }

  spinnerAnimation() {
    return cy.get('#spinner-animation');
  }

  // DEPRECATED: Use API intercepts in tests instead
  public waitForSpinnerHide() {
    cy.log('WARNING: waitForSpinnerHide is deprecated - use API intercepts instead');
    // No longer waits for spinner - tests should use cy.intercept() and cy.wait() for specific API calls
  }
}
