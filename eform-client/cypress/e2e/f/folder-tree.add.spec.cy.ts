import loginPage from '../Login.page';
import foldersPage from '../Folders.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';
import {applicationLanguages} from '../../../src/app/common/const/application-languages.const';

const folderNames = [
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
];

describe('Folders - Add folder', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('POST', '**/api/folders/list').as('loadFolders');
    foldersPage.goToFoldersPage();
    cy.wait('@loadFolders', { timeout: 30000 });
  });

  it('should create folder with name and description', () => {
    const description = generateRandmString();

    foldersPage.rowNum().then((rowCountBeforeCreation) => {
      // Create new folder
      foldersPage.newFolderBtn().click();
      cy.wait(500);
      cy.get('#cancelCreateBtn').should('be.visible');

      // Select language and enter name
      const da = applicationLanguages[0];
      cy.get('#createLanguageSelector input').type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      
      const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
      cy.get(`#createFolderNameTranslation_${nameIndex}`).type(folderNames[0]);
      cy.wait(500);

      // Enter description
      cy.get('#createLanguageSelector input').clear().type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
      cy.wait(500);

      // Save
      cy.intercept({method: 'POST', url: '**/api/folders'}).as('createFolder');
      cy.intercept({method: 'PUT', url: '**/api/folders'}).as('updateFolder');
      cy.get('#folderSaveBtn').click();
      cy.wait(['@createFolder', '@updateFolder'], { timeout: 30000 }).then(() => cy.log('Folder operation completed'));
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify folder was created
      foldersPage.rowNum().then((rowCountAfterCreation) => {
        expect(
          rowCountAfterCreation,
          'Number of rows hasn\'t changed after creating new folder'
        ).to.equal(rowCountBeforeCreation + 1);
      });

      // Verify folder name
      cy.get('.folder-tree-name').contains(folderNames[0]).should('exist');
    });
  });

  it('should not create folder if cancel was clicked', () => {
    foldersPage.rowNum().then((rowCountBeforeCreation) => {
      // Open create dialog
      foldersPage.newFolderBtn().click();
      cy.wait(500);
      cy.get('#cancelCreateBtn').should('be.visible');

      // Enter some data
      const da = applicationLanguages[0];
      cy.get('#createLanguageSelector input').type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      
      const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
      cy.get(`#createFolderNameTranslation_${nameIndex}`).type(generateRandmString());
      cy.wait(500);

      // Click cancel
      cy.get('#cancelCreateBtn').click();
      foldersPage.newFolderBtn().should('be.visible');
      cy.wait(500);

      // Verify no folder was created
      foldersPage.rowNum().then((rowCountAfterCreation) => {
        expect(
          rowCountAfterCreation,
          'Number of rows has changed after cancel'
        ).to.equal(rowCountBeforeCreation);
      });
    });
  });

  it('should create new folder with bold description', () => {
    const description = generateRandmString();

    // Open create dialog
    foldersPage.newFolderBtn().click();
    cy.wait(500);
    cy.get('#cancelCreateBtn').should('be.visible');

    // Select language and enter name
    const da = applicationLanguages[0];
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(folderNames[1]);
    cy.wait(500);

    // Enter description with bold formatting
    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
    
    // Select all and apply bold
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type('{ctrl+a}');
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} button[title="Bold"]`).click();
    cy.wait(500);

    // Save
    cy.intercept({method: 'POST', url: '**/api/folders'}).as('createFolder');
    cy.intercept({method: 'PUT', url: '**/api/folders'}).as('updateFolder');
    cy.get('#folderSaveBtn').click();
    cy.wait(['@createFolder', '@updateFolder'], { timeout: 30000 }).then(() => cy.log('Folder operation completed'));
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Verify bold formatting was saved
    cy.get('.folder-tree-name').contains(folderNames[1]).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('html').should('contain', '<b>');
    cy.get('#cancelEditBtn').click();
  });

  it('should create new folder with underline description', () => {
    const description = generateRandmString();

    // Open create dialog
    foldersPage.newFolderBtn().click();
    cy.wait(500);
    cy.get('#cancelCreateBtn').should('be.visible');

    // Select language and enter name
    const da = applicationLanguages[0];
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(folderNames[2]);
    cy.wait(500);

    // Enter description with underline formatting
    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
    
    // Select all and apply underline
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type('{ctrl+a}');
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} button[title="Underline"]`).click();
    cy.wait(500);

    // Save
    cy.intercept({method: 'POST', url: '**/api/folders'}).as('createFolder');
    cy.intercept({method: 'PUT', url: '**/api/folders'}).as('updateFolder');
    cy.get('#folderSaveBtn').click();
    cy.wait(['@createFolder', '@updateFolder'], { timeout: 30000 }).then(() => cy.log('Folder operation completed'));
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Verify underline formatting was saved
    cy.get('.folder-tree-name').contains(folderNames[2]).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('html').should('contain', '<u>');
    cy.get('#cancelEditBtn').click();
  });

  it('should create new folder with italic description', () => {
    const description = generateRandmString();

    // Open create dialog
    foldersPage.newFolderBtn().click();
    cy.wait(500);
    cy.get('#cancelCreateBtn').should('be.visible');

    // Select language and enter name
    const da = applicationLanguages[0];
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(folderNames[3]);
    cy.wait(500);

    // Enter description with italic formatting
    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
    
    // Select all and apply italic
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type('{ctrl+a}');
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} button[title="Italic"]`).click();
    cy.wait(500);

    // Save
    cy.intercept({method: 'POST', url: '**/api/folders'}).as('createFolder');
    cy.intercept({method: 'PUT', url: '**/api/folders'}).as('updateFolder');
    cy.get('#folderSaveBtn').click();
    cy.wait(['@createFolder', '@updateFolder'], { timeout: 30000 }).then(() => cy.log('Folder operation completed'));
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Verify italic formatting was saved
    cy.get('.folder-tree-name').contains(folderNames[3]).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('html').should('contain', '<i>');
    cy.get('#cancelEditBtn').click();
  });

  it('should create new folder with strike-through description', () => {
    const description = generateRandmString();

    // Open create dialog
    foldersPage.newFolderBtn().click();
    cy.wait(500);
    cy.get('#cancelCreateBtn').should('be.visible');

    // Select language and enter name
    const da = applicationLanguages[0];
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(folderNames[4]);
    cy.wait(500);

    // Enter description with strike-through formatting
    cy.get('#createLanguageSelector input').clear().type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type(description);
    
    // Select all and apply strike-through
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).type('{ctrl+a}');
    cy.get(`#createFolderDescriptionTranslation_${nameIndex} button[title="Strike"]`).click();
    cy.wait(500);

    // Save
    cy.intercept({method: 'POST', url: '**/api/folders'}).as('createFolder');
    cy.intercept({method: 'PUT', url: '**/api/folders'}).as('updateFolder');
    cy.get('#folderSaveBtn').click();
    cy.wait(['@createFolder', '@updateFolder'], { timeout: 30000 }).then(() => cy.log('Folder operation completed'));
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Verify strike-through formatting was saved
    cy.get('.folder-tree-name').contains(folderNames[4]).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');
    
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('html').should('contain', '<s>');
    cy.get('#cancelEditBtn').click();
  });

  after('should delete folders', () => {
    cy.wait(1500);
    // Delete all folders created in this test
    for (let i = 0; i < 5; i++) {
      cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node').first().then(($folder) => {
        if ($folder.length > 0) {
          cy.wrap($folder).find('button.mat-menu-trigger').click();
          cy.get('#deleteFolderTreeBtn').click();
          cy.intercept('DELETE', '**/api/folders/**').as('deleteFolder');
          cy.get('#saveDeleteBtn').should('be.visible').click();
          cy.wait('@deleteFolder', { timeout: 30000 });
          foldersPage.newFolderBtn().should('be.visible');
          cy.wait(500);
        }
      });
    }
  });
});
