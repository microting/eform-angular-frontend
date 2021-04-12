import { PageWithNavbarPage } from './PageWithNavbar.page';
import { applicationLanguages } from 'src/app/common/const';

class FoldersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newFolderBtn() {
    return $('#newFolderBtn');
  }

  public createNameInput(translationIndex: number) {
    return $(`#createFolderNameTranslation_${translationIndex}`);
  }

  public createDescription(translationIndex: number) {
    return $(`#createFolderDescriptionTranslation_${translationIndex}`);
  }

  public createDescriptionInput(translationIndex: number) {
    return this.createDescription(translationIndex).$('.pell-content');
  }

  public createDescriptionInputPellBold(translationIndex: number) {
    const ele = this.createDescription(translationIndex).$(
      'button[title="Bold"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public createDescriptionInputPellUnderline(translationIndex: number) {
    const ele = this.createDescription(translationIndex).$(
      'button[title="Underline"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public createDescriptionInputPellItalic(translationIndex: number) {
    const ele = this.createDescription(translationIndex).$(
      'button[title="Italic"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public createDescriptionInputPellStrikeThrough(translationIndex: number) {
    const ele = this.createDescription(translationIndex).$(
      'button[title="Strike-through"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public editDescriptionInputPellBold(translationIndex: number) {
    const ele = this.editDescription(translationIndex).$(
      'button[title="Bold"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public editDescriptionInputPellUnderline(translationIndex: number) {
    const ele = this.editDescription(translationIndex).$(
      'button[title="Underline"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public editDescriptionInputPellItalic(translationIndex: number) {
    const ele = this.editDescription(translationIndex).$(
      'button[title="Italic"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public editDescriptionInputPellStrikeThrough(translationIndex: number) {
    const ele = this.editDescription(translationIndex).$(
      'button[title="Strike-through"]'
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get saveCreateBtn() {
    const ele = $('#folderSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get cancelCreateBtn() {
    const cancelCreateBtn = $('#cancelCreateBtn');
    cancelCreateBtn.waitForDisplayed({ timeout: 20000 });
    cancelCreateBtn.waitForClickable({ timeout: 20000 });
    return cancelCreateBtn;
  }

  public get saveDeleteBtn() {
    const saveDeleteBtn = $('#saveDeleteBtn');
    saveDeleteBtn.waitForDisplayed({ timeout: 20000 });
    // saveDeleteBtn.waitForClickable({timeout: 20000});
    return saveDeleteBtn;
  }

  public get cancelDeleteBtn() {
    const ele = $('#cancelDeleteBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public editNameInput(translationIndex: number) {
    const ele = $(`#editFolderNameTranslation_${translationIndex}`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public editDescription(translationIndex: number) {
    const ele = $(`#editFolderDescriptionTranslation_${translationIndex}`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public editDescriptionInput(translationIndex: number) {
    const ele = this.editDescription(translationIndex).$('.pell-content');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createLanguageSelector() {
    const ele = $('#createLanguageSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get saveEditBtn() {
    return $('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return $('#cancelEditBtn');
  }

  public get rowNum(): number {
    if (!$('#folderTreeId').isExisting()) {
      browser.pause(500);
    }
    return $$('#folderTreeId').length;
  }

  public get rowNumParents(): number {
    browser.pause(500);
    return $$('#folderTreeName').length;
  }

  public get rowChildrenNum() {
    return $$('.tree-node-level-2').length;
  }

  public get editLanguageSelector() {
    const ele = $('#editLanguageSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  getFolder(num): FoldersRowObject {
    return new FoldersRowObject(num);
  }

  getFolderByName(nameFolder: string): FoldersRowObject {
    browser.pause(500);
    for (let i = 1; i < this.rowNum + 1; i++) {
      const folder = new FoldersRowObject(i);
      if (folder.name === nameFolder) {
        return folder;
      }
    }
    return null;
  }

  getFolderRowNumByName(nameFolder: string): number {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const folder = new FoldersRowObject(i);
      if (folder.name === nameFolder) {
        return i;
      }
    }
    return -1;
  }

  getFolderFromTree(numParent, numChild): FoldersTreeRowObject {
    return new FoldersTreeRowObject(numParent, numChild);
  }

  public createNewFolder(
    name: string | { name: string; language: string }[],
    description: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    this.openCreateFolder(name, description);
    this.closeCreateFolder(clickCancel);
  }

  public openCreateFolder(
    name?: string | Array<{ name: string; language: string }>,
    description?: string | Array<{ description: string; language: string }>
  ) {
    this.newFolderBtn.click();
    this.cancelCreateBtn.waitForDisplayed({ timeout: 10000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        this.createLanguageSelector.$('input').setValue(da.text);
        const value = this.createLanguageSelector.$(`.ng-option=${da.text}`);
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        this.createNameInput(
          applicationLanguages.findIndex((x) => x.text === da.text)
        ).setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          this.createLanguageSelector.$('input').setValue(language.text);
          const value = this.createLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          this.createNameInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          ).setValue(nameConverted[i].name);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        this.createLanguageSelector.$('input').setValue(da.text);
        const value = this.createLanguageSelector.$(`.ng-option=${da.text}`);
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        this.createDescriptionInput(
          applicationLanguages.findIndex((x) => x.text === da.text)
        ).setValue(descriptionConvert);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === descriptionConvert[i].language
          );
          this.createLanguageSelector.$('input').setValue(language.text);
          const value = this.createLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          this.createDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          ).setValue(descriptionConvert[i].description);
        }
      }
    }
  }

  closeCreateFolder(clickCancel = false) {
    if (!clickCancel) {
      this.saveCreateBtn.waitForClickable({ timeout: 20000 });
      this.saveCreateBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      this.cancelCreateBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 20000 });
  }
}

const foldersPage = new FoldersPage();
export default foldersPage;

export class FoldersRowObject {
  constructor(rowNum) {
    if ($$('.tree-node-level-1')[rowNum - 1]) {
      const element = $$('.tree-node-level-1')[rowNum - 1];
      try {
        this.folderElement = element.$('#folderTreeId');
      } catch (e) {}
      try {
        this.name = element.$('#folderTreeName').getText();
      } catch (e) {}
      // try {
      //   this.description = element.$('#folderTreeDescription').getText();
      // } catch (e) {
      // }
      this.folderTreeOpenClose = element.$('#folderTreeOpenClose');
      this.editBtn = this.folderElement.$('#editFolderTreeBtn');
      this.deleteBtn = this.folderElement.$('#deleteFolderTreeBtn');
      this.createFolderChildBtn = this.folderElement.$('#createFolderChildBtn');
    }
  }

  folderElement;
  name;
  // description;
  editBtn;
  deleteBtn;
  createFolderChildBtn;
  folderTreeOpenClose;

  getDescription(): { description: string; language: string }[] {
    this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguages.length; i++) {
      const language = applicationLanguages[i];
      foldersPage.editLanguageSelector.$('input').setValue(language.text);
      const value = foldersPage.editLanguageSelector.$(
        `.ng-option=${language.text}`
      );
      value.waitForDisplayed({ timeout: 20000 });
      value.click();
      descriptions.push({
        description: foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          )
          .getText(),
        language: language.text,
      });
    }
    foldersPage.cancelEditBtn.click();
    return descriptions;
  }

  createChild(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    if (!this.createFolderChildBtn.isExisting()) {
      this.folderElement.click();
      this.createFolderChildBtn.waitForDisplayed({ timeout: 20000 });
    }
    this.createFolderChildBtn.click();
    foldersPage.cancelCreateBtn.waitForDisplayed({ timeout: 10000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        foldersPage.createLanguageSelector.$('input').setValue(da.text);
        const value = foldersPage.createLanguageSelector.$(
          `.ng-option=${da.text}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        foldersPage
          .createNameInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
          .setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          foldersPage.createLanguageSelector.$('input').setValue(language.text);
          const value = foldersPage.createLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          foldersPage
            .createNameInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
            .setValue(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        foldersPage.createLanguageSelector.$('input').setValue(da.text);
        const value = foldersPage.createLanguageSelector.$(
          `.ng-option=${da.text}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        foldersPage
          .createDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
          .setValue(descriptionConvert);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === descriptionConvert[i].language
          );
          foldersPage.createLanguageSelector.$('input').setValue(language.text);
          const value = foldersPage.createLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          foldersPage
            .createDescriptionInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
            .setValue(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      foldersPage.saveCreateBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      foldersPage.cancelCreateBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 20000 });
  }

  delete(clickCancel = false) {
    if (!this.deleteBtn.isExisting()) {
      this.folderElement.click();
      this.deleteBtn.waitForDisplayed({ timeout: 20000 });
    }
    this.deleteBtn.click();
    if (!clickCancel) {
      foldersPage.saveDeleteBtn.waitForClickable({ timeout: 20000 });
      foldersPage.saveDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 2000,
        reverse: true,
      });
    } else {
      foldersPage.cancelDeleteBtn.waitForDisplayed({ timeout: 20000 });
      foldersPage.cancelDeleteBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 20000 });
  }

  openEditModal() {
    if (!this.editBtn.isExisting()) {
      this.folderElement.click();
      this.editBtn.waitForDisplayed({ timeout: 20000 });
    }
    this.editBtn.click();
    foldersPage.cancelEditBtn.waitForDisplayed({ timeout: 20000 });
  }

  editFolder(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    this.openEditModal();
    foldersPage.cancelEditBtn.waitForDisplayed({ timeout: 20000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        foldersPage.editLanguageSelector.$('input').setValue(da.text);
        const value = foldersPage.editLanguageSelector.$(
          `.ng-option=${da.text}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        foldersPage
          .editNameInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
          .setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          foldersPage.editLanguageSelector.$('input').setValue(language.text);
          const value = foldersPage.editLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          foldersPage
            .editNameInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
            .setValue(nameConverted[i].name);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        foldersPage.editLanguageSelector.$('input').setValue(da.text);
        const value = foldersPage.editLanguageSelector.$(
          `.ng-option=${da.text}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
          .setValue(descriptionConvert);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === descriptionConvert[i].language
          );
          foldersPage.editLanguageSelector.$('input').setValue(language.text);
          const value = foldersPage.editLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          foldersPage
            .editDescriptionInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
            .setValue(descriptionConvert[i].description);
        }
      }
    }
    this.closeEditModal(clickCancel);
  }

  closeEditModal(clickCancel = false) {
    if (!clickCancel) {
      foldersPage.saveEditBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      foldersPage.cancelEditBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 20000 });
  }

  collapseChildren() {
    if (this.folderTreeOpenClose.$('fa-icon[icon="folder-open"]')) {
      this.folderTreeOpenClose.click();
    }
  }

  expandChildren() {
    if (this.folderTreeOpenClose.$('fa-icon[icon="folder"]')) {
      this.folderTreeOpenClose.click();
    }
  }
}

export class FoldersTreeRowObject {
  constructor(rowNumFolderParent, rowNumberFolderChildren) {
    if (
      $$('.tree-node-level-1')[rowNumFolderParent - 1].$$('.tree-node-level-2')[
        rowNumberFolderChildren - 1
      ]
    ) {
      const element = $$('.tree-node-level-1')[rowNumFolderParent - 1].$$(
        '.tree-node-level-2'
      )[rowNumberFolderChildren - 1];
      try {
        this.folderTreeElement = element.$('#folderTreeId');
      } catch (e) {}
      try {
        this.nameTree = element.$('#folderTreeName').getText();
      } catch (e) {}
      // try {
      //   this.descriptionTree = element.$$('#folderTreeDescription')[rowNumberFolderChildren - 1].getText();
      // } catch (e) {
      // }
      this.editTreeBtn = element.$('#editFolderTreeBtn');
      this.deleteTreeBtn = element.$('#deleteFolderTreeBtn');
    }
  }

  folderTreeElement;
  nameTree;
  // descriptionTree;
  editTreeBtn;
  deleteTreeBtn;

  getDescription(): { description: string; language: string }[] {
    this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguages.length; i++) {
      const language = applicationLanguages[i];
      foldersPage.editLanguageSelector.$('input').setValue(language.text);
      const value = foldersPage.editLanguageSelector.$(
        `.ng-option=${language.text}`
      );
      value.waitForDisplayed({ timeout: 20000 });
      value.click();
      descriptions.push({
        description: foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          )
          .getText(),
        language: language.text,
      });
    }
    foldersPage.cancelEditBtn.click();
    return descriptions;
  }

  delete(clickCancel = false) {
    if (!this.deleteTreeBtn.isExisting()) {
      this.folderTreeElement.click();
      this.deleteTreeBtn.waitForDisplayed({ timeout: 20000 });
    }
    this.deleteTreeBtn.click();
    if (!clickCancel) {
      foldersPage.saveDeleteBtn.waitForClickable({ timeout: 20000 });
      foldersPage.saveDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 2000,
        reverse: true,
      });
    } else {
      foldersPage.cancelDeleteBtn.waitForClickable({ timeout: 20000 });
      foldersPage.cancelDeleteBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 20000 });
  }

  openEditModal() {
    if (!this.editTreeBtn.isExisting()) {
      this.folderTreeElement.click();
      this.editTreeBtn.waitForDisplayed({ timeout: 20000 });
    }
    this.editTreeBtn.click();
    foldersPage.saveEditBtn.waitForDisplayed({ timeout: 20000 });
  }

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
        foldersPage.editLanguageSelector.$('input').setValue(da.text);
        const value = foldersPage.editLanguageSelector.$(
          `.ng-option=${da.text}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        foldersPage
          .editNameInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
          .setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          foldersPage.editLanguageSelector.$('input').setValue(language.text);
          const value = foldersPage.editLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          foldersPage
            .editNameInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
            .setValue(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        foldersPage.editLanguageSelector.$('input').setValue(da.text);
        const value = foldersPage.editLanguageSelector.$(
          `.ng-option=${da.text}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
        foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          )
          .setValue(descriptionConvert);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === descriptionConvert[i].language
          );
          foldersPage.editLanguageSelector.$('input').setValue(language.text);
          const value = foldersPage.editLanguageSelector.$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
          foldersPage
            .editDescriptionInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            )
            .setValue(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      foldersPage.saveEditBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      foldersPage.cancelEditBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 20000 });
  }
}
