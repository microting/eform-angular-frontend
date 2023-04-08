import Page from './Page';

export class TagsModalPage extends Page {
  rowNum() {
    return cy.get('#tagName').its('length');
  }

  newTagBtn() {
    return cy.get('#newTagBtn').scrollIntoView().should('be.visible');
  }

  newTagSaveBtn() {
    return cy.get('#newTagSaveBtn').scrollIntoView().should('be.visible');
  }

  newTagSaveCancelBtn() {
    return cy.get('#newTagSaveCancelBtn').scrollIntoView().should('be.visible');
  }

  newTagNameInput() {
    cy.get('#newTagName').scrollIntoView().should('be.visible');
  }

  editTagNameInput() {
    return cy.get('#tagNameEdit').scrollIntoView().should('be.visible');
  }

  tagEditSaveBtn() {
    return cy.get('#tagEditSaveBtn').scrollIntoView().should('be.visible');
  }

  tagEditSaveCancelBtn() {
    return cy.get('#tagEditSaveCancelBtn').scrollIntoView().should('be.visible');
  }

  tagDeleteSaveBtn() {
    cy.get('#tagDeleteSaveBtn').scrollIntoView().should('be.visible');
  }

  tagDeleteSaveCancelBtn() {
    return cy.get('#tagDeleteSaveCancelBtn').scrollIntoView().should('be.visible');
  }

  tagsModalCloseBtn() {
    return cy.get('#tagsModalCloseBtn').scrollIntoView().should('be.visible');
  }

  createTag(tagName) {
    this.newTagBtn();
    cy.get('#newTagName').scrollIntoView().should('be.visible').type(tagName);
    this.newTagSaveBtn().click();
    cy.get('#spinner-animation').should('not.exist');
    this.newTagBtn().should('be.visible');
  }

  cancelCreateTag(tagName) {
    this.newTagBtn();
    cy.get('#newTagName').scrollIntoView().should('be.visible').type(tagName);
    this.newTagSaveCancelBtn().click();
    this.newTagBtn().should('be.visible');
  }

  editTag(rowNumber, name) {
    const result = new TagRowObject();
    const rowObject = result.getRow(rowNumber);
    rowObject.editTagClick();
    cy.get('#tagNameEdit').scrollIntoView().should('be.visible').type(name);
    this.tagEditSaveBtn().click();
    cy.get('#spinner-animation').should('not.exist');
    this.newTagBtn().should('be.visible');
  }

  cancelEditTag(rowNumber, name) {
    const result = new TagRowObject();
    const rowObject = result.getRow(rowNumber);
    rowObject.editTagClick();
    cy.get('#tagNameEdit').scrollIntoView().should('be.visible').type(name);
    this.tagEditSaveCancelBtn().click();
    this.newTagBtn().should('be.visible');
  }

  deleteTag(rowNumber) {
    const result = new TagRowObject();
    const rowObject = result.getRow(rowNumber);
    rowObject.deleteTag();
    cy.get('#spinner-animation').should('not.exist');
  }

  cancelDeleteTag(rowNumber) {
    const result = new TagRowObject();
    const rowObject = result.getRow(rowNumber);
    rowObject.deleteTag(true);
    this.tagDeleteSaveCancelBtn().click();
    cy.get('#spinner-animation').should('not.exist');
  }
}

const tagsModalPage = new TagsModalPage();
export default tagsModalPage;

export class TagRowObject {
  name;
  editTagBtn;
  deleteTagBtn;

  getRow(rowNum) {
    this.name = cy.get('#tagName').eq(rowNum - 1).invoke('text');
    this.editTagBtn = cy.get('#editTagBtn').eq(rowNum - 1);
    this.deleteTagBtn = cy.get('#deleteTagBtn').eq(rowNum - 1);
    return this;
  }

  editTagClick() {
    const editBtn = this.editTagBtn;
    editBtn.click();
    cy.get('#spinner-animation').should('not.exist', { timeout: 90000 });
  }

  deleteTag(clickCancel = false) {
    const closeBtn = tagsModalPage.tagsModalCloseBtn();
    this.deleteTagBtn.click();
    if (clickCancel) {
      tagsModalPage.tagDeleteSaveCancelBtn().click();
    } else {
      cy.wait(500);
      cy.get('#tagDeleteSaveBtn').click();
    }
    closeBtn.should('be.visible', { timeout: 40000 });
  }
}
