import loginPage from '../Login.page';
import foldersPage from '../Folders.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';
import {applicationLanguages} from '../../../src/app/common/const/application-languages.const';

const parentFolderName = generateRandmString();

describe('Folders - Add child folder', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('POST', '**/api/folders/list').as('loadFolders');
    foldersPage.goToFoldersPage();
    cy.wait('@loadFolders', { timeout: 30000 });
    
    // Create a parent folder
    const description = generateRandmString();
    foldersPage.newFolderBtn().click();
    cy.wait(500);
    cy.get('#cancelCreateBtn').should('be.visible');

    const da = applicationLanguages[0];
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(parentFolderName);
    cy.wait(500);

    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
    cy.wait(500);

    cy.get('#folderSaveBtn').click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);
  });

  it('should create child folder with name and description', () => {
    const childName = generateRandmString();
    const childDescription = generateRandmString();

    // Count children before creation
    cy.get('mat-tree > mat-tree-node.children').then(($children) => {
      const rowCountBeforeCreation = $children.length;

      // Open parent folder menu and create child
      cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
      cy.get('#createFolderChildBtn').should('be.visible').click();
      cy.get('#cancelCreateBtn').should('be.visible');

      // Enter child folder details
      const da = applicationLanguages[0];
      cy.get('#createLanguageSelector input').type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      
      const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
      cy.get(`#createFolderNameTranslation_${nameIndex}`).type(childName);
      cy.wait(500);

      cy.get('#createLanguageSelector input').clear().type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(childDescription);
      cy.wait(500);

      // Save
      cy.get('#folderSaveBtn').click();
      cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Expand parent to see children
      cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button[aria-label="Toggle"]').then(($btn) => {
        if ($btn.attr('aria-expanded') === 'false') {
          cy.wrap($btn).click();
          cy.wait(1000);
        }
      });

      // Verify child was created
      cy.get('mat-tree > mat-tree-node.children').then(($childrenAfter) => {
        const rowCountAfterCreation = $childrenAfter.length;
        expect(
          rowCountAfterCreation,
          'Number of child rows hasn\'t changed after creating new child folder'
        ).to.equal(rowCountBeforeCreation + 1);
      });

      // Verify child folder exists
      cy.get('mat-tree-node.children .folder-tree-name').contains(childName).should('exist');
    });
  });

  after('should delete folders', () => {
    // Delete parent folder (which will delete children too)
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').first().find('button.mat-menu-trigger').click();
    cy.get('#deleteFolderTreeBtn').click();
    cy.get('#saveDeleteBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Verify all folders deleted
    foldersPage.rowNum().then((count) => {
      expect(count, 'Folders not deleted').to.equal(0);
    });
  });
});
