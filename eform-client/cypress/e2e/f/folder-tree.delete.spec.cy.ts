import loginPage from '../Login.page';
import foldersPage from '../Folders.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';
import {applicationLanguages} from '../../../src/app/common/const/application-languages.const';

let folderName = generateRandmString();

describe('Folders - Delete folder', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('POST', '**/api/folders/list').as('loadFolders');
    foldersPage.goToFoldersPage();
    cy.wait('@loadFolders', { timeout: 30000 });
  });

  it('should delete folder', () => {
    // Create a folder
    const description = generateRandmString();
    foldersPage.newFolderBtn().click();
    cy.wait(500);
    cy.get('#cancelCreateBtn').should('be.visible');

    const da = applicationLanguages[0];
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(folderName);
    cy.wait(500);

    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
    cy.wait(500);

    cy.intercept({method: 'POST', url: '**/api/folders'}).as('createFolder');
    cy.intercept({method: 'PUT', url: '**/api/folders'}).as('updateFolder');
    cy.get('#folderSaveBtn').click();
    cy.wait(['@createFolder', '@updateFolder'], { timeout: 30000 }).then(() => cy.log('Folder operation completed'));
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Get count before delete
    foldersPage.rowNum().then((rowCountBeforeDelete) => {
      // Delete the folder
      cy.get('.folder-tree-name').contains(folderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
      cy.get('#deleteFolderTreeBtn').click();
      cy.intercept('DELETE', '**/api/folders/**').as('deleteFolder');
      cy.get('#saveDeleteBtn').should('be.visible').click();
      cy.wait('@deleteFolder', { timeout: 30000 });
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify folder was deleted
      foldersPage.rowNum().then((rowCountAfterDelete) => {
        expect(
          rowCountAfterDelete,
          'Folder was not deleted correctly'
        ).to.equal(rowCountBeforeDelete - 1);
      });

      cy.get('.folder-tree-name').contains(folderName).should('not.exist');
    });
  });

  it('should not delete if cancel was clicked', () => {
    // Create a folder
    folderName = generateRandmString();
    const description = generateRandmString();
    
    foldersPage.newFolderBtn().click();
    cy.wait(500);
    cy.get('#cancelCreateBtn').should('be.visible');

    const da = applicationLanguages[0];
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(folderName);
    cy.wait(500);

    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
    cy.wait(500);

    cy.intercept({method: 'POST', url: '**/api/folders'}).as('createFolder');
    cy.intercept({method: 'PUT', url: '**/api/folders'}).as('updateFolder');
    cy.get('#folderSaveBtn').click();
    cy.wait(['@createFolder', '@updateFolder'], { timeout: 30000 }).then(() => cy.log('Folder operation completed'));
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Get count before delete attempt
    foldersPage.rowNum().then((rowCountBeforeDelete) => {
      // Try to delete but cancel
      cy.get('.folder-tree-name').contains(folderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
      cy.get('#deleteFolderTreeBtn').click();
      cy.get('#cancelDeleteBtn').should('be.visible').click();
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify folder was not deleted
      foldersPage.rowNum().then((rowCountAfterCancelDelete) => {
        expect(
          rowCountAfterCancelDelete,
          'Number of rows changed after cancel'
        ).to.equal(rowCountBeforeDelete);
      });

      cy.get('.folder-tree-name').contains(folderName).should('exist');
    });
  });

  after('should delete folder', () => {
    // Clean up - delete the folder
    cy.get('.folder-tree-name').contains(folderName).then(($folder) => {
      if ($folder.length > 0) {
        cy.wrap($folder).parents('mat-tree-node').find('button.mat-menu-trigger').click();
        cy.get('#deleteFolderTreeBtn').click();
        cy.intercept('DELETE', '**/api/folders/**').as('deleteFolder');
        cy.get('#saveDeleteBtn').should('be.visible').click();
        cy.wait('@deleteFolder', { timeout: 30000 });
        foldersPage.newFolderBtn().should('be.visible');
        
        // Verify folder was deleted
        foldersPage.rowNum().then((countAfterDelete) => {
          expect(countAfterDelete).to.equal(0);
        });
      }
    });
  });
});
