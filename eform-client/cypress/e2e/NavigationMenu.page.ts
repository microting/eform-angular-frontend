export class NavigationMenuPage {
  // Menu Editor Navigation
  public goToMenuEditor() {
    cy.get('#sign-out-dropdown').click();
    cy.get('#menu-editor').click();
    cy.wait(500);
  }

  // Template controls
  public collapseTemplates(index: number) {
    cy.get('.menuTemplate').eq(index).find('.mat-expansion-indicator').click();
    cy.wait(2000); // Wait for menu to open/close
  }

  // Menu Items
  public getMenuItems() {
    return cy.get('.menu_item');
  }

  public getMenuItemsCount() {
    return cy.get('.menu_item').its('length');
  }

  // Create operations
  public createMenuItemFromTemplate(templateIndex: number) {
    const dragHandle = cy.get(`#dragHandle0_${templateIndex}`);
    const target = cy.get('mat-card > mat-accordion').first();

    dragHandle
      .trigger('mousedown', { button: 0, bubbles: true })
      .trigger('mousemove', { pageX: 10, pageY: 0 });

    target
      .trigger('mousemove', { position: 'top' })
      .trigger('mouseup', { button: 0, bubbles: true });
  }

  public createCustomLink(data: { securityGroups?: string[]; link: string; translations: string[] }) {
    cy.get('#addCustomLink').click();
    cy.get('#customLinkCreateBtn').should('be.visible');

    if (data.securityGroups && data.securityGroups.length > 0) {
      data.securityGroups.forEach(group => {
        this.setSecurityGroupCustomDropdownSelector(group);
      });
    }

    cy.get('#customLinkLink').clear().type(data.link);

    data.translations.forEach((translation, index) => {
      if (translation) {
        cy.get(`#linkTranslation${index}`).clear().type(translation);
      }
    });

    cy.get('#customLinkCreateBtn').scrollIntoView().click();
  }

  public createCustomDropdown(data: { securityGroups?: string[]; translations: string[] }) {
    cy.get('#addCustomDropdown').click();
    cy.get('#customDropdownCreateBtn').should('be.visible');

    if (data.securityGroups && data.securityGroups.length > 0) {
      data.securityGroups.forEach(group => {
        this.setSecurityGroupCustomDropdownSelector(group);
      });
    }

    data.translations.forEach((translation, index) => {
      if (translation) {
        cy.get(`#dropdownTranslation${index}`).clear().type(translation);
      }
    });

    cy.get('#customDropdownCreateBtn').scrollIntoView().click();
  }

  // Edit operations
  public openEditMenuItem(index: number) {
    cy.get('.menu_item').eq(index).find('#editBtn').click();
    cy.get('#editItemSaveBtn').should('be.visible');
  }

  public editLinkInput(value: string) {
    cy.get('#editLinkInput').clear().type(value);
  }

  public editItemTranslation(firstLevel: number, secondLevel: number, translationIndex: number, value: string) {
    cy.get(`#editItemTranslation${firstLevel}_${secondLevel}_${translationIndex}`)
      .clear()
      .type(value);
  }

  public editItemSave() {
    cy.get('#editItemSaveBtn').click();
  }

  public editCustomLink(data: { securityGroups?: string[]; link: string; translations: string[] }, index: number) {
    this.openEditMenuItem(index);

    if (data.securityGroups && data.securityGroups.length > 0) {
      this.editSecurityGroupsValue(data.securityGroups);
    }

    if (data.link) {
      cy.get('#editLinkInput').clear().type(data.link);
    }

    data.translations.forEach((translation, index) => {
      if (translation) {
        cy.get(`#editItemTranslation${index}_0_${data.translations.indexOf(translation)}`)
          .clear()
          .type(translation);
      }
    });

    this.editItemSave();
  }

  public editCustomDropdown(data: { securityGroups?: string[]; translations: string[] }, index: number) {
    this.openEditMenuItem(index);

    if (data.securityGroups && data.securityGroups.length > 0) {
      this.editSecurityGroupsValue(data.securityGroups);
    }

    data.translations.forEach((translation, idx) => {
      if (translation) {
        cy.get(`#editItemTranslation${index}_0_${idx}`)
          .clear()
          .type(translation);
      }
    });

    this.editItemSave();
  }

  public editTemplateItem(data: { link?: string; translations: string[] }, index: number) {
    this.openEditMenuItem(index);

    if (data.link) {
      cy.get('#editLinkInput').clear().type(data.link);
    }

    data.translations.forEach((translation, idx) => {
      if (translation) {
        cy.get(`#editItemTranslation${index}_0_${idx}`)
          .clear()
          .type(translation);
      }
    });

    this.editItemSave();
    cy.wait(500);
    this.clickSaveMenuBtn();
  }

  // Delete operations
  public deleteElementFromMenuItems(index: number) {
    cy.get('.menu_item').eq(index).find('#deleteBtn').scrollIntoView().click();
    cy.wait(500);
    cy.get('#menuItemDeleteBtn').should('be.visible').click();
  }

  public deleteElementFromDropdown(dropdownIndex: number, itemIndex: number) {
    cy.get('.menu_item').eq(dropdownIndex)
      .find('.dropdownBody>*').eq(itemIndex)
      .find('#deleteBtn').scrollIntoView().click();
    cy.wait(500);
    cy.get('#menuItemDeleteBtn').should('be.visible').click();
    cy.wait(500);
    this.collapseMenuItemDropdown(dropdownIndex);
    cy.wait(500);
  }

  // Dropdown operations
  public collapseMenuItemDropdown(index: number) {
    cy.get('.menu_item').eq(index).find('.mat-expansion-indicator').click();
  }

  public getDropdownBodyChilds(dropdownIndex: number) {
    return cy.get('.menu_item').eq(dropdownIndex).find('.dropdownBody>*');
  }

  public dragTemplateOnElementInCreatedDropdown(templateIndex: number, dropdownIndex: number) {
    this.collapseTemplates(0);

    const dragHandle = cy.get(`#dragHandle0_${templateIndex}`);
    const dropdownBody = cy.get('.dropdownBody').eq(dropdownIndex);//.find('.dropdownBody');

    dragHandle
      .trigger('mousedown', { button: 0, bubbles: true })
      .trigger('mousemove', { pageX: 10, pageY: 0 });

    dropdownBody
      .trigger('mousemove', { position: 'center' })
      .trigger('mouseup', { button: 0, bubbles: true });

    cy.wait(500);
    this.collapseTemplates(0);
  }

  public editTranslationsOnDropdownBodyChilds(data: {
    indexChildDropdown: number;
    indexDropdownInMenu: number;
    translations_array: string[];
  }) {
    cy.get('.menu_item').eq(data.indexDropdownInMenu)
      .find('.dropdownBody>*').eq(data.indexChildDropdown)
      .find('#editBtn').click();

    cy.get('#editItemSaveBtn').should('be.visible');

    data.translations_array.forEach((translation, idx) => {
      cy.get(`#editItemTranslation${data.indexDropdownInMenu}_${data.indexChildDropdown}_${idx}`)
        .clear()
        .type(translation);
    });

    this.editItemSave();
    cy.wait(500);
  }

  public dragAndDropElementOfDropdown(dropdownIndex: number, fromIndex: number, toIndex: number) {
    const fromHandle = cy.get(`#drag_handle${dropdownIndex}_${fromIndex}`);
    const toHandle = cy.get(`#drag_handle${dropdownIndex}_${toIndex}`);

    fromHandle.scrollIntoView();
    cy.wait(2000);

    fromHandle
      .trigger('mousedown', { button: 0, bubbles: true })
      .trigger('mousemove', { pageX: 10, pageY: 0 });

    toHandle
      .trigger('mousemove', { position: 'center' })
      .trigger('mouseup', { button: 0, bubbles: true });

    cy.wait(2000);
  }

  // Security groups
  public setSecurityGroupCustomDropdownSelector(groupName: string) {
    cy.get('#securityGroupsCustomDropdownSelector').click();
    cy.wait(500);
    cy.contains('.ng-option', groupName).click();
    cy.wait(500);
  }

  public editSecurityGroupsValue(groups: string[]) {
    // Clear existing security groups
    cy.get('#editSecurityGroupsSelector').find('.ng-value span').each($el => {
      cy.wrap($el).click();
    });

    // Add new security groups
    groups.forEach(group => {
      cy.get('#editSecurityGroupsSelector').click();
      cy.wait(500);
      cy.contains('.ng-option', group).click();
      cy.wait(500);
    });
  }

  public getSecurityGroupsValue() {
    return cy.get('#editSecurityGroupsSelector').find('.ng-value-label');
  }

  // Save and Reset
  public clickSaveMenuBtn() {
    cy.get('#navigationMenuSaveBtn').scrollIntoView().click();
    // Note: Tests should intercept POST /api/navigation-menu and wait for it instead
  }

  public resetMenu() {
    // cy.wait(1100);
    // cy.wait(1200);
    // cy.wait(1400);
    cy.get('#resetBtn').scrollIntoView().click();
    cy.wait(500);
    cy.intercept('POST', '**/api/navigation-menu/reset').as('resetMenu');
    cy.intercept('GET', '**/api/navigation-menu').as('getMenuAfterReset');
    cy.get('#deleteWorkerDeleteBtn').should('be.visible').click();
    cy.wait('@resetMenu', { timeout: 30000 });
    cy.wait('@getMenuAfterReset', { timeout: 30000 });
    // Note: Tests should intercept POST /api/navigation-menu/reset and wait for it instead
    // cy.wait(500);
  }

  // Helper methods - DEPRECATED: Use API intercepts in tests instead
  public waitForSpinnerHide() {
    // This method is deprecated and should not be used
    // Tests should use cy.intercept() and cy.wait() for specific API calls instead
    cy.log('WARNING: waitForSpinnerHide is deprecated - use API intercepts instead');
  }
}

const navigationMenuPage = new NavigationMenuPage();
export default navigationMenuPage;
