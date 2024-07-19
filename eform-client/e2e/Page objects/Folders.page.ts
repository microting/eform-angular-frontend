import { PageWithNavbarPage } from './PageWithNavbar.page';
import {applicationLanguagesTranslated} from '../../src/app/common/const';
import {selectValueInNgSelector} from "../Helpers/helper-functions";
import { $ } from '@wdio/globals';

class FoldersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async newFolderBtn(): Promise<WebdriverIO.Element> {
    return $('#newFolderBtn');
  }

  public async createNameInput(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    return $(`#createFolderNameTranslation_${translationIndex}`);
  }

  public async createDescription(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    return $(`#createFolderDescriptionTranslation_${translationIndex}`);
  }

  public async createDescriptionInput(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    return await (await this.createDescription(translationIndex)).$(
      '.NgxEditor__Content'
    );
  }

  public async createDescriptionInputPellBold(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Bold"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createDescriptionInputPellUnderline(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Underline"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createDescriptionInputPellItalic(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Italic"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createDescriptionInputPellStrikeThrough(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Strike"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editDescriptionInputPellBold(translationIndex: number) {
    const ele = await (await this.editDescription(translationIndex)).$(
      'button[title="Bold"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editDescriptionInputPellUnderline(translationIndex: number) {
    const ele = await (await this.editDescription(translationIndex)).$(
      'button[title="Underline"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editDescriptionInputPellItalic(translationIndex: number) {
    const ele = await (await this.editDescription(translationIndex)).$(
      'button[title="Italic"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editDescriptionInputPellStrikeThrough(translationIndex: number) {
    const ele = await (await this.editDescription(translationIndex)).$(
      'button[title="Strike"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async saveCreateBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#folderSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async cancelCreateBtn(): Promise<WebdriverIO.Element> {
    const cancelCreateBtn = await $('#cancelCreateBtn');
    await cancelCreateBtn.waitForDisplayed({ timeout: 40000 });
    await cancelCreateBtn.waitForClickable({ timeout: 40000 });
    return cancelCreateBtn;
  }

  public async saveDeleteBtn(): Promise<WebdriverIO.Element> {
    const saveDeleteBtn = await $('#saveDeleteBtn');
    await saveDeleteBtn.waitForDisplayed({ timeout: 40000 });
    // saveDeleteBtn.waitForClickable({timeout: 40000});
    return saveDeleteBtn;
  }

  public async cancelDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#cancelDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editNameInput(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    const ele = await $(`#editFolderNameTranslation_${translationIndex}`);
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editDescription(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    const ele = await $(
      `#editFolderDescriptionTranslation_${translationIndex}`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editDescriptionInput(
    translationIndex: number
  ): Promise<WebdriverIO.Element> {
    const ele = await (await this.editDescription(translationIndex)).$(
      '.NgxEditor__Content'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async createLanguageSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#createLanguageSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async saveEditBtn() {
    return $('#saveEditBtn');
  }

  public async cancelEditBtn() {
    return $('#cancelEditBtn');
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    if (!(await (await $('.microting-uid')).isExisting())) {
      await browser.pause(500);
    }
    return (await $$('.microting-uid')).length;
  }

  public async rowNumParents(): Promise<number> {
    await browser.pause(500);
    return (await $$('mat-tree > mat-tree-node > div > small')).length;
  }

  public async rowChildrenNum(): Promise<number> {
    return (await $$('mat-tree > mat-tree-node > small')).length;
  }

  public async editLanguageSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#createLanguageSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async getFolder(num): Promise<FoldersRowObject> {
    const folderObj = new FoldersRowObject();
    return await folderObj.getRow(num);
  }

  async getFolderByName(nameFolder: string): Promise<FoldersRowObject> {
    await browser.pause(500);
    for (let i = 1; i < (await this.rowNum()) + 1; i++) {
      const folderObj = new FoldersRowObject();
      //await browser.pause(10000);
      const folder = await folderObj.getRow(i);
      if (folder.name === nameFolder) {
        return folder;
      }
    }
    return null;
  }

  async getFolderRowNumByName(nameFolder: string): Promise<number> {
    const rowNum = await this.rowNum();
    for (let i = 1; i < (rowNum + 1); i++) {
      const folderObj = new FoldersRowObject();
      const folder = await folderObj.getRow(i);
      if (folder.name === nameFolder) {
        return i;
      }
    }
    return -1;
  }

  async getFolderFromTree(numParent, numChild): Promise<FoldersTreeRowObject> {
    const obj = new FoldersTreeRowObject();
    return await obj.getRow(numParent, numChild);
  }

  public async createNewFolder(
    name: string | { name: string; language: string }[],
    description: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    await this.openCreateFolder(name, description);
    await this.closeCreateFolder(clickCancel);
  }

  public async openCreateFolder(
    name?: string | Array<{ name: string; language: string }>,
    description?: string | Array<{ description: string; language: string }>
  ) {
    await (await this.newFolderBtn()).click();
    await browser.pause(500);
    await (await this.cancelCreateBtn()).waitForDisplayed({ timeout: 10000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguagesTranslated[0];
        await selectValueInNgSelector(await this.createLanguageSelector(), da.text);
        // await (await this.createLanguageSelector())
        //   .$('input')
        //   .setValue(da.text);
        // await browser.pause(500);
        //await (await $(`//*["ng-dropdown-panel"]//*[text()="${da.text}"]`)).click();
        // const value = (await this.createLanguageSelector()).$(
        //   `.ng-option=${da.text}`
        // );
        // value.waitForDisplayed({ timeout: 40000 });
        // value.click();
        await browser.pause(500);
        (
          await this.createNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(nameConverted);
        await browser.pause(500);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = await applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await selectValueInNgSelector(await this.createLanguageSelector(), language.text);
          // (await this.createLanguageSelector())
          //   .$('input')
          //   .setValue(language.text);
          // await browser.pause(500);
          // const value = (await this.createLanguageSelector()).$(
          //   `.ng-option=${language.text}`
          // );
          // value.waitForDisplayed({ timeout: 40000 });
          // value.click();
          await browser.pause(500);
          (
            await this.createNameInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(nameConverted[i].name);
          await browser.pause(500);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];

        await selectValueInNgSelector(await this.createLanguageSelector(), da.text);
        // await (
        //   await (await foldersPage.createLanguageSelector()).$('input')
        // ).setValue(da.text);
        // await browser.pause(500);
        // const value = await (await this.createLanguageSelector()).$(
        //   `.ng-option=${da.text}`
        // );
        // value.waitForDisplayed({ timeout: 40000 });
        // value.click();
        await browser.pause(500);
        (
          await this.createDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(descriptionConvert);
        await browser.pause(500);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === descriptionConvert[i].language
          );

          await selectValueInNgSelector(await this.createLanguageSelector(), language.text);
          // (await this.createLanguageSelector())
          //   .$('input')
          //   .setValue(language.text);
          // await browser.pause(500);
          // const value = (await this.createLanguageSelector()).$(
          //   `.ng-option=${language.text}`
          // );
          // value.waitForDisplayed({ timeout: 40000 });
          // value.click();
          await browser.pause(500);
          (
            await this.createDescriptionInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(descriptionConvert[i].description);
          await browser.pause(500);
        }
      }
    }
  }

  async closeCreateFolder(clickCancel = false) {
    if (!clickCancel) {
      await (await this.saveCreateBtn()).waitForClickable({ timeout: 40000 });
      await (await this.saveCreateBtn()).click();
    } else {
      await (await this.cancelCreateBtn()).click();
    }
    await $('#spinner-animation').waitForDisplayed({
      timeout: 90000,
      reverse: true,
    });
    await (await foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
    await browser.pause(1500);
  }
}

const foldersPage = new FoldersPage();
export default foldersPage;

export class FoldersRowObject {
  constructor() {}

  folderElement;
  name;
  folderTreeOpenClose;
  rowNumber: number;
  dropdown;

  async getRow(rowNum: number): Promise<FoldersRowObject> {
    this.rowNumber = rowNum;
    if ((await $$('app-eform-tree-view-picker > mat-tree > mat-tree-node'))[rowNum - 1]) {
      const element = (await $$('app-eform-tree-view-picker > mat-tree > mat-tree-node'))[rowNum - 1];
      try {
        this.folderElement = await element.$('.microting-uid');
      } catch (e) {
      }
      this.dropdown = await element.$('button.mat-mdc-menu-trigger');
      try {
        this.name = await (await element.$('div > div')).getText();
      } catch (e) {
      }
      this.folderTreeOpenClose = await element.$('mat-tree-node');
    }
    return this;
  }

  async getDescription(): Promise<{ description: string; language: string }[]> {
    await this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguagesTranslated.length; i++) {
      const language = applicationLanguagesTranslated[i];
      await (
        await (await foldersPage.editLanguageSelector()).$('input')
      ).setValue(language.text);
      await browser.pause(500);
      const value = await (await $('ng-dropdown-panel')).$(
        `.ng-option=${language.text}`
      );
      await value.waitForDisplayed({ timeout: 40000 });
      await value.click();
      await browser.pause(500);
      descriptions.push({
        description: await (
          await foldersPage.editDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
          )
        ).getText(),
        language: language.text,
      });
    }
    await (await foldersPage.cancelEditBtn()).click();
    await browser.pause(500);
    return descriptions;
  }

  async createChild(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    if (!await (await $('#createFolderChildBtn')).isDisplayed()) {
      //await this.folderElement.click();
      await this.dropdown.click();
      await (await $('#createFolderChildBtn')).waitForDisplayed({ timeout: 40000 });
      await this.getRow(this.rowNumber);
    }
    await (await $('#createFolderChildBtn')).click();
    await (await foldersPage.cancelCreateBtn()).waitForDisplayed({
      timeout: 10000,
    });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguagesTranslated[0];
        await (
          await (await foldersPage.createLanguageSelector()).$('input')
        ).setValue(da.text);
        await browser.pause(500);
        const value = await (await $('ng-dropdown-panel')).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
        (
          await foldersPage.createNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(nameConverted);
        await browser.pause(500);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await (
            await (await foldersPage.createLanguageSelector()).$('input')
          ).setValue(language.text);
          await browser.pause(500);
          const value = await (await $('ng-dropdown-panel')).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await browser.pause(500);
          (
            await foldersPage.createNameInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(nameConverted[i].name);
          await browser.pause(500);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];
        await (
          await (await foldersPage.createLanguageSelector()).$('input')
        ).setValue(da.text);
        await browser.pause(500);
        const value = await (await $('ng-dropdown-panel')).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
        (
          await foldersPage.createDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(descriptionConvert);
        await browser.pause(500);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === descriptionConvert[i].language
          );
          await (
            await (await foldersPage.createLanguageSelector()).$('input')
          ).setValue(language.text);
          await browser.pause(500);
          const value = await (await $('ng-dropdown-panel')).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await browser.pause(500);
          (
            await foldersPage.createDescriptionInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(descriptionConvert[i].description);
          await browser.pause(500);
        }
      }
    }
    if (!clickCancel) {
      await (await foldersPage.saveCreateBtn()).click();
    } else {
      (await foldersPage.cancelCreateBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
  }

  async delete(clickCancel = false) {
    if (!await (await $('#deleteFolderTreeBtn')).isDisplayed()) {
      await this.dropdown.click();
      await $('#deleteFolderTreeBtn').waitForDisplayed({timeout: 40000});
    }
    await (await $('#deleteFolderTreeBtn')).click();
    if (!clickCancel) {
      await (await foldersPage.saveDeleteBtn()).waitForClickable({
        timeout: 40000,
      });
      await (await foldersPage.saveDeleteBtn()).click();
    } else {
      await (await foldersPage.cancelDeleteBtn()).click();
    }
    await $('#spinner-animation').waitForDisplayed({
      timeout: 90000,
      reverse: true,
    });
    await (await foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
  }

  async openEditModal() {
    if (!await (await $('#createFolderChildBtn')).isDisplayed()) {
      await this.dropdown.click();
      await (await $('#createFolderChildBtn')).waitForDisplayed({timeout: 40000});
    }
    await (await $('#editFolderTreeBtn')).click();
    await (await foldersPage.cancelEditBtn()).waitForDisplayed({
      timeout: 40000,
    });
  }

  async editFolder(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    await this.openEditModal();
    await (await foldersPage.cancelEditBtn()).waitForDisplayed({
      timeout: 40000,
    });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguagesTranslated[0];
        await (
          await (await foldersPage.editLanguageSelector()).$('input')
        ).setValue(da.text);
        const value = await (await $('ng-dropdown-panel')).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await (
          await foldersPage.editNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(nameConverted);
        await browser.pause(500);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await (
            await (await foldersPage.editLanguageSelector()).$('input')
          ).setValue(language.text);
          const value = await (await $('ng-dropdown-panel')).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await (
            await foldersPage.editNameInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(nameConverted[i].name);
          await browser.pause(500);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];
        await (
          await (await foldersPage.editLanguageSelector()).$('input')
        ).setValue(da.text);
        const value = await (await $('ng-dropdown-panel')).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await (
          await foldersPage.editDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(descriptionConvert);
        await browser.pause(500);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === descriptionConvert[i].language
          );
          await (
            await (await foldersPage.editLanguageSelector()).$('input')
          ).setValue(language.text);
          const value = await (await $('ng-dropdown-panel')).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await (
            await foldersPage.editDescriptionInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(descriptionConvert[i].description);
          await browser.pause(500);
        }
      }
    }
    await this.closeEditModal(clickCancel);
  }

  async closeEditModal(clickCancel = false) {
    if (!clickCancel) {
      await (await foldersPage.saveEditBtn()).click();
    } else {
      await (await foldersPage.cancelEditBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
  }

  async collapseChildren() {
    if (await this.folderTreeOpenClose.$('fa-icon[icon="folder-open"]')) {
      await this.folderTreeOpenClose.click();
    }
  }

  async expandChildren() {
    if (await $('app-eform-tree-view-picker > mat-tree > mat-tree-node[aria-expanded="false"]')) {
      await $('app-eform-tree-view-picker > mat-tree > mat-tree-node[aria-expanded="false"] > button').click();
    }
    await browser.pause(1000);
  }
}

export class FoldersTreeRowObject {
  constructor() {}

  folderTreeElement;
  nameTree;
  dropdown;

  async getRow(
    rowNumFolderParent,
    rowNumberFolderChildren

  ): Promise<FoldersTreeRowObject> {
    if ((await $$('app-eform-tree-view-picker > mat-tree > mat-tree-node.children'))[rowNumberFolderChildren - 1]) {
      const element = (await $$('app-eform-tree-view-picker > mat-tree > mat-tree-node.children'))[rowNumberFolderChildren - 1];
      this.dropdown = await element.$('div > button');
      try {
        this.folderTreeElement = await element.$('#folderTreeId');
      } catch (e) {}
      try {
        this.nameTree = await (await element.$('.folder-tree-name')).getText();
      } catch (e) {}
    }
    return this;
  }

  async getDescription(): Promise<{ description: string; language: string }[]> {
    await this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguagesTranslated.length; i++) {
      const language = applicationLanguagesTranslated[i];
      await (await foldersPage.editLanguageSelector())
        .$('input')
        .setValue(language.text);
      const value = await (await $('ng-dropdown-panel')).$(
        `.ng-option=${language.text}`
      );
      value.waitForDisplayed({ timeout: 40000 });
      await value.click();
      descriptions.push({
        description: await (
          await foldersPage.editDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
          )
        ).getText(),
        language: language.text,
      });
    }
    await (await foldersPage.cancelEditBtn()).click();
    return descriptions;
  }

  async delete(clickCancel = false) {
    if (!await (await $('#deleteFolderTreeBtn')).isDisplayed()) {
      await this.dropdown.click();
      await browser.pause(500);
      await $('#deleteFolderTreeBtn').waitForDisplayed({timeout: 40000});
    }
    await (await $('#deleteFolderTreeBtn')).click();
    if (!clickCancel) {
      await (await foldersPage.saveDeleteBtn()).waitForClickable({
        timeout: 40000,
      });
      await (await foldersPage.saveDeleteBtn()).click();
      await browser.pause(500);
    } else {
      await (await foldersPage.cancelDeleteBtn()).waitForClickable({
        timeout: 40000,
      });
      await (await foldersPage.cancelDeleteBtn()).click();
      await browser.pause(500);
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
  }

  async openEditModal() {
    if (!await (await $('#editFolderTreeBtn')).isDisplayed()) {
      await this.dropdown.click();
      await browser.pause(500);
      await $('#editFolderTreeBtn').waitForDisplayed({timeout: 40000});
    }
    await (await $('#editFolderTreeBtn')).click();
    await browser.pause(500);
    await (await foldersPage.saveEditBtn()).waitForDisplayed({
      timeout: 40000,
    });
    await browser.pause(500);
  }

  async editFolderChild(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    await this.openEditModal();
    if (name != null) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguagesTranslated[0];
        await (
          await (await foldersPage.editLanguageSelector()).$('input')
        ).setValue(da.text);
        await browser.pause(500);
        const value = await (await $('ng-dropdown-panel')).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
        await (
          await foldersPage.editNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await (await foldersPage.editLanguageSelector())
            .$('input')
            .setValue(language.text);
          await browser.pause(500);
          const value = await (await $('ng-dropdown-panel')).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await browser.pause(500);
          await (
            await foldersPage.editNameInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];
        await (
          await (await foldersPage.editLanguageSelector()).$('input')
        ).setValue(da.text);
        await browser.pause(500);
        const value = await (await $('ng-dropdown-panel')).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
        await (
          await foldersPage.editDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
          )
        ).setValue(descriptionConvert);
      }
      if (typeof description === typeof []) {
        const descriptionConvert = description as {
          description: string;
          language: string;
        }[];
        for (let i = 0; i > descriptionConvert.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === descriptionConvert[i].language
          );
          await (await foldersPage.editLanguageSelector())
            .$('input')
            .setValue(language.text);
          await browser.pause(500);
          const value = await (await $('ng-dropdown-panel')).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await browser.pause(500);
          await (
            await foldersPage.editDescriptionInput(
              applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
            )
          ).setValue(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      await (await foldersPage.saveEditBtn()).click();
    } else {
      await (await foldersPage.cancelEditBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
    await browser.pause(500);
  }
}
