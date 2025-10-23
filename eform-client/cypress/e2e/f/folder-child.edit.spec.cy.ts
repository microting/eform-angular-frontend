import loginPage from '../Login.page';
import foldersPage from '../Folders.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';
import {applicationLanguages} from '../../../src/app/common/const/application-languages.const';

const parentFolderName = generateRandmString();
let childFolderName = generateRandmString();

describe('Folders - Edit child folder', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    foldersPage.goToFoldersPage();
    
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
    const childDescription = generateRandmString();
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#createFolderChildBtn').should('be.visible').click();
    cy.get('#cancelCreateBtn').should('be.visible');

    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    cy.get(`#createFolderNameTranslation_${nameIndex}`).type(childFolderName);
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

  it('should change child folder name', () => {
    const newName = generateRandmString();

    cy.wait(500);
    
    // Open edit modal for child
    cy.get('mat-tree-node.children .folder-tree-name').contains(childFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');

    const da = applicationLanguages[0];
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    
    // Change name
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderNameTranslation_${nameIndex}`).clear().type(newName);
    cy.wait(500);

    // Save
    cy.get('#saveEditBtn').click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Expand parent again to see updated child
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button[aria-label="Toggle"]').then(($btn) => {
      if ($btn.attr('aria-expanded') === 'false') {
        cy.wrap($btn).click();
        cy.wait(1000);
      }
    });

    // Verify name changed
    cy.get('mat-tree-node.children .folder-tree-name').contains(newName).should('exist');
    cy.get('mat-tree-node.children .folder-tree-name').contains(childFolderName).should('not.exist');

    childFolderName = newName;
  });

  it('should change child folder description', () => {
    const newDescription = generateRandmString();

    cy.wait(500);
    
    // Open edit modal for child
    cy.get('mat-tree-node.children .folder-tree-name').contains(childFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
    cy.get('#editFolderTreeBtn').click();
    cy.get('#cancelEditBtn').should('be.visible');

    const da = applicationLanguages[0];
    const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
    
    // Change description
    cy.get('#createLanguageSelector input').type(da.text);
    cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
    cy.wait(500);
    
    cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).clear().type(newDescription);
    cy.wait(500);

    // Save
    cy.get('#saveEditBtn').click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);

    // Expand parent again
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button[aria-label="Toggle"]').then(($btn) => {
      if ($btn.attr('aria-expanded') === 'false') {
        cy.wrap($btn).click();
        cy.wait(1000);
      }
    });

    // Verify description changed
    cy.get('mat-tree-node.children .folder-tree-name').contains(childFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
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

    cy.wait(500);
    
    // Get count before edit
    cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node').then(($parents) => {
      const rowParentsCountBeforeEditing = $parents.length;

      // Open edit modal for child
      cy.get('mat-tree-node.children .folder-tree-name').contains(childFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
      cy.get('#editFolderTreeBtn').click();
      cy.get('#cancelEditBtn').should('be.visible');

      const da = applicationLanguages[0];
      const nameIndex = applicationLanguages.findIndex((x) => x.text === da.text);
      
      // Get original description
      cy.get('#createLanguageSelector input').type(da.text);
      cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
      cy.wait(500);
      
      cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('text').then((originalDescription) => {
        // Change name and description
        cy.get(`#editFolderNameTranslation_${nameIndex}`).clear().type(newName);
        cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).clear().type(newDescription);
        cy.wait(500);

        // Click cancel
        cy.get('#cancelEditBtn').click();
        foldersPage.newFolderBtn().should('be.visible');
        cy.wait(500);

        // Verify count unchanged
        cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node').then(($parentsAfter) => {
          const rowParentsCountAfterEditing = $parentsAfter.length;
          expect(rowParentsCountAfterEditing).to.equal(rowParentsCountBeforeEditing);
        });

        // Expand parent again
        cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').find('button[aria-label="Toggle"]').then(($btn) => {
          if ($btn.attr('aria-expanded') === 'false') {
            cy.wrap($btn).click();
            cy.wait(1000);
          }
        });

        // Verify name unchanged
        cy.get('mat-tree-node.children .folder-tree-name').contains(childFolderName).should('exist');
        cy.get('mat-tree-node.children .folder-tree-name').contains(newName).should('not.exist');

        // Verify description unchanged
        cy.get('mat-tree-node.children .folder-tree-name').contains(childFolderName).parents('mat-tree-node').find('button.mat-menu-trigger').click();
        cy.get('#editFolderTreeBtn').click();
        cy.get('#cancelEditBtn').should('be.visible');
        
        cy.get('#createLanguageSelector input').type(da.text);
        cy.get('ng-dropdown-panel .ng-option').contains(da.text).click();
        cy.wait(500);
        
        cy.get(`#editFolderDescriptionTranslation_${nameIndex} .NgxEditor__Content`).invoke('text').should('equal', originalDescription);
        cy.get('#cancelEditBtn').click();
      });
    });
  });

  after('should delete folder', () => {
    // Delete parent folder (which will delete child too)
    cy.get('.folder-tree-name').contains(parentFolderName).parents('mat-tree-node').first().find('button.mat-menu-trigger').click();
    cy.get('#deleteFolderTreeBtn').click();
    cy.get('#saveDeleteBtn').should('be.visible').click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
    foldersPage.newFolderBtn().should('be.visible');
    
    // Verify folders deleted
    foldersPage.rowNum().then((count) => {
      expect(count, 'Folders not deleted').to.equal(0);
    });
  });
});
