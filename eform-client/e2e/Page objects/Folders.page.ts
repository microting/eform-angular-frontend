import { PageWithNavbarPage } from './PageWithNavbar.page';
import { applicationLanguages } from 'src/app/common/const';

class FoldersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async newFolderBtn(): Promise<WebdriverIO.Element> {
    return $('#newFolderBtn');
  }

  public async createNameInput(translationIndex: number): Promise<WebdriverIO.Element> {
    return $(`#createFolderNameTranslation_${translationIndex}`);
  }

  public async createDescription(translationIndex: number): Promise<WebdriverIO.Element> {
    return $(`#createFolderDescriptionTranslation_${translationIndex}`);
  }

  public async createDescriptionInput(translationIndex: number): Promise<WebdriverIO.Element> {
    return await (await this.createDescription(translationIndex)).$('.pell-content');
  }

  public async createDescriptionInputPellBold(translationIndex: number): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Bold"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createDescriptionInputPellUnderline(translationIndex: number): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Underline"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createDescriptionInputPellItalic(translationIndex: number): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Italic"]'
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createDescriptionInputPellStrikeThrough(translationIndex: number): Promise<WebdriverIO.Element> {
    const ele = await (await this.createDescription(translationIndex)).$(
      'button[title="Strike-through"]'
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
      'button[title="Strike-through"]'
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

  public async editNameInput(translationIndex: number): Promise<WebdriverIO.Element> {
    const ele = await $(`#editFolderNameTranslation_${translationIndex}`);
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editDescription(translationIndex: number): Promise<WebdriverIO.Element> {
    const ele = await $(`#editFolderDescriptionTranslation_${translationIndex}`);
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editDescriptionInput(translationIndex: number): Promise<WebdriverIO.Element> {
    const ele = await (await this.editDescription(translationIndex)).$('.pell-content');
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
    if (!(await $('#folderTreeId')).isExisting()) {
      await browser.pause(500);
    }
    return (await $$('#folderTreeId')).length;
  }

  public async rowNumParents(): Promise<number> {
    await browser.pause(500);
    return (await $$('#folderTreeName')).length;
  }

  public async rowChildrenNum(): Promise<number> {
    return (await $$('.tree-node-level-2')).length;
  }

  public async editLanguageSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#editLanguageSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async getFolder(num): Promise<FoldersRowObject> {
    const folderObj =  new FoldersRowObject();
    return await folderObj.getRow(num);
  }

  async getFolderByName(nameFolder: string): Promise<FoldersRowObject> {
    await browser.pause(500);
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const folderObj = new FoldersRowObject();
      const folder = await folderObj.getRow(i);
      if (folder.name === nameFolder) {
        return folder;
      }
    }
    return null;
  }

  async getFolderRowNumByName(nameFolder: string): Promise<number> {
    for (let i = 1; i < await this.rowNum() + 1; i++) {
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
    await (await this.cancelCreateBtn()).waitForDisplayed({ timeout: 10000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        await (await this.createLanguageSelector()).$('input').setValue(da.text);
        const value = (await this.createLanguageSelector()).$(`.ng-option=${da.text}`);
        value.waitForDisplayed({ timeout: 40000 });
        value.click();
        (await this.createNameInput(
          applicationLanguages.findIndex((x) => x.text === da.text)
        )).setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = await applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          (await this.createLanguageSelector()).$('input').setValue(language.text);
          const value = (await this.createLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 40000 });
          value.click();
          (await this.createNameInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          )).setValue(nameConverted[i].name);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];

        await (await (await foldersPage.createLanguageSelector()).$('input')).setValue(da.text);
        const value = await (await this.createLanguageSelector()).$(`.ng-option=${da.text}`);
        value.waitForDisplayed({ timeout: 40000 });
        value.click();
        (await this.createDescriptionInput(
          applicationLanguages.findIndex((x) => x.text === da.text)
        )).setValue(descriptionConvert);
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
          (await this.createLanguageSelector()).$('input').setValue(language.text);
          const value = (await this.createLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          value.waitForDisplayed({ timeout: 40000 });
          value.click();
          (await this.createDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          )).setValue(descriptionConvert[i].description);
        }
      }
    }
  }

  async closeCreateFolder(clickCancel = false) {
    if (!clickCancel) {
      await (await this.saveCreateBtn()).waitForClickable({ timeout: 40000 });
      await (await this.saveCreateBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      await (await this.cancelCreateBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
  }
}

const foldersPage = new FoldersPage();
export default foldersPage;

export class FoldersRowObject {
  constructor() {
  }

  folderElement;
  name;
  // description;
  editBtn;
  deleteBtn;
  createFolderChildBtn;
  folderTreeOpenClose;
  rowNumber: number;

  async getRow(rowNum: number): Promise<FoldersRowObject> {
    this.rowNumber = rowNum;
    if ((await $$('.tree-node-level-1'))[rowNum - 1]) {
      const element = (await $$('.tree-node-level-1'))[rowNum - 1];
      try {
        this.folderElement = await element.$('#folderTreeId');
      } catch (e) {
        console.log(e.message());
      }
      try {
        this.name = await (await element.$('#folderTreeName')).getText();
      } catch (e) {
        console.log(e.message());
      }
      // try {
      //   this.description = element.$('#folderTreeDescription').getText();
      // } catch (e) {
      // }
      this.folderTreeOpenClose = await element.$('#folderTreeOpenClose');
      this.editBtn = await this.folderElement.$('#editFolderTreeBtn');
      this.deleteBtn = await this.folderElement.$('#deleteFolderTreeBtn');
      this.createFolderChildBtn = await this.folderElement.$('#createFolderChildBtn');
    }
    return this;
  }

  async getDescription(): Promise<{ description: string; language: string }[]> {
    await this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguages.length; i++) {
      const language = applicationLanguages[i];
      await (await (await foldersPage.editLanguageSelector()).$('input')).setValue(language.text);
      const value = await (await foldersPage.editLanguageSelector()).$(
        `.ng-option=${language.text}`
      );
      await value.waitForDisplayed({ timeout: 40000 });
      await value.click();
      descriptions.push({
        description: await (await foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          ))
          .getText(),
        language: language.text,
      });
    }
    await (await foldersPage.cancelEditBtn()).click();
    return descriptions;
  }

  async createChild(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    // await browser.pause(10000);
    // console.log(this.createFolderChildBtn);
    if (this.createFolderChildBtn.error != null) {
      await this.folderElement.click();
      await this.createFolderChildBtn.waitForDisplayed({ timeout: 40000 });
      await this.getRow(this.rowNumber);
    }
    await this.createFolderChildBtn.click();
    await (await foldersPage.cancelCreateBtn()).waitForDisplayed({ timeout: 10000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        await (await (await foldersPage.createLanguageSelector()).$('input')).setValue(da.text);
        const value = await (await foldersPage.createLanguageSelector()).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        (await foldersPage
          .createNameInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          ))
          .setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          await (await (await foldersPage.createLanguageSelector()).$('input')).setValue(language.text);
          const value = await (await foldersPage.createLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          (await foldersPage
            .createNameInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            ))
            .setValue(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        await (await (await foldersPage.createLanguageSelector()).$('input')).setValue(da.text);
        const value = await (await foldersPage.createLanguageSelector()).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        (await foldersPage
          .createDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          ))
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
          await (await (await foldersPage.createLanguageSelector()).$('input')).setValue(language.text);
          const value = await (await foldersPage.createLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          (await foldersPage
            .createDescriptionInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            ))
            .setValue(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      await (await foldersPage.saveCreateBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      (await foldersPage.cancelCreateBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
  }

  async delete(clickCancel = false) {
    if (this.deleteBtn.error !== undefined) {
      await this.folderElement.click();
      await this.getRow(this.rowNumber);
      await this.deleteBtn.waitForDisplayed({ timeout: 40000 });
      await this.deleteBtn.click();
    } else {
      await this.deleteBtn.click();
    }
    if (!clickCancel) {
      await (await foldersPage.saveDeleteBtn()).waitForClickable({ timeout: 40000 });
      await (await foldersPage.saveDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 2000,
        reverse: true,
      });
    } else {
      await (await foldersPage.cancelDeleteBtn()).click();
    }
    await await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
  }

  async openEditModal() {
    if (this.editBtn.error !== null) {
      this.folderElement.click();
      this.editBtn.waitForDisplayed({ timeout: 40000 });
    }
    await this.editBtn.click();
    await (await foldersPage.cancelEditBtn()).waitForDisplayed({ timeout: 40000 });
  }

  async editFolder(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    await this.openEditModal();
    await (await foldersPage.cancelEditBtn()).waitForDisplayed({ timeout: 40000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguages[0];
        await (await (await foldersPage.editLanguageSelector()).$('input')).setValue(da.text);
        const value = await (await foldersPage.editLanguageSelector()).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await (await foldersPage
          .editNameInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          ))
          .setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          await (await (await foldersPage.editLanguageSelector()).$('input')).setValue(language.text);
          const value = await (await foldersPage.editLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await (await foldersPage
            .editNameInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            ))
            .setValue(nameConverted[i].name);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        await (await (await foldersPage.editLanguageSelector()).$('input')).setValue(da.text);
        const value = await (await foldersPage.editLanguageSelector()).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await (await foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          ))
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
          await (await (await foldersPage.editLanguageSelector()).$('input')).setValue(language.text);
          const value = (await foldersPage.editLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await (await foldersPage
            .editDescriptionInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            ))
            .setValue(descriptionConvert[i].description);
        }
      }
    }
    await this.closeEditModal(clickCancel);
  }

  async closeEditModal(clickCancel = false) {
    if (!clickCancel) {
      await (await foldersPage.saveEditBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 40000,
        reverse: true,
      });
    } else {
      await (await foldersPage.cancelEditBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
  }

  async collapseChildren() {
    if (await this.folderTreeOpenClose.$('fa-icon[icon="folder-open"]')) {
      await this.folderTreeOpenClose.click();
    }
  }

  async expandChildren() {
    if (await this.folderTreeOpenClose.$('fa-icon[icon="folder"]')) {
      await this.folderTreeOpenClose.click();
    }
  }
}

export class FoldersTreeRowObject {
  constructor() { }

  folderTreeElement;
  nameTree;
  // descriptionTree;
  editTreeBtn;
  deleteTreeBtn;

  async getRow(rowNumFolderParent, rowNumberFolderChildren): Promise<FoldersTreeRowObject> {
    if (
      (await (await (await $$('.tree-node-level-1'))[rowNumFolderParent - 1]).$$('.tree-node-level-2'))[
      rowNumberFolderChildren - 1
        ]
    ) {
      const baseElement = await $$('.tree-node-level-1');
      const subElement = baseElement[rowNumFolderParent - 1];
      const element = (await subElement.$$('.tree-node-level-2'))[rowNumberFolderChildren - 1];
      try {
        this.folderTreeElement = await element.$('#folderTreeId');
      } catch (e) {}
      try {
        this.nameTree = await (await element.$('#folderTreeName')).getText();
      } catch (e) {}
      // try {
      //   this.descriptionTree = element.$$('#folderTreeDescription')[rowNumberFolderChildren - 1].getText();
      // } catch (e) {
      // }
      this.editTreeBtn = await element.$('#editFolderTreeBtn');
      this.deleteTreeBtn = await element.$('#deleteFolderTreeBtn');
    }
    return this;
  }

  async getDescription(): Promise<{ description: string; language: string }[]> {
    await this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguages.length; i++) {
      const language = applicationLanguages[i];
      await (await foldersPage.editLanguageSelector()).$('input').setValue(language.text);
      const value = await (await foldersPage.editLanguageSelector()).$(
        `.ng-option=${language.text}`
      );
      value.waitForDisplayed({ timeout: 40000 });
      await value.click();
      descriptions.push({
        description: await (await foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === language.text)
          ))
          .getText(),
        language: language.text,
      });
    }
    await (await foldersPage.cancelEditBtn()).click();
    return descriptions;
  }

  async delete(clickCancel = false) {
    if (this.deleteTreeBtn.error != null) {
      await this.folderTreeElement.click();
      await this.deleteTreeBtn.waitForDisplayed({ timeout: 40000 });
    }
    await this.deleteTreeBtn.click();
    if (!clickCancel) {
      await (await foldersPage.saveDeleteBtn()).waitForClickable({ timeout: 40000 });
      await (await foldersPage.saveDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 2000,
        reverse: true,
      });
    } else {
      await (await foldersPage.cancelDeleteBtn()).waitForClickable({ timeout: 40000 });
      await (await foldersPage.cancelDeleteBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
  }

  async openEditModal() {
    if (this.editTreeBtn.error != null) {
      await this.folderTreeElement.click();
      await this.editTreeBtn.waitForDisplayed({ timeout: 40000 });
    }
    await this.editTreeBtn.click();
    await (await foldersPage.saveEditBtn()).waitForDisplayed({ timeout: 40000 });
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
        const da = applicationLanguages[0];
        await (await (await foldersPage.editLanguageSelector()).$('input')).setValue(da.text);
        const value = await (await foldersPage.editLanguageSelector()).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await (await foldersPage
          .editNameInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          ))
          .setValue(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguages.find(
            (x) => x.text === nameConverted[i].language
          );
          await (await foldersPage.editLanguageSelector()).$('input').setValue(language.text);
          const value = await (await foldersPage.editLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await (await foldersPage
            .editNameInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            ))
            .setValue(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguages[0];
        await (await (await foldersPage.editLanguageSelector()).$('input')).setValue(da.text);
        const value = await (await foldersPage.editLanguageSelector()).$(
          `.ng-option=${da.text}`
        );
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await (await foldersPage
          .editDescriptionInput(
            applicationLanguages.findIndex((x) => x.text === da.text)
          ))
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
          await (await foldersPage.editLanguageSelector()).$('input').setValue(language.text);
          const value = await (await foldersPage.editLanguageSelector()).$(
            `.ng-option=${language.text}`
          );
          await value.waitForDisplayed({ timeout: 40000 });
          await value.click();
          await (await foldersPage
            .editDescriptionInput(
              applicationLanguages.findIndex((x) => x.text === language.text)
            ))
            .setValue(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      await (await foldersPage.saveEditBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 40000,
        reverse: true,
      });
    } else {
      await (await foldersPage.cancelEditBtn()).click();
    }
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
  }
}
