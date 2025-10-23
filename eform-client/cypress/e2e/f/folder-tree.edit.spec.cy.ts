import loginPage from '../Login.page';
import foldersPage from '../Folders.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';
import {applicationLanguages} from '../../../src/app/common/const/application-languages.const';

let folderName = generateRandmString();

describe('Folders - Edit folder', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('POST', '**/api/folders/list').as('loadFolders');
    foldersPage.goToFoldersPage();
    cy.wait('@loadFolders', { timeout: 30000 });
    
    // Create a folder to edit
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
  });

  it('should change folder name', () => {
    const oldName = folderName;
    const newName = generateRandmString();

    // Get description before edit
    cy.get('.folder-tree-name').contains(oldName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    const da = applicationLanguages[0];
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    
    // Get original description
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('text').then((originalDescription) => {
      // Clear and enter new name
      cy.get(`#editFolderNameTranslation_${nameIndex}`).clear().type(newName);
      cy.wait(500);

      // Save
      cy.intercept('PUT', '**/api/folders').as('updateFolder');
      cy.get('#saveEditBtn').click();
      cy.wait('@updateFolder', { timeout: 30000 });
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify name changed
      cy.get('.folder-tree-name').contains(newName).should('exist');
      
      // Verify description unchanged
      cy.get('.folder-tree-name').contains(newName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
      cy.get('#editFolderTreeBtn').click();
      cy.get('#cancelEditBtn').should('be.visible');
      
      cy.get('#createLanguageSelector input').type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      
      cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('text').should('equal', originalDescription);
      cy.get('#cancelEditBtn').click();

      folderName = newName;
    });
  });

  it('should change folder description', () => {
    const newDescription = generateRandmString();

    // Open edit dialog
    cy.get('.folder-tree-name').contains(folderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    const da = applicationLanguages[0];
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    
    // Clear and enter new description
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).clear().type(newDescription);
    cy.wait(500);

    // Save
    cy.intercept('PUT', '**/api/folders').as('updateFolder');
    cy.get('#saveEditBtn').click();
    cy.wait('@updateFolder', { timeout: 30000 });
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Verify description changed
    cy.get('.folder-tree-name').contains(folderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('text').should('equal', newDescription);
    cy.get('#cancelEditBtn').click();
  });

  it('should not change name and description if cancel was clicked', () => {
    const newName = generateRandmString();
    const newDescription = generateRandmString();

    // Get current name and description
    cy.get('.folder-tree-name').contains(folderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    const da = applicationLanguages[0];
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('text').then((originalDescription) => {
      // Enter new values
      cy.get(`#editFolderNameTranslation_${nameIndex}`).clear().type(newName);
      cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).clear().type(newDescription);
      cy.wait(500);

      // Click cancel
      cy.get('#cancelEditBtn').click();
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify name unchanged
      cy.get('.folder-tree-name').contains(folderName).should('exist');
      cy.get('.folder-tree-name').contains(newName).should('not.exist');
      
      // Verify description unchanged
      cy.get('.folder-tree-name').contains(folderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
      cy.get('#editFolderTreeBtn').click();
      cy.get('#cancelEditBtn').should('be.visible');
      
      cy.get('#createLanguageSelector input').type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      
      cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('text').should('equal', originalDescription);
      cy.get('#cancelEditBtn').click();
    });
  });

  after('should delete folder', () => {
    cy.get('.folder-tree-name').contains(folderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#deleteFolderTreeBtn').click();
    cy.intercept('DELETE', '**/api/folders/**').as('deleteFolder');
    cy.get('#saveDeleteBtn').should('be.visible').click();
    cy.wait('@deleteFolder', { timeout: 30000 });
    foldersPage.newFolderBtn().should('be.visible');
    
    // Verify folder was deleted
    cy.get('.folder-tree-name').contains(folderName).should('not.exist');
  });
});
