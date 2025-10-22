import loginPage from '../Login.page';
import navigationMenuPage from '../NavigationMenu.page';

describe('Navigation menu - Edit item', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    navigationMenuPage.goToMenuEditor();
  });

  it('element must be created from custom link with security group', () => {
    cy.wait(2000);
    
    const customLink = {
      securityGroups: ['eForm admins'],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(1);
      cy.wait(1500);
      navigationMenuPage.createCustomLink(customLink);
      cy.wait(500);
      
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);
      cy.wait(500);
      
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait(500);
    });
  });

  it('link with security group must be updated', () => {
    const customLink = {
      securityGroups: ['eForm users'],
      link: 'linkTest00',
      translations: ['Test11', 'Test22', 'Test31']
    };

    navigationMenuPage.collapseTemplates(1);
    cy.wait(1500);

    navigationMenuPage.getMenuItems().its('length').then(count => {
      navigationMenuPage.editCustomLink(customLink, count - 1);
      cy.wait(500);

      navigationMenuPage.clickSaveMenuBtn();
      cy.wait(500);

      navigationMenuPage.openEditMenuItem(count - 1);
      cy.wait(1500);

      // Verify security groups
      customLink.securityGroups.forEach((group, i) => {
        navigationMenuPage.getSecurityGroupsValue().eq(i).should('have.text', group);
      });

      // Verify link
      cy.get('#editLinkInput').should('have.value', customLink.link);

      // Verify translations
      customLink.translations.forEach((translation, i) => {
        cy.get(`#editItemTranslation${count - 1}_0_${i}`).should('have.value', translation);
      });

      navigationMenuPage.editItemSave();
      cy.wait(500);
    });
  });

  it('element must be created from custom dropdown with security group', () => {
    cy.wait(1500);
    
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };

    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(1);
      cy.wait(1500);
      navigationMenuPage.createCustomDropdown(dropdown);
      cy.wait(500);
      
      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait(500);
    });
  });

  it('dropdown with security group must be updated', () => {
    const dropdown = {
      securityGroups: ['eForm users'],
      translations: ['Test11', 'Test22', 'Test31']
    };

    navigationMenuPage.getMenuItems().its('length').then(count => {
      navigationMenuPage.editCustomDropdown(dropdown, count - 1);
      cy.wait(500);

      navigationMenuPage.clickSaveMenuBtn();
      cy.wait(500);

      navigationMenuPage.openEditMenuItem(count - 1);
      cy.wait(500);

      // Verify security groups
      dropdown.securityGroups.forEach((group, i) => {
        navigationMenuPage.getSecurityGroupsValue().eq(i).should('have.text', group);
      });

      // Verify translations
      dropdown.translations.forEach((translation, i) => {
        cy.get(`#editItemTranslation${count - 1}_0_${i}`).should('have.value', translation);
      });

      navigationMenuPage.editItemSave();
      cy.wait(500);
    });
  });

  it('element must be moved from templates to list', () => {
    cy.wait(1500);
    
    navigationMenuPage.getMenuItems().its('length').then(initialCount => {
      navigationMenuPage.collapseTemplates(0);
      navigationMenuPage.createMenuItemFromTemplate(0);
      cy.wait(500);

      navigationMenuPage.getMenuItems().should('have.length', initialCount + 1);
      navigationMenuPage.clickSaveMenuBtn();
      cy.wait(500);
      navigationMenuPage.collapseTemplates(0);
    });
  });

  it('element must be updated on link field', () => {
    const data = {
      link: '/device-users',
      translations: []
    };

    navigationMenuPage.editTemplateItem(data, 0);
    cy.wait(500);
    
    navigationMenuPage.openEditMenuItem(0);
    cy.wait(500);
    
    cy.get('#editLinkInput').should('have.value', data.link);
    navigationMenuPage.editItemSave();
    cy.wait(500);
  });

  it('element must be updated on translation fields', () => {
    const data = {
      link: '',
      translations: ['translate1', 'translate21', 'translate0']
    };

    navigationMenuPage.editTemplateItem(data, 0);
    cy.wait(500);

    navigationMenuPage.openEditMenuItem(0);
    cy.wait(500);

    // Verify translations
    data.translations.forEach((translation, i) => {
      if (translation) {
        cy.get(`#editItemTranslation0_0_${i}`).should('have.value', translation);
      }
    });

    navigationMenuPage.editItemSave();
    cy.wait(500);
  });

  afterEach(() => {
    navigationMenuPage.resetMenu();
    cy.wait(2000);
  });
});
