import loginPage from '../Login.page';
import navigationMenuPage from '../NavigationMenu.page';

describe('Navigation menu - Delete item', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    navigationMenuPage.goToMenuEditor();
  });

  it('element must be created from custom dropdown which elements and create templates elements', () => {
    cy.wait(2000);
    
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(1);
      cy.wait(1500);
      
      navigationMenuPage.createCustomDropdown(dropdown);
      cy.wait(500);

      // Create 2 items from templates menu
      navigationMenuPage.collapseTemplates(0);
      cy.wait(500);
      navigationMenuPage.createMenuItemFromTemplate(2);
      cy.wait(500);
      navigationMenuPage.createMenuItemFromTemplate(3);
      cy.wait(500);
      navigationMenuPage.collapseTemplates(0);
      cy.wait(1500);

      // Verify 3 elements were created (1 dropdown + 2 template items)
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 3);

      // Drag template items into dropdown
      navigationMenuPage.getMenuItems().its('length').then(currentCount => {
        navigationMenuPage.collapseMenuItemDropdown(currentCount - 1);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentCount - 1);
        cy.wait(500);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentCount - 1);
        cy.wait(500);
        navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentCount - 1);
        cy.wait(500);

        // Verify 3 items in dropdown
        navigationMenuPage.getDropdownBodyChilds(currentCount - 1).should('have.length', 3);

        // Save menu
        navigationMenuPage.clickSaveMenuBtn();
        cy.wait(500);
      });
    });
  });

  it('should before deleted items from custom dropdown and items menu', () => {
    cy.wait(2000);

    navigationMenuPage.getMenuItems().its('length').then(menuItemsCount => {
      // Get count of elements in dropdown
      navigationMenuPage.getDropdownBodyChilds(menuItemsCount - 1).its('length').then(dropdownCount => {
        
        // Delete 3 elements from dropdown
        navigationMenuPage.deleteElementFromDropdown(menuItemsCount - 1, 0);
        cy.wait(500);
        navigationMenuPage.deleteElementFromDropdown(menuItemsCount - 1, 0);
        cy.wait(500);
        navigationMenuPage.deleteElementFromDropdown(menuItemsCount - 1, 0);
        cy.wait(500);
        
        navigationMenuPage.clickSaveMenuBtn();
        cy.wait(500);

        // Verify dropdown is empty
        navigationMenuPage.getDropdownBodyChilds(menuItemsCount - 1).should('have.length', dropdownCount - 3);

        // Delete menu items
        navigationMenuPage.deleteElementFromMenuItems(0);
        cy.wait(500);
        navigationMenuPage.deleteElementFromMenuItems(0); // delete 2 template elements
        cy.wait(500);
        
        navigationMenuPage.getMenuItems().its('length').then(currentCount => {
          navigationMenuPage.deleteElementFromMenuItems(currentCount - 1); // delete created dropdown
          cy.wait(500);
          
          navigationMenuPage.clickSaveMenuBtn();
          cy.wait(500);

          // Verify items were deleted
          navigationMenuPage.getMenuItems().should('have.length', menuItemsCount - 3);
        });
      });
    });
  });

  afterEach(() => {
    navigationMenuPage.resetMenu();
    cy.wait(1500);
  });
});
