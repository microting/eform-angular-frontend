import loginPage from '../Login.page';
import navigationMenuPage from '../NavigationMenu.page';

describe('Navigation menu - Delete item', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('GET', '**/api/navigation-menu').as('loadMenu');
    navigationMenuPage.goToMenuEditor();
    cy.wait('@loadMenu', { timeout: 30000 });
  });

  it('element must be created from custom dropdown which elements and create templates elements', () => {
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(1);

      navigationMenuPage.createCustomDropdown(dropdown);

      // Create 2 items from templates menu
      navigationMenuPage.collapseTemplates(0);
      navigationMenuPage.createMenuItemFromTemplate(2);
      navigationMenuPage.createMenuItemFromTemplate(3);
      navigationMenuPage.collapseTemplates(0);

      // Verify 3 elements were created (1 dropdown + 2 template items)
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 3);

      // Drag template items into dropdown
      navigationMenuPage.getMenuItems().its('length').then(currentCount => {
        navigationMenuPage.collapseMenuItemDropdown(currentCount - 1);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentCount - 1);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentCount - 1);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentCount - 1);

        // Verify 3 items in dropdown
        navigationMenuPage.getDropdownBodyChilds(currentCount - 1).should('have.length', 3);

        // Save menu
        cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
        navigationMenuPage.clickSaveMenuBtn();
        cy.wait('@saveMenu', { timeout: 30000 });
      });
    });
  });

  it('should before deleted items from custom dropdown and items menu', () => {
    navigationMenuPage.getMenuItems().its('length').then(menuItemsCount => {
      // Get count of elements in dropdown
      navigationMenuPage.getDropdownBodyChilds(menuItemsCount - 1).its('length').then(dropdownCount => {

        // Delete 3 elements from dropdown
        navigationMenuPage.deleteElementFromDropdown(menuItemsCount - 1, 0);
        navigationMenuPage.deleteElementFromDropdown(menuItemsCount - 1, 0);
        navigationMenuPage.deleteElementFromDropdown(menuItemsCount - 1, 0);

        cy.intercept('POST', '**/api/navigation-menu').as('saveMenu1');
        navigationMenuPage.clickSaveMenuBtn();
        cy.wait('@saveMenu1', { timeout: 30000 });

        // Verify dropdown is empty
        navigationMenuPage.getDropdownBodyChilds(menuItemsCount - 1).should('have.length', dropdownCount - 3);

        // Delete menu items
        navigationMenuPage.deleteElementFromMenuItems(0);
        navigationMenuPage.deleteElementFromMenuItems(0); // delete 2 template elements

        navigationMenuPage.getMenuItems().its('length').then(currentCount => {
          navigationMenuPage.deleteElementFromMenuItems(currentCount - 1); // delete created dropdown

          cy.intercept('POST', '**/api/navigation-menu').as('saveMenu2');
          navigationMenuPage.clickSaveMenuBtn();
          cy.wait('@saveMenu2', { timeout: 30000 });

          // Verify items were deleted
          navigationMenuPage.getMenuItems().should('have.length', menuItemsCount - 3);
        });
      });
    });
  });

  afterEach(() => {
    cy.intercept('POST', '**/api/navigation-menu/reset').as('resetMenu');
    navigationMenuPage.resetMenu();
    cy.wait('@resetMenu', { timeout: 30000 });
  });
});
