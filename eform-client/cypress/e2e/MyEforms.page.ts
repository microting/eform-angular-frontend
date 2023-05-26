import {PageWithNavbarPage} from './PageWithNavbar.page';
import XMLForEform from '../../e2e/Constants/XMLForEform';
import tagsModalPage from './TagsModal.page';
import {selectValueInNgSelector} from './helper-functions';

class MyEformsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public newEformBtn() {
    return cy.get('#newEFormBtn').should('be.visible').should('be.enabled');
  }

  public rowNum(): Cypress.Chainable<number> {
    return cy.get('#mainPageEFormsTableBody tbody tr').its('length');
    /* return cy.get('#mainPageEFormsTableBody tbody tr')
       .then((rows) => {
         const count = rows.length;
         return cy.wrap(count).as('rowCount');
       })
       .then(() => cy.get('@rowCount'))
       .then((rowCount) => +rowCount);*/
  }


  public importEformsBtn() {
    return cy.get('#importEformsBtn').should('be.visible').should('be.enabled');
  }

  public eformsManageTagsBtn() {
    return cy.get('#eformsManageTagsBtn').should('be.visible').should('be.enabled');
  }

  public eformsVisualEditor() {
    return cy.get('#eformsVisualEditor').should('be.visible').should('be.enabled');
  }

  public eFormDeleteDeleteBtn() {
    return cy.get('#eFormDeleteDeleteBtn').should('be.visible').should('be.enabled');
  }

  public eFormDeleteCancelBtn() {
    return cy.get('#eFormDeleteCancelBtn').should('be.visible').should('be.enabled');
  }

  public eformFilter() {
    return cy.get('#labelInput').should('be.visible');
  }


  /*public idSortBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.eform-id-header .mat-header-cell-inner .mat-sort-header').should('be.visible').should('be.enabled');
  }

  public createdAtSortBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.eform-created-at-header .mat-header-cell-inner .mat-sort-header').should('be.visible').should('be.enabled');
  }

  public eformNameSortBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.eform-name-header .mat-header-cell-inner .mat-sort-header').should('be.visible').should('be.enabled');
  }*/

  // Create eform modal
  public createEformTagSelector() {
    return cy.get('#createEFormMultiSelector').should('be.visible').should('be.enabled');
  }

  public createEformNewTagInput() {
    return cy.get('#addTagInput').should('be.visible');
  }

  public xmlTextArea() {
    return cy.get('#eFormXml').should('be.visible');
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

  getLastMyEformsRowObj(): MyEformsRowObject {
    cy.wait(1500);
    const obj = new MyEformsRowObject();
    const rowNum = this.rowNum();
    return obj.getRow(rowNum);
  }

  getEformRowObj(
    num,
    pause: boolean = false
  ): MyEformsRowObject {
    if (pause) {
      cy.wait(500);
    }
    return myEformsRowObject.getRow(num);
  }

  public getRowObjectByIndex(index, findTags: string[] = ['deleteBtn']): MyEformsRowObject {
    return myEformsRowObject.getRow(index, findTags);
  }

  public getFirstRowObject(findTags: string[] = ['deleteBtn']): MyEformsRowObject {
    return myEformsRowObject.getRow(1, findTags);
  }

  clearTable() {
    cy.log('**CLEAR EFORMS TABLE**');
    cy.wait(500);
    this.rowNum().then(rowNum => {
      for (let i = rowNum; i > 0; i--) {
        cy.get('#mainPageEFormsTableBody tbody tr.cdk-row .delete-eform-btn').last().scrollIntoView().click();
        this.getFirstRowObject([]).closeDeleteModal();
        cy.wait(500);
      }
    });
  }

  createNewEform(
    eFormLabel,
    newTagsList = [],
    tags: string[] = [],
    xml = ''
  ) {
    this.newEformBtn().click();
    cy.wait(500);
    this.xmlTextArea().should('be.visible', {timeout: 40000});
    // Create replaced xml and insert it in textarea
    if (!xml) {
      xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
    }
    this.xmlTextArea().type(xml, {parseSpecialCharSequences: false, delay: 0, scrollBehavior: 'bottom', force: true});
    // Create new tags
    if (newTagsList.length > 0) {
      this.createEformNewTagInput().type(newTagsList.join(','));
    }
    // Add existing tags
    for (let i = 0; i < tags.length; i++) {
      selectValueInNgSelector(this.createEformTagSelector, tags[i]);
    }
    this.createEformBtn().click();
    this.newEformBtn().should('be.enabled', {timeout: 40000});
    cy.wait(500);
  }

  createNewTag(nameTag) {
    this.createNewTags([nameTag]);
  }

  createNewTags(nameTags) {
    this.eformsManageTagsBtn().click();
    tagsModalPage.tagsModalCloseBtn().should('be.visible');
    tagsModalPage.createTags(nameTags);
    tagsModalPage.closeTagModal();
    this.newEformBtn().should('be.visible').click();
  }

  removeTag(nameTag) {
    this.removeTags([nameTag]);
  }

  removeTags(nameTags) {
    this.eformsManageTagsBtn().click();
    tagsModalPage.tagsModalCloseBtn().should('be.visible');
    for (let i = 0; i < nameTags.length; i++) {
      // const tag = tagsModalPage.getTagByName(nameTags[i]);
      // tag.deleteTag();
    }
    tagsModalPage.closeTagModal();
    this.newEformBtn().should('be.visible').click();
  }

  enterTagFilter(nameTag) {
    this.tagSelector()
      .find('input')
      .type(nameTag);
    cy.get('ng-dropdown-panel .ng-option')
      .should('be.visible')
      .first()
      .click();
  }
}

const myEformsPage = new MyEformsPage();

class MyEformsRowObject {
  constructor() {
  }

  element: () => Cypress.Chainable<JQuery<HTMLElement>>;
  id: Cypress.Chainable<JQuery<HTMLElement>>;
  createdAt: Cypress.Chainable<JQuery<HTMLElement>>;
  eFormName: Cypress.Chainable<JQuery<HTMLElement>>;
  description: Cypress.Chainable<JQuery<HTMLElement>>;
  tags: Cypress.Chainable<string[]>;
  editTagsBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  editPairEformBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  deleteBtn: () => Cypress.Chainable<JQuery<HTMLElement>>;
  goVisualEditorBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  menuBtn: Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum, findProps: string[] = ['deleteBtn']) {
    const currentPosition = rowNum - 1;
    this.element = () => cy.get('#mainPageEFormsTableBody tbody tr.cdk-row').eq(currentPosition);

    if (findProps.includes('id')) {
      this.id = this.element().find('.mat-column-id span');
    }
    if (findProps.includes('eFormName')) {
      this.eFormName = this.element().find('.mat-column-label span');
    }
    if (findProps.includes('createdAt')) {
      this.createdAt = this.element().find('.mat-column-createdAt');
    }
    if (findProps.includes('description')) {
      this.description = this.element().find('.mat-column-description');
    }
    if (findProps.includes('editPairEformBtn')) {
      this.editPairEformBtn = this.element().find('.mat-column-pairingUpdate .eform-pairing-btn');
    }
    if (findProps.includes('editTagsBtn')) {
      this.editTagsBtn = this.element().find('.mat-column-tags .edit-tags-btn');
    }
    if (findProps.includes('deleteBtn')) {
      this.deleteBtn = () => this.element().find('.mat-column-actions .delete-eform-btn');
    }
    if (findProps.includes('goVisualEditorBtn')) {
      this.goVisualEditorBtn = this.element().find('.mat-column-actions .edit-eform-btn');
    }
    if (findProps.includes('menuBtn')) {
      this.menuBtn = this.element().find('.mat-column-actions .eform-menu-actions');
    }
    if (findProps.includes('tags')) {
      this.element()
        .find('.mat-column-tags .eform-tag')
        .invoke('text')
        .then((text: string) => {
          this.tags = cy.wrap(text.split('discount').filter(x => x !== ''));
        });
    }
    return this;
  }


  deleteEForm(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }

  openDeleteModal() {
    this.deleteBtn().should('not.be.disabled').click();
    cy.wait(500);
    myEformsPage.eFormDeleteDeleteBtn().should('be.visible');
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      myEformsPage.eFormDeleteCancelBtn().click();
    } else {
      myEformsPage.eFormDeleteDeleteBtn().click();
    }
    myEformsPage.newEformBtn().should('be.enabled');
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
    cy.log('Pairing eform');
    const spinnerAnimation = cy.get('#spinner-animation');
    if (this.editPairEformBtn.should('exist')) {
      cy.log('editPairEformBtn isExisting');
      this.editPairEformBtn.click();
    } else {
      cy.log('addPairEformBtn isExisting');
      this.editPairEformBtn.click();
    }
    cy.log('Parring clicked');
    cy.wait(500);
    spinnerAnimation.should('not.exist', {timeout: 90000});
    (myEformsPage.cancelParingBtn()).should('be.visible', {timeout: 40000});
    cy.wait(500);
    const folders = cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node');
    //cy.wait(10000);
    /*for (let i = 0; i < folders.length; i++) {
      if (
        ((folders[i].$('div > div')).invoke('text')).includes(
          folder.name
        )
      ) {
        (folders[i].$('div')).click();
        cy.wait(1000);
      }
    }*/
    cy.log('Folder selected');
    for (let i = 0; i < users.length; i++) {
      cy.log('Selecting user: ' + users[i].firstName);
      //const name = `#mat-checkbox-${i+2} > label > div.mat-checkbox-inner-container`;
      const checkbox = cy.get(`#checkbox${users[i].siteId}`);
      cy.log('Checkbox found ');
      checkbox.scrollIntoView();
      cy.log('Checkbox scrolled into view');
      //checkbox.should('be.visible').should('be.enabled');
      checkbox.click();
      cy.log('User selected ' + users[i].firstName);
      cy.wait(500);
    }
    cy.log('Users selected');
    (myEformsPage.saveParingBtn()).click();
    spinnerAnimation.should('not.exist', {timeout: 90000});
    cy.wait(1000);
  }

  unPair(users) {
    const spinnerAnimation = cy.get('#spinner-animation');
    this.editPairEformBtn.click();
    cy.wait(1000);
    spinnerAnimation.should('not.be.visible', {timeout: 40000});
    myEformsPage.cancelParingBtn().should('be.visible', {timeout: 40000});
    for (let i = 0; i < users.length; i++) {
      const checkbox = cy.get(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      checkbox.parent().should('be.visible', {timeout: 40000}).click();
      cy.wait(1000);
    }
    myEformsPage.saveParingBtn().click();
    spinnerAnimation.should('not.be.visible', {timeout: 90000});
    cy.wait(1000);
  }

  goToVisualEditor() {
    this.goVisualEditorBtn.click();
    cy.wait(500);
    cy.get('#manageTags').should('be.visible', {timeout: 40000}).click();
    cy.wait(500);
  }
}

const myEformsRowObject = new MyEformsRowObject();

export {myEformsRowObject, myEformsPage};
