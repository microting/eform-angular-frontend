import loginPage from '../Login.page';
import foldersPage from '../Folders.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';
import {applicationLanguages} from '../../../src/app/common/const/application-languages.const';

const parentFolderName = generateRandmString();

describe('Folders - Delete child folder', function () {
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

    // Create a child folder
    const childName = generateRandmString();
    const childDescription = generateRandmString();
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#createFolderChildBtn').should('be.visible').click();
    cy.get('#cancelCreateBtn').should('be.visible');

    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(childName);
    cy.wait(500);

    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(childDescription);
    cy.wait(500);

    cy.get('#folderSaveBtn').click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Expand parent to see child
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button[aria-label="Toggle"]').then(($btn) => {
      if ($btn.attr('aria-expanded') === 'false') {
        cy.wrap($btn).click();
        cy.wait(1000);
      }
    });
  });

  it('should delete child folder', () => {
    // Count children before delete
    cy.get('mat-tree > mat-tree-node.children').then(($children) => {
      const rowCountBeforeDelete = $children.length;
      const childName = $children.first().find('.folder-tree-name').text().trim();

      // Delete the child
      cy.wrap($children.first()).find('button.mat-menu-trigger').click();
      cy.get('#deleteFolderTreeBtn').click();
      cy.get('#saveDeleteBtn').should('be.visible').click();
      cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify child was deleted
      cy.get('mat-tree > mat-tree-node.children').then(($childrenAfter) => {
        const rowCountAfterDelete = $childrenAfter.length;
        expect(
          rowCountAfterDelete,
          'Number of child rows hasn\'t changed after deleting child folder'
        ).to.equal(rowCountBeforeDelete - 1);
      });
    });
  });

  it('should not delete child if cancel was clicked', () => {
    // Create another child folder
    const childName = generateRandmString();
    const childDescription = generateRandmString();
    
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#createFolderChildBtn').should('be.visible').click();
    cy.get('#cancelCreateBtn').should('be.visible');

    const da = applicationLanguages[0];
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(childName);
    cy.wait(500);

    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(childDescription);
    cy.wait(500);

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

    // Count children before delete attempt
    cy.get('mat-tree > mat-tree-node.children').then(($children) => {
      const rowCountBeforeDelete = $children.length;

      // Try to delete but cancel
      cy.get('mat-tree-node.children .folder-tree-name').contains(childName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
      cy.get('#deleteFolderTreeBtn').click();
      cy.get('#cancelDeleteBtn').should('be.visible').click();
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify child was not deleted
      cy.get('mat-tree > mat-tree-node.children').then(($childrenAfter) => {
        const rowCountAfterDelete = $childrenAfter.length;
        expect(
          rowCountAfterDelete,
          'Number of child rows changed after cancel'
        ).to.equal(rowCountBeforeDelete);
      });

      cy.get('mat-tree-node.children .folder-tree-name').contains(childName).should('exist');
    });
  });

  it('should delete remaining child folders', () => {
    // Count children
    cy.get('mat-tree > mat-tree-node.children').then(($children) => {
      const rowCountBeforeDelete = $children.length;

      // Delete first child
      cy.wrap($children.first()).find('button.mat-menu-trigger').click();
      cy.get('#deleteFolderTreeBtn').click();
      cy.get('#saveDeleteBtn').should('be.visible').click();
      cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify child was deleted
      cy.get('mat-tree > mat-tree-node.children').then(($childrenAfter) => {
        const rowCountAfterDelete = $childrenAfter.length;
        expect(
          rowCountAfterDelete,
          'Folder not deleted'
        ).to.equal(rowCountBeforeDelete - 1);
      });
    });
  });

  after('should delete parent folder', () => {
    // Delete parent folder
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').first().find('button.mat-menu-trigger').click();
    cy.get('#deleteFolderTreeBtn').click();
    cy.get('#saveDeleteBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
    foldersPage.newFolderBtn().should('be.visible');
    
    // Verify parent was deleted
    foldersPage.rowNum().then((count) => {
      expect(count, 'Parent folder not deleted').to.equal(0);
    });
  });
});
