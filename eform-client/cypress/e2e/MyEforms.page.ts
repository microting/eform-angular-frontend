import { PageWithNavbarPage } from './PageWithNavbar.page';
import XMLForEform from '../../e2e/Constants/XMLForEform';
import { FoldersTreeRowObject } from './Folders.page';
import { DeviceUsersRowObject } from './DeviceUsers.page';
import tagsModalPage from './TagsModal.page';
//import path from 'path';
const path = require('path');

class MyEformsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public newEformBtn() {
    const ele = cy.get('#newEFormBtn');
    ele.should('be.visible').should('be.enabled');
    // @ts-ignore
    return ele;
  }

  public rowNum() {
    // @ts-ignore
    // cy.get('.eform-id').then(($el) => {
    //   return Cypress.$($el).length;
    //   //cy.log(itemCount)
    //   return itemCount;
    // })
    cy.log('rowNum');
    return cy.get('.eform-id').its('length');
  }

  public idSortBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.eform-id-header .mat-header-cell-inner .mat-sort-header').should('be.visible').should('be.enabled');
  }

  public createdAtSortBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.eform-created-at-header .mat-header-cell-inner .mat-sort-header').should('be.visible').should('be.enabled');
  }

  public eformNameSortBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.eform-name-header .mat-header-cell-inner .mat-sort-header').should('be.visible').should('be.enabled');
  }

  public eformFilter(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#labelInput');
  }

  // Create eform modal
  public createEformTagSelector() {
    // @ts-ignore
    const ele = cy.get('#createEFormMultiSelector');
    ele.should('be.visible').should('be.enabled');
    return ele;
  }
  public importEformsBtn() {
    // @ts-ignore
    const ele = cy.get('#importEformsBtn');
    ele.should('be.visible').should('be.enabled');
    return ele;
  }

  public createEformNewTagInput() {
    // @ts-ignore
    const ele = cy.get('#addTagInput');
    ele.should('be.visible');
    return ele;
  }

  public xmlTextArea() {
    // @ts-ignore
    const ele = cy.get('#eFormXml');
    ele.should('be.visible');
    return ele;
  }

  public createEformBtn() {
    // @ts-ignore
    const ele = cy.get('#createEformBtn');
    ele.should('be.visible').should('be.enabled');
    return ele;
  }

  public cancelCreateEformBtn() {
    return cy.get('#cancelCreateEformBtn').should('be.visible').should('be.enabled');
  }

  tagEditSaveBtn() {
    return cy.get('#tagEditSaveBtn').should('be.visible').should('be.enabled');
  }

  tagEditSaveCancelBtn() {
    return cy.get('#tagEditSaveCancelBtn').should('be.visible').should('be.enabled');
  }

  tagSelector() {
    // @ts-ignore
    return cy.get('#tagSelector').should('be.visible');
  }

  saveParingBtn() {
    return cy.get('#saveParingBtn').should('be.visible').should('be.enabled');
  }

  cancelParingBtn() {
    return cy.get('#cancelParingBtn').should('be.visible').should('be.enabled');
  }

  xlsxImportInput() {
    return cy.get('#xlsxImportInput').should('be.visible');
  }

  eformsManageTagsBtn(): Cypress.Chainable<JQuery> {
    const ele = cy.get('#eformsManageTagsBtn');
    ele.should('be.visible');
    ele.should('be.enabled');
    return ele;
  }

  getFirstMyEformsRowObj(): Cypress.Chainable<MyEformsRowObject> {
    cy.wait(500);
    const result = new MyEformsRowObject();
    return result.getRow(1);
  }

  // getEformsRowObjByNameEForm(
  //   nameEform: string
  // ): Cypress.Chainable<MyEformsRowObject> {
  //   cy.wait(500);
  //   this.rowNum().then((rowNum) => {
  //     console.log('rowNum' + rowNum.length);
  //     for (let i = 1; i < rowNum + 1; i++) {
  //       myEformsRowObject.getRow(i).then((form) => {
  //         if (form.eFormName === nameEform) {
  //           console.log('form.eFormName', form.eFormName);
  //           return cy.wrap(form);
  //         }
  //       });
  //     }
  //     return null;
  //   });
  // }

  getLastMyEformsRowObj(): Cypress.Chainable<MyEformsRowObject> {
    cy.wait(1500);
    const obj = new MyEformsRowObject();
    const rowNum = this.rowNum();
    return obj.getRow(rowNum);
  }

  getEformRowObj(
    num,
    pause: boolean = false
  ): Cypress.Chainable<MyEformsRowObject> {
    if (pause) {
      cy.wait(500);
    }
    return myEformsRowObject.getRow(num);
  }

  public clearEFormTable() {
    cy.wait(500);
    // Check if table has any rows before trying to delete
    cy.get('body').then($body => {
      if ($body.find('.eform-id').length > 0) {
        // Table has rows, delete them
        cy.get('.eform-id').its('length').as('rowCount');
        cy.get('@rowCount').then((rowCount) => {
          for (let i = 1; i <= rowCount; i++) {
              cy.get('#delete-eform-btn-0').click();
              cy.intercept('DELETE' , '**/api/templates/delete/*').as('deleteEform');
              cy.get('#eFormDeleteDeleteBtn').should('be.visible').click();
              cy.wait('@deleteEform', {timeout: 50000});
          }
        });
      }
    });
  }

  createNewEform(
    eFormLabel,
    newTagsList = [],
    tagAddedNum = 0,
    xml = ''
  ) {
    // @ts-ignore
    const spinnerAnimation = cy.get('#spinner-animation');
    spinnerAnimation.should('not.visible', {timeout: 50000});
    this.newEformBtn().click();
    // @ts-ignore
    cy.wait(500);
    this.xmlTextArea().should('be.visible', {timeout: 40000});
    // Create replaced xml and insert it in textarea
    if (!xml) {
      xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
    }
    cy.window().then(win => {
      win.document.getElementById('eFormXml').value = xml;
    });
    cy.wait(200);
    this.xmlTextArea().type(' ');
    cy.wait(500);
    // Create new tags
    const addedTags = newTagsList;
    if (newTagsList.length > 0) {
      this.createEformNewTagInput().type(newTagsList.join(','));
      spinnerAnimation.should('not.visible', {timeout: 50000});
    }
    // Add existing tags
    const selectedTags = [];
    if (tagAddedNum > 0) {
      spinnerAnimation.should('not.exist', {timeout: 50000});
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector().click();
        cy.wait(500);
        const selectedTag = cy.get('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.text());
        selectedTag.should('be.visible', {timeout: 40000});
        selectedTag.should('be.enabled', {timeout: 40000});
        selectedTag.click();
        cy.wait(500);
        spinnerAnimation.should('not.visible', {timeout: 50000});
        cy.get('#createEformBtn').should('be.visible', {timeout: 10000});
      }
    }
    cy.intercept('POST', '/api/templates/create').as('createEform');
    this.createEformBtn().click();
    // @ts-ignore
    cy.wait('@createEform', {timeout: 50000}).then(() => {
      spinnerAnimation.should('not.be.visible', {timeout: 50000});
    });
    this.newEformBtn().should('be.enabled', {timeout: 40000});
    // @ts-ignore
    cy.wait(500);
    return { added: addedTags, selected: selectedTags };
  }
  createNewTag(nameTag) {
    this.createNewTags([nameTag]);
  }

  createNewTags(nameTags) {
    cy.get(this.eformsManageTagsBtn()).click();
    cy.get(tagsModalPage.tagsModalCloseBtn()).should('be.visible');
    for (let i = 0; i < nameTags.length; i++) {
      tagsModalPage.createTag(nameTags[i]);
    }
    tagsModalPage.closeTagModal();
    cy.get(this.newEformBtn()).should('be.visible').click();
  }

  removeTag(nameTag) {
    this.removeTags([nameTag]);
  }

  removeTags(nameTags) {
    cy.get(this.eformsManageTagsBtn()).click();
    cy.get(tagsModalPage.tagsModalCloseBtn()).should('be.visible');
    for (let i = 0; i < nameTags.length; i++) {
      const tag = tagsModalPage.getTagByName(nameTags[i]);
      tag.deleteTag();
    }
    tagsModalPage.closeTagModal();
    cy.get(this.newEformBtn()).should('be.visible').click();
  }

  enterTagFilter(nameTag) {
    cy.get(this.tagSelector())
      .find('input')
      .type(nameTag);
    cy.get('ng-dropdown-panel .ng-option')
      .should('be.visible')
      .first()
      .click();
    cy.get('#spinner-animation').should('not.be.visible');
  }
}

const myEformsPage = new MyEformsPage();

class MyEformsRowObject {
  constructor() {}

  element;
  id;
  createdAt;
  eFormName;
  tags;
  editTagsBtn;
  addPairEformBtn;
  editPairEformBtn;
  editColumnsBtn;
  deleteBtn;
  uploadZipArchiveBtn;
  goVisualEditorBtn;

  getRow(rowNum) {
    const currentPosition = rowNum - 1;
    this.element = cy.get('#mainPageEFormsTableBody tbody tr').eq(currentPosition);
    cy.get(`#eform-id-${currentPosition}`)
      .eq(0)
      .invoke('text')
      .then((text) => {
        this.id = +text;
      });
    cy.get(`#eform-created-at-${currentPosition}`)
      .eq(0)
      .invoke('text')
      .then((text) => {
        this.createdAt = new Date(text);
      });
    cy.get(`#eform-label-${currentPosition}`)
      .eq(0)
      .invoke('text')
      .then((text) => {
        this.eFormName = text;
      });
    cy.get('#mainPageEFormsTableBody').then($body => {
      if ($body.find(`#eform-tag-${currentPosition} span`).length > 0) {
        this.tags = cy.get(`#eform-tag-${currentPosition} span`);
      } else {
        this.tags = [];
      }
      if ($body.find(`eform-add-btn-${currentPosition}`).length > 0) {
        this.addPairEformBtn = cy.get(`#eform-add-btn-${currentPosition}`);
      } else {
        this.addPairEformBtn = [];
      }
      if ($body.find(`#eform-pairing-btn-${currentPosition}`).length > 0) {
        this.editPairEformBtn = cy.get(`#eform-pairing-btn-${currentPosition}`);
      } else {
        this.editPairEformBtn = [];
      }

      //this.editColumnsBtn = cy.get(`#edit-columnts-btn-${currentPosition}`).eq(0);
      if ($body.find(`#edit-columns-btn-${currentPosition}`).length > 0) {
        this.editColumnsBtn = cy.get(`#edit-columns-btn-${currentPosition}`).eq(0);
      } else {
        this.editColumnsBtn = [];
      }
    });
    //this.tags = cy.get(`#eform-tag-${currentPosition} span`);
    this.editTagsBtn = cy.get(`#eform-edit-btn-${currentPosition}`).eq(0);

    //this.addPairEformBtn = cy.get(`#eform-add-btn-${currentPosition}`);
    //this.editColumnsBtn = cy.get(`#edit-columnts-btn-${currentPosition}`).eq(0);
    this.deleteBtn = cy.get(`#delete-eform-btn-${currentPosition}`).eq(0);
    //this.uploadZipArchiveBtn = cy.get(`#upload-zip-btn-${currentPosition}`).eq(0);
    this.goVisualEditorBtn = cy.get(`#edit-eform-btn-${currentPosition}`);
    return cy.wrap(this);
  }


  deleteEForm() {
    cy.wait(500);
    const eFormDeleteDeleteBtn = cy.get('#eFormDeleteDeleteBtn');
    eFormDeleteDeleteBtn.should('be.visible').click();
    cy.wait(500);
  }

  addTag(tag: string) {
    this.editTagsBtn.scrollIntoView().click();
    cy.wait(500);
    const tagSelector = cy.get('app-eform-edit-tags-modal #tagSelector input');
    tagSelector.should('be.visible').type(tag);
    const ngDropdownPanel = cy.get('.ng-option');
    ngDropdownPanel.should('be.visible').click();
    myEformsPage.tagEditSaveBtn().click();
    cy.get('#spinner-animation').should('not.exist');
    cy.wait(500);
  }

  deleteTags(tags: string[]) {
    this.editTagsBtn.scrollIntoView().click();
    cy.get('app-eform-edit-tags-modal #tagSelector').should('be.visible');
    const tagSelectorValues = cy.get('app-eform-edit-tags-modal #tagSelector .ng-value');
    tagSelectorValues.each(($tagSelectorValue) => {
      const tagName = $tagSelectorValue.find('span.ng-value-label').text();
      const deleteTagButton = $tagSelectorValue.find('span');
      if (tags.includes(tagName)) {
        deleteTagButton.click();
      }
    });
    myEformsPage.tagEditSaveBtn().click();
    cy.get('#spinner-animation').should('not.exist');
    cy.wait(500);
  }

  pair(folder, users) {
    const spinnerAnimation = cy.get('#spinner-animation');
    if (this.editPairEformBtn.should('exist')) {
      this.editPairEformBtn.click();
    } else {
      this.addPairEformBtn.click();
    }
    cy.wait(500);
    spinnerAnimation.should('not.exist', { timeout: 90000 });
    (myEformsPage.cancelParingBtn()).should('be.visible', { timeout: 40000 });
    cy.wait(500);
    const folders = cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node');
    //cy.wait(10000);
    for (let i = 0; i < folders.length; i++) {
      if (
        ((folders[i].$('div > div')).invoke('text')).includes(
          folder.name
        )
      ) {
        (folders[i].$('div')).click();
        cy.wait(1000);
      }
    }
    myEformsPage.takeScreenshot();
    for (let i = 0; i < users.length; i++) {
      //const name = `#mat-checkbox-${i+2} > label > div.mat-checkbox-inner-container`;
      const checkbox = cy.get(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      //checkbox.should('be.visible').should('be.enabled');
      checkbox.click();
      cy.wait(500);
    }
    (myEformsPage.saveParingBtn()).click();
    spinnerAnimation.should('not.exist', { timeout: 90000 });
    cy.wait(1000);
  }

  unPair(users) {
    const spinnerAnimation = cy.get('#spinner-animation');
    this.editPairEformBtn.click();
    cy.wait(1000);
    spinnerAnimation.should('not.be.visible', { timeout: 40000 });
    cy.get(myEformsPage.cancelParingBtn()).should('be.visible', { timeout: 40000 });
    for (let i = 0; i < users.length; i++) {
      const checkbox = cy.get(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      checkbox.parent().should('be.visible', { timeout: 40000 }).click();
      cy.wait(1000);
    }
    cy.get(myEformsPage.saveParingBtn()).click();
    spinnerAnimation.should('not.be.visible', { timeout: 90000 });
    cy.wait(1000);
  }

  goToVisualEditor() {
    this.goVisualEditorBtn.click();
    cy.wait(500);
    cy.get('#manageTags').should('be.visible', { timeout: 40000 }).click();
    const spinnerAnimation = cy.get('#spinner-animation');
    spinnerAnimation.should('not.be.visible', { timeout: 40000 });
    cy.wait(500);
  }
}

const myEformsRowObject = new MyEformsRowObject();

export { myEformsRowObject, myEformsPage}
