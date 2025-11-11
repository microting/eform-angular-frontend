import loginPage from '../Login.page';
import navigationMenuPage from '../NavigationMenu.page';

describe('Navigation menu - Drag item', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('GET', '**/api/navigation-menu').as('loadMenu');
    navigationMenuPage.goToMenuEditor();
    cy.wait('@loadMenu', { timeout: 30000 });
  });

  it('element must be created from custom dropdown which elements', () => {
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').as('initialCount');
    cy.get('@initialCount').then((initialCount) => {
      navigationMenuPage.collapseTemplates(1);
      navigationMenuPage.createCustomDropdown(dropdown);

      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);

      navigationMenuPage.getMenuItems().its('length').as('currentCount');
      cy.get('@currentCount').then((currentCount) => {
        navigationMenuPage.collapseMenuItemDropdown(currentCount - 1);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentCount - 1);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentCount - 1);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentCount - 1);

        navigationMenuPage.getDropdownBodyChilds(currentCount - 1).should('have.length', 3);
      });
    });
  });

  it('should edit elements in dropdown', () => {
    navigationMenuPage.getMenuItems().its('length').as('menuCount');
    cy.get('@menuCount').then((menuCount) => {
      const array = [
        {
          indexChildDropdown: 0,
          translations_array: ['test0Eng', 'test0Dan', 'test0Ger'],
          indexDropdownInMenu: menuCount - 1
        },
        {
          indexChildDropdown: 1,
          translations_array: ['test1Eng', 'test1Dan', 'test1Ger'],
          indexDropdownInMenu: menuCount - 1
        },
        {
          indexChildDropdown: 2,
          translations_array: ['test2Eng', 'test2Dan', 'test2Ger'],
          indexDropdownInMenu: menuCount - 1
        }
      ];

      // Edit translations in each dropdown element
      array.forEach(data => {
        navigationMenuPage.editTranslationsOnDropdownBodyChilds(data);
      });

      cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait('@saveMenu', { timeout: 30000 });

      // Verify all translations were saved
      array.forEach(item => {
        navigationMenuPage.getDropdownBodyChilds(item.indexDropdownInMenu)
          .eq(item.indexChildDropdown)
          .find('#editBtn')
          .click();

        item.translations_array.forEach((translation, i) => {
          cy.get(`#editItemTranslation${item.indexDropdownInMenu}_${item.indexChildDropdown}_${i}`)
            .should('have.value', translation);
        });

        cy.intercept('POST', '**/api/navigation-menu').as('saveMenuEdit');
        navigationMenuPage.editItemSave();
        cy.wait('@saveMenuEdit', { timeout: 30000 });
      });
    });
  });

  it('swap elements in dropdown', () => {
    navigationMenuPage.getMenuItems().its('length').as('menuCount');
    cy.get('@menuCount').then((menuCount) => {
      // Swap elements within dropdown
      navigationMenuPage.dragAndDropElementOfDropdown(menuCount, 2, 0);
      
      cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait('@saveMenu', { timeout: 30000 });

      // Verify order after swap
      const itemsAfterSwap = [
        'menu\nSites / test2Dan\nedit\ndelete',
        'menu\nDevice Users / test0Dan\nedit\ndelete',
        'menu\nWorkers / test1Dan\nedit\ndelete'
      ];

      navigationMenuPage.getDropdownBodyChilds(menuCount - 1).each(($el, index) => {
        cy.wrap($el).invoke('text').should('eq', itemsAfterSwap[index]);
      });
    });
  });

  afterEach(() => {
    cy.intercept('POST', '**/api/navigation-menu/reset').as('resetMenu');
    navigationMenuPage.resetMenu();
    cy.wait('@resetMenu', { timeout: 30000 });
  });
});
