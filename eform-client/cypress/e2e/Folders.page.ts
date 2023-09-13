import {PageWithNavbarPage} from './PageWithNavbar.page';
import {applicationLanguages} from '../../src/app/common/const/application-languages.const';
import {selectValueInNgSelector} from 'cypress/e2e/helper-functions';

class FoldersPage extends PageWithNavbarPage {

  goToFoldersPage() {
    this.Navbar.foldersBtn().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.Navbar.advancedBtn().click();
      }
    });
    this.Navbar.foldersBtn().click();
    this.newFolderBtn().should('be.visible');
  }

  newFolderBtn() {
    // @ts-ignore
    return cy.get('#newFolderBtn');
  }

  createNameInput(translationIndex) {
    // @ts-ignore
    return cy.get(`#createFolderNameTranslation_${translationIndex}`);
  }

  createDescription(translationIndex) {
    // @ts-ignore
    return cy.get(`#createFolderDescriptionTranslation_${translationIndex}`);
  }

  createDescriptionInput(translationIndex) {
    return this.createDescription(translationIndex).find('.NgxEditor__Content');
  }

  createDescriptionInputPellBold(translationIndex) {
    return this.createDescription(translationIndex)
      .find('div[title="Bold"]')
      .wait(40000) // Wait for element to be displayed and clickable
      .click();
  }

  createDescriptionInputPellUnderline(translationIndex) {
    return this.createDescription(translationIndex)
      .find('div[title="Underline"]')
      .wait(40000) // Wait for element to be displayed and clickable
      .click();
  }

  createDescriptionInputPellItalic(translationIndex) {
    return this.createDescription(translationIndex)
      .find('div[title="Italic"]')
      .wait(40000) // Wait for element to be displayed and clickable
      .click();
  }

  // @ts-ignore
  public createDescriptionInputPellStrikeThrough(
    translationIndex: number
  ): Cypress.Chainable<JQuery> {
    const ele = (this.createDescription(translationIndex)).$(
      'div[title="Strike"]'
    );
    ele.should('be.visible');
    ele.should('be.enabled');
    return ele;
  }

  public editDescriptionInputPellBold(translationIndex: number) {
    const ele = (this.editDescription(translationIndex)).$(
      'div[title="Bold"]'
    );
    ele.should('be.visible');
    ele.should('be.enabled');
    return ele;
  }

  public editDescriptionInputPellUnderline(translationIndex: number) {
    const ele = (this.editDescription(translationIndex)).$(
      'div[title="Underline"]'
    );
    ele.should('be.visible');
    ele.should('be.enabled');
    return ele;
  }

  public editDescriptionInputPellItalic(translationIndex: number) {
    const ele = (this.editDescription(translationIndex)).$(
      'div[title="Italic"]'
    );
    ele.should('be.visible');
    ele.should('be.enabled');
    return ele;
  }

  public editDescriptionInputPellStrikeThrough(translationIndex: number) {
    const ele = (this.editDescription(translationIndex)).$(
      'div[title="Strike"]'
    );
    ele.should('be.visible');
    ele.should('be.enabled');
    return ele;
  }

  // @ts-ignore
  public saveCreateBtn(): Cypress.Chainable<JQuery> {
    // @ts-ignore
    const ele = cy.get('#folderSaveBtn');
    ele.should('be.visible');
    return ele;
  }

  // @ts-ignore
  public cancelCreateBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    // @ts-ignore
    return cy.get('#cancelCreateBtn').should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public saveDeleteBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    // @ts-ignore
    return cy.get('#saveDeleteBtn').should('be.visible');
  }

  // @ts-ignore
  public cancelDeleteBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    // @ts-ignore
    return cy.get('#cancelDeleteBtn').should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public editNameInput(translationIndex: number): Cypress.Chainable<JQuery<HTMLElement>> {
    const selector = `#editFolderNameTranslation_${translationIndex}`;
    // @ts-ignore
    return cy.get(selector).should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public editDescription(translationIndex: number): Cypress.Chainable<JQuery<HTMLElement>> {
    const selector = `#editFolderDescriptionTranslation_${translationIndex}`;
    // @ts-ignore
    return cy.get(selector).should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public editDescriptionInput(translationIndex: number): Cypress.Chainable<JQuery<HTMLElement>> {
    const selector = `#editFolderDescriptionTranslation_${translationIndex} .NgxEditor__Content`;
    // @ts-ignore
    return cy.get(selector).should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public createLanguageSelector(): Cypress.Chainable<JQuery<HTMLElement>> {
    // @ts-ignore
    return cy.get('#createLanguageSelector').should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public saveEditBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    // @ts-ignore
    return cy.get('#saveEditBtn').should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public cancelEditBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    // @ts-ignore
    return cy.get('#cancelEditBtn').should('be.visible').should('be.enabled');
  }

  public rowNum(): number {
    // @ts-ignore
    cy.wait(500);
    // @ts-ignore
    if (!(cy.get('.microting-uid').should('exist'))) {
      // @ts-ignore
      cy.wait(500);
    }
    // @ts-ignore
    return (cy.get('.microting-uid')).length;
  }

  public rowNumParents(): number {
    // @ts-ignore
    cy.wait(500);
    // @ts-ignore
    return (cy.get('mat-tree > mat-tree-node > div > small')).length;
  }

  public rowChildrenNum(): number {
    // @ts-ignore
    return (cy.get('mat-tree > mat-tree-node > small')).length;
  }

  // @ts-ignore
  public editLanguageSelector(): Cypress.Chainable {
    // @ts-ignore
    return cy.get('#createLanguageSelector')
      .should('be.visible')
      .should('be.enabled');
  }

  getFolder(num): FoldersRowObject {
    const folderObj = new FoldersRowObject();
    return folderObj.getRow(num);
  }

  getFolderByName(nameFolder: string): FoldersRowObject {
    // @ts-ignore
    cy.wait(500);
    for (let i = 1; i < (this.rowNum()) + 1; i++) {
      const folderObj = new FoldersRowObject();
      const folder = folderObj.getRow(i);
      if (folder.name === nameFolder) {
        return folder;
      }
    }
    return null;
  }

  getFolderRowNumByName(nameFolder: string): number {
    const rowNum = this.rowNum();
    for (let i = 1; i < (rowNum + 1); i++) {
      const folderObj = new FoldersRowObject();
      const folder = folderObj.getRow(i);
      if (folder.name === nameFolder) {
        return i;
      }
    }
    return -1;
  }

  getFolderFromTree(numParent, numChild) {
    const obj = new FoldersTreeRowObject();
    return obj.getRow(numParent, numChild);
  }

  createNewFolder(
    name: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    this.openCreateFolder(name, description);
    this.closeCreateFolder(clickCancel);
  }

  openCreateFolder(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[]
  ) {
    (this.newFolderBtn()).click();
    cy.wait(500);
    (this.cancelCreateBtn()).should('be.visible').wait(10000);
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        selectValueInNgSelector('#createLanguageSelector', da.text, true);
        (
          this.createNameInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
        ).type(nameConverted);
        cy.wait(500);
      }/* else if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i < nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          selectValueInNgSelector('#createLanguageSelector', language.text, true);
          cy.wait(500);
          (
            this.createNameInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
          ).type(nameConverted[i].name);
          cy.wait(500);
        }
      }*/
    }
    if (description) {
      if (typeof description === 'string') {
        const da = applicationLanguages[0];
        // @ts-ignore
        cy.wrap(cy.get(this.createLanguageSelector()).find('input'))
          .type(da.text)
          .wait(500)
          .get(`.ng-option=${da.text}`)
          .should('be.visible')
          .click()
          .wait(500)
          .then(() => {
            // @ts-ignore
            cy.get(this.createDescriptionInput(applicationLanguages.findIndex((x) => x.text === da.text)))
              .type(description)
              .wait(500);
          });
      } else if (Array.isArray(description)) {
        description.forEach((item) => {
          const language = applicationLanguages.find((x) => x.text === item.language);
          // @ts-ignore
          cy.wrap(cy.get(this.createLanguageSelector()).find('input'))
            .type(language.text)
            .wait(500)
            .get(`.ng-option=${language.text}`)
            .should('be.visible')
            .click()
            .wait(500)
            .then(() => {
              // @ts-ignore
              cy.get(this.createDescriptionInput(applicationLanguages.findIndex((x) => x.text === language.text)))
                .type(item.description)
                .wait(500);
            });
        });
      }
    }
  }

  closeCreateFolder(clickCancel = false) {
    if (!clickCancel) {
      this.saveCreateBtn().should('be.visible').click();
      // this.waitForSpinnerHide();
    } else {
      this.cancelCreateBtn().should('be.visible').click();
    }
    foldersPage.newFolderBtn().should('be.visible');
    cy.wait(500);
  }
}

const foldersPage = new FoldersPage();
export default foldersPage;

class FoldersRowObject {
  constructor() {
    this.folderElement = null;
    this.name = null;
    this.folderTreeOpenClose = null;
    this.rowNumber = null;
    this.dropdown = null;
  }

  folderElement;
  name;
  folderTreeOpenClose;
  rowNumber: number;
  dropdown;

  getRow(rowNum) {
    this.rowNumber = rowNum;
    // @ts-ignore
    if (cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node').eq(rowNum - 1)) {
      // @ts-ignore
      const element = cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node').eq(rowNum - 1);
      try {
        this.folderElement = element.find('.microting-uid');
      } catch (e) {
      }
      this.dropdown = element.find('button.mat-menu-trigger');
      try {
        this.name = element.find('div > div').invoke('text');
      } catch (e) {
      }
      this.folderTreeOpenClose = element.find('mat-tree-node');
    }
    return this;
  }

  getDescription() {
    this.openEditModal();
    const descriptions = [];

    for (let i = 0; i < applicationLanguages.length; i++) {
      const language = applicationLanguages[i];
      // @ts-ignore
      cy.get(foldersPage.editLanguageSelector()).find('input').type(language.text);
      // @ts-ignore
      cy.wait(500);
      // @ts-ignore
      const value = cy.get('ng-dropdown-panel').contains(`.ng-option`, language.text);
      value.should('be.visible');
      value.click();
      // @ts-ignore
      cy.wait(500);
      descriptions.push({
        description: (foldersPage.editDescriptionInput(
          applicationLanguages.findIndex((x) => x.text === language.text)
        )).invoke('text'),
        language: language.text,
      });
    }
    // @ts-ignore
    cy.get(foldersPage.cancelEditBtn()).click();
    // @ts-ignore
    cy.wait(500);
    return descriptions;
  }

  createChild(name, description, clickCancel = false) {
    // @ts-ignore
    cy.get('#createFolderChildBtn').should('be.visible');
    if (!clickCancel) {
      this.dropdown.click();
    }
    // @ts-ignore
    cy.get('#createFolderChildBtn').click();
    // @ts-ignore
    cy.get(foldersPage.cancelCreateBtn()).should('be.visible');
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name;
        const da = applicationLanguages[0];
        // @ts-ignore
        cy.get(foldersPage.createLanguageSelector()).find('input').type(da.text);
        // @ts-ignore
        cy.get('ng-dropdown-panel').contains(da.text).click();
        const index = applicationLanguages.findIndex((x) => x.text === da.text);
        cy.get(foldersPage.createNameInput(index)).type(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name;
        for (let i = 0; i < nameConverted.length; i++) {
          const language = applicationLanguages.find((x) => x.text === nameConverted[i].language);
          cy.get(foldersPage.createLanguageSelector()).find('input').type(language.text);
          cy.get('ng-dropdown-panel').contains(language.text).click();
          const index = applicationLanguages.findIndex((x) => x.text === language.text);
          cy.get(foldersPage.createNameInput(index)).type(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description;
        const da = applicationLanguages[0];
        cy.get(foldersPage.createLanguageSelector()).find('input').type(da.text);
        cy.get('ng-dropdown-panel').contains(da.text).click();
        const index = applicationLanguages.findIndex((x) => x.text === da.text);
        cy.get(foldersPage.createDescriptionInput(index)).type(descriptionConvert);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description;
        for (let i = 0; i < descriptionConvert.length; i++) {
          const language = applicationLanguages.find((x) => x.text === descriptionConvert[i].language);
          cy.get(foldersPage.createLanguageSelector()).find('input').type(language.text);
          cy.get('ng-dropdown-panel').contains(language.text).click();
          const index = applicationLanguages.findIndex((x) => x.text === language.text);
          cy.get(foldersPage.createDescriptionInput(index)).type(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      cy.get(foldersPage.saveCreateBtn()).click();
      cy.get('#spinner-animation').should('not.exist', {timeout: 90000});
    } else {
      cy.get(foldersPage.cancelCreateBtn()).click();
    }
    cy.get(foldersPage.newFolderBtn()).should('be.visible');
  }


  delete(clickCancel = false) {
    if (!(cy.get('#deleteFolderTreeBtn').should('be.visible'))) {
      this.dropdown.click();
      cy.get('#deleteFolderTreeBtn').should('be.visible', {timeout: 40000});
    }
    // @ts-ignore
    cy.get('#deleteFolderTreeBtn').click();
    if (!clickCancel) {
      foldersPage.saveDeleteBtn().should('be.enabled', {timeout: 40000}).click();
      foldersPage.waitForSpinnerHide(2000);
    } else {
      foldersPage.cancelDeleteBtn().click();
    }
    foldersPage.newFolderBtn().should('be.visible', {timeout: 40000});
  }

  openEditModal() {
    if (!(cy.get('#createFolderChildBtn').should('be.visible'))) {
      this.dropdown.click();
      cy.get('#createFolderChildBtn').should('be.visible', {timeout: 40000});
    }
    cy.get('#editFolderTreeBtn').click();
    foldersPage.cancelEditBtn().should('be.visible', {timeout: 40000});
  }

  editFolder(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    this.openEditModal();
    cy.get(foldersPage.cancelEditBtn()).should('be.visible');
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        cy.get(foldersPage.editLanguageSelector() + ' input')
          .type(da.text)
          .wait(500)
          .get('ng-dropdown-panel .ng-option')
          .contains(da.text)
          .click();
        cy.get(foldersPage.editNameInput(
          applicationLanguages.findIndex((x) => x.text === da.text)
        )).type(nameConverted).wait(500);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i < nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          cy.get(foldersPage.editLanguageSelector() + ' input')
            .type(language.text)
            .wait(500)
            .get('ng-dropdown-panel .ng-option')
            .contains(language.text)
            .click();
          cy.get(foldersPage.editNameInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          )).type(nameConverted[i].name).wait(500);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        cy.get(foldersPage.editLanguageSelector() + ' input')
          .type(da.text)
          .wait(500)
          .get('ng-dropdown-panel .ng-option')
          .contains(da.text)
          .click();
        cy.get(foldersPage.editDescriptionInput(
          applicationLanguages.findIndex((x) => x.text === da.text)
        )).type(descriptionConvert).wait(500);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i < descriptionConvert.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === descriptionConvert[i].language
          );
          cy.get(foldersPage.editLanguageSelector() + ' input')
            .type(language.text)
            .wait(500)
            .get('ng-dropdown-panel .ng-option')
            .contains(language.text)
            .click();
          cy.get(foldersPage.editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          )).type(descriptionConvert[i].description).wait(500);
        }
      }
    }
    this.closeEditModal(clickCancel);
  }

  closeEditModal(clickCancel = false) {
    if (!clickCancel) {
      cy.get(foldersPage.saveEditBtn()).click();
      foldersPage.waitForSpinnerHide(40000);
    } else {
      cy.get(foldersPage.cancelEditBtn()).click();
    }
    cy.get(foldersPage.newFolderBtn()).should('be.visible');
  }

  collapseChildren() {
    if (this.folderTreeOpenClose.find('fa-icon[icon="folder-open"]').should('exist')) {
      this.folderTreeOpenClose.click();
    }
  }

  expandChildren() {
    if (cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node[aria-expanded="false"]').should('exist')) {
      cy.get('app-eform-tree-view-picker > mat-tree > mat-tree-node[aria-expanded="false"] > button').click();
    }
    cy.wait(1000);
  }
}

export class FoldersTreeRowObject {
  constructor() {
  }

  folderTreeElement;
  nameTree;
  dropdown;

  getRow(rowNumFolderParent, rowNumberFolderChildren) {
    if (cy.get('app-eform-tree-view-picker mat-tree mat-tree-node.children').eq(rowNumberFolderChildren - 1)) {
      const element = cy.get('app-eform-tree-view-picker mat-tree mat-tree-node.children').eq(rowNumberFolderChildren - 1);
      this.dropdown = element.find('div button');
      try {
        this.folderTreeElement = element.find('#folderTreeId');
      } catch (e) {
      }
      try {
        this.nameTree = element.find('#folderTreeName').text();
      } catch (e) {
      }
    }
    return this;
  }

  getDescription() {
    this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguages.length; i++) {
      const language = applicationLanguages[i];
      cy.get(foldersPage.editLanguageSelector()).find('input').type(language.text);
      const value = cy.get('ng-dropdown-panel').contains(language.text);
      value.should('be.visible');
      value.click();
      descriptions.push({
        description: cy.get(foldersPage.editDescriptionInput(applicationLanguages.findIndex((x) => x.text === language.text))).text(),
        language: language.text,
      });
    }
    cy.get(foldersPage.cancelEditBtn()).click();
    return descriptions;
  }

  openEditModal() {
    if (!(cy.get('#editFolderTreeBtn').should('be.visible'))) {
      this.dropdown.click();
      cy.wait(500);
      cy.get('#editFolderTreeBtn').should('be.visible');
    }
    cy.get('#editFolderTreeBtn').click();
    cy.wait(500);
    cy.get(foldersPage.saveEditBtn()).should('be.visible');
    cy.wait(500);
  }

  // editFolderChild(
  //   name?: string | { name: string; language: string }[],
  //   description?: string | { description: string; language: string }[],
  //   clickCancel = false
  // ) {
  //   if (typeof description === typeof []) {
  //     const descriptionConvert = description as {
  //       description: string;
  //       language: string;
  //     }[];
  //     for (let i = 0; i > descriptionConvert.length; i++) {
  //       const language = applicationLanguages.find(
  //         (x) => x.text === descriptionConvert[i].language
  //       );
  //       cy.get(foldersPage.editLanguageSelector()).find('input').type(language.text);
  //       cy.wait(500);
  //       const value = cy.get('ng-dropdown-panel').contains(language.text);
  //       value.should('be.visible');
  //       value.click();
  //       cy.wait(500);
  //       cy.get(foldersPage.editDescriptionInput(
  //         applicationLanguages.findIndex((x) => x.text === language.text)
  //       )).type(descriptionConvert[i].description);
  //     }
  //   }
  //
  //   if (!clickCancel) {
  //     cy.get(foldersPage.saveEditBtn()).click();
  //     foldersPage.waitForSpinnerHide(40000);
  //   } else {
  //     cy.get(foldersPage.cancelEditBtn()).click();
  //   }
  //   cy.get(foldersPage.newFolderBtn()).should('be.visible');
  //   cy.wait(500);
  // }

  editFolderChild(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    this.openEditModal();
    if (name != null) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        ((foldersPage.editLanguageSelector()).find('input')).type(da.text);
        cy.wait(500);
        const value = cy.get('ng-dropdown-panel').contains('.ng-option', da.text);
        value.wait({timeout: 40000}).click();
        cy.wait(500);
        (foldersPage.editNameInput(applicationLanguages.findIndex((x) => x.text === da.text))).type(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i < nameConverted.length; i++) {
          const language = applicationLanguages.find((x) => x.text === nameConverted[i].language);
          (foldersPage.editLanguageSelector().find('input')).type(language.text);
          cy.wait(500);
          const value = cy.get('ng-dropdown-panel').contains('.ng-option', language.text);
          value.wait({timeout: 40000}).click();
          cy.wait(500);
          (foldersPage.editNameInput(applicationLanguages.findIndex((x) => x.text === language.text))).type(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        (
          cy.get(foldersPage.editLanguageSelector()).find('input')
        ).type(`${da.text}{enter}`);
        cy.wait(500);
        (
          foldersPage.editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
        ).type(descriptionConvert);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i < descriptionConvert.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === descriptionConvert[i].language
          );
          (
            cy.get(foldersPage.editLanguageSelector()).find('input')
          ).type(`${language.text}{enter}`);
          cy.wait(500);
          (
            foldersPage.editDescriptionInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
          ).type(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      (foldersPage.saveEditBtn()).click();
      foldersPage.waitForSpinnerHide(40000);
    } else {
      (foldersPage.cancelEditBtn()).click();
    }
    (foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
    cy.wait(500);
  }
}
