import loginPage from '../Login.page';
import navigationMenuPage from '../NavigationMenu.page';

describe('Navigation menu - Create item', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('GET', '**/api/navigation-menu').as('loadMenu');
    navigationMenuPage.goToMenuEditor();
    cy.wait('@loadMenu', { timeout: 30000 });
  });

  it('element must be moved from templates to list', () => {
    // Get initial count
    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(0);
      navigationMenuPage.createMenuItemFromTemplate(0);

      // Verify count increased - wait for DOM update
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);
      
      // Intercept save operation
      cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait('@saveMenu', { timeout: 30000 });
      
      navigationMenuPage.openEditMenuItem(0);
      
      // Verify link field
      cy.get('#editLinkInput').should('have.value', '/');
      
      // Verify translations
      cy.get('#editItemTranslation0_0_0').should('have.value', 'My eForms');
      cy.get('#editItemTranslation0_0_1').should('have.value', 'Mine eForms');
      cy.get('#editItemTranslation0_0_2').should('have.value', 'Meine eForms');
      
      // Intercept edit save operation
      cy.intercept('POST', '**/api/navigation-menu').as('saveMenuEdit');
      navigationMenuPage.editItemSave();
      cy.wait('@saveMenuEdit', { timeout: 30000 });
      
      navigationMenuPage.collapseTemplates(0);
    });
  });

  it('element must be created from custom link', () => {
    const customLink = {
      securityGroups: [],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(1);
      navigationMenuPage.createCustomLink(customLink);

      // Verify count increased - wait for DOM update
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);
      
      // Intercept save operation
      cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait('@saveMenu', { timeout: 30000 });

      // Open last item for editing
      navigationMenuPage.getMenuItems().its('length').then(count => {
        navigationMenuPage.openEditMenuItem(count - 1);

        // Verify link
        cy.get('#editLinkInput').should('have.value', customLink.link);

        // Verify translations
        customLink.translations.forEach((translation, i) => {
          navigationMenuPage.getMenuItems().its('length').then(itemCount => {
            cy.get(`#editItemTranslation${itemCount - 1}_0_${i}`).should('have.value', translation);
          });
        });

        // Intercept edit save operation
        cy.intercept('POST', '**/api/navigation-menu').as('saveMenuEdit');
        navigationMenuPage.editItemSave();
        cy.wait('@saveMenuEdit', { timeout: 30000 });
      });
    });
  });

  it('element must be created from custom dropdown', () => {
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test2', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(1);
      navigationMenuPage.createCustomDropdown(dropdown);

      // Verify count increased - wait for DOM update
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);
      
      // Intercept save operation
      cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait('@saveMenu', { timeout: 30000 });

      // Open last item for editing
      navigationMenuPage.getMenuItems().its('length').then(count => {
        navigationMenuPage.openEditMenuItem(count - 1);

        // Verify translations
        dropdown.translations.forEach((translation, i) => {
          navigationMenuPage.getMenuItems().its('length').then(itemCount => {
            cy.get(`#editItemTranslation${itemCount - 1}_0_${i}`).should('have.value', translation);
          });
        });

        // Intercept edit save operation
        cy.intercept('POST', '**/api/navigation-menu').as('saveMenuEdit');
        navigationMenuPage.editItemSave();
        cy.wait('@saveMenuEdit', { timeout: 30000 });
      });
    });
  });

  it('element must be created from custom dropdown with security group', () => {
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(1);
      navigationMenuPage.createCustomDropdown(dropdown);

      // Verify count increased - wait for DOM update
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);
      
      // Intercept save operation
      cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait('@saveMenu', { timeout: 30000 });

      // Open last item for editing
      navigationMenuPage.getMenuItems().its('length').then(count => {
        navigationMenuPage.openEditMenuItem(count - 1);

        // Verify security groups
        dropdown.securityGroups.forEach((group, i) => {
          navigationMenuPage.getSecurityGroupsValue().eq(i).should('have.text', group);
        });

        // Verify translations
        dropdown.translations.forEach((translation, i) => {
          navigationMenuPage.getMenuItems().its('length').then(itemCount => {
            cy.get(`#editItemTranslation${itemCount - 1}_0_${i}`).should('have.value', translation);
          });
        });

        // Intercept edit save operation
        cy.intercept('POST', '**/api/navigation-menu').as('saveMenuEdit');
        navigationMenuPage.editItemSave();
        cy.wait('@saveMenuEdit', { timeout: 30000 });
      });
    });
  });

  afterEach(() => {
    cy.intercept('POST', '**/api/navigation-menu/reset').as('resetMenu');
    navigationMenuPage.resetMenu();
    cy.wait('@resetMenu', { timeout: 30000 });
  });
});
