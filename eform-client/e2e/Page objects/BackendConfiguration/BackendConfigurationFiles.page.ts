import Page from '../Page';
import {selectValueInNgSelector} from '../../Helpers/helper-functions';
import tagsModalPage from '../TagsModal.page';

export class BackendConfigurationFilesPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('.cdk-row')).length;
  }

  public async refreshTableButton() {
    const ele = await $(`.cdk-header-cell.cdk-column-actions button`);
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async backendConfigurationPnButton() {
    const ele = await $('#backend-configuration-pn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async backendConfigurationPnFilesButton() {
    const ele = await $('#backend-configuration-pn-files');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async filesCreateBtn() {
    const ele = await $('#addNewFileBtn');
    await ele.waitForDisplayed({timeout: 200000});
    await ele.waitForClickable({timeout: 200000});
    return ele;
  }

  public async goToFiles() {
    if (!await (await this.backendConfigurationPnFilesButton()).isDisplayed()) {
      await (await this.backendConfigurationPnButton()).click();
    }
    await (await this.backendConfigurationPnFilesButton()).click();
    await (await this.filesCreateBtn()).waitForClickable({timeout: 90000});
  }

  public async deleteFileBtn() {
    const ele = await $('#deleteFileBtn');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async cancelDeleteFileBtn() {
    const ele = await $('#cancelDeleteFileBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async fileNameSaveBtn() {
    const ele = await $('#fileNameSaveBtn');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async cancelSaveFileNameBtn() {
    const ele = await $('#cancelSaveFileNameBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async fileNameInput() {
    const ele = await $('#fileNameInput');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async backBtn() {
    const ele = await $('#backBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async uploadFilesBtn() {
    const ele = await $('#uploadFilesBtn');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async manageTagsBtn() {
    const ele = await $('#manageTagsBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async pdfInput() {
    const ele = await $('#pdfInput');
    await ele.waitForExist({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyIdSelector() { // it's selector. if you need input - add to query
    const ele = await $('#propertyIdSelector');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async tagsSelector() { // it's selector. if you need input - add to query
    const ele = await $('#tagsSelector');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async tagSelector() { // it's selector. if you need input - add to query
    const ele = await $('#tagSelector');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async fileTagsSaveBtn() {
    const ele = await $('#fileTagsSaveBtn');
    await ele.waitForDisplayed({timeout: 40000});
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async cancelSaveFileTagsBtn() {
    const ele = await $('#cancelSaveFileTagsBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async createFile(
    file: BackendFileCreate,
    clickCancel = false
  ) {
    await this.openCreateFile(file);
    await this.closeCreateFile(clickCancel);
  }

  public async openCreateFile(file: BackendFileCreate) {
    await (await this.filesCreateBtn()).click();
    await (await this.backBtn()).waitForClickable();
    if (file) {
      if (file.propertiesForCreate) {
        for (let i = 0; i < file.propertiesForCreate.length; i++) {
          await selectValueInNgSelector(await this.propertyIdSelector(), file.propertiesForCreate[i]);
        }
      }
      if (file.tags) {
        for (let i = 0; i < file.tags.length; i++) {
          await selectValueInNgSelector(await this.tagsSelector(), file.tags[i]);
        }
      }
      if (file.files) {
        const localPath = process.cwd();
        for (let i = 0; i < file.files.length; i++) {
          const filePath = localPath + `/e2e/Assets/${file.files[i]}`;
          const remoteFilePath = await browser.uploadFile(filePath);
          await (await this.pdfInput()).addValue(remoteFilePath);
        }
      }
    }
  }

  public async closeCreateFile(clickCancel = false) {
    if (clickCancel) {
      if (await (await this.backBtn()).isExisting) {
        await (await this.backBtn()).click();
      } else {
        await this.goToFiles();
      }
    } else {
      if (await (await this.uploadFilesBtn()).isClickable) {
        await (await this.uploadFilesBtn()).click();
      } else {
        // eslint-disable-next-line no-console
        console.log('#uploadFilesBtn is no clickable. Maybe properties or files not set');
      }
    }
  }


  async createNewTag(nameTag: string) {
    await this.createNewTags([nameTag]);
  }

  async createNewTags(nameTags: string[]) {
    await (await this.manageTagsBtn()).click();
    await (await tagsModalPage.tagsModalCloseBtn()).waitForDisplayed({
      timeout: 40000,
    });
    for (let i = 0; i < nameTags.length; i++) {
      await tagsModalPage.createTag(nameTags[i]);
    }
    await tagsModalPage.closeTagModal();
    await (await this.manageTagsBtn()).waitForClickable({timeout: 40000});
  }

  async removeTag(nameTag: string) {
    await this.removeTags([nameTag]);
  }

  async removeTags(nameTags: string[]) {
    await (await this.manageTagsBtn()).click();
    const closeBtn = await tagsModalPage.tagsModalCloseBtn();
    await closeBtn.waitForDisplayed({timeout: 40000});
    for (let i = 0; i < nameTags.length; i++) {
      const tag = await tagsModalPage.getTagByName(nameTags[i]);
      await tag.deleteTag();
    }
    await tagsModalPage.closeTagModal();
    await (await this.manageTagsBtn()).waitForClickable({timeout: 40000});
  }

  public async getFirstFileRowObject(): Promise<FileRowObject> {
    return await this.getFileRowObjectByIndex(1);
  }

  public async getLastFileRowObject(): Promise<FileRowObject> {
    return await this.getFileRowObjectByIndex(await this.rowNum());
  }

  public async getFilesRowObjectByIndexes(indexes: number[]): Promise<FileRowObject[]> {
    let ret = [];
    for (let i = 0; i < indexes.length; i++) {
      ret = [...ret, await this.getFileRowObjectByIndex(indexes[i])];
    }
    return ret;
  }

  public async getFileRowObjectByIndex(
    index: number
  ): Promise<FileRowObject> {
    return await new FileRowObject().getRow(index);
  }

  public async clearTable() {
    await browser.pause(2000);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      await (await this.getFileRowObjectByIndex(1)).delete();
    }
  }
}

const backendConfigurationFilesPage = new BackendConfigurationFilesPage();
export default backendConfigurationFilesPage;

export class FileRowObject {
  constructor() {
  }

  public row: WebdriverIO.Element;
  public checkbox: WebdriverIO.Element;
  public id: number;
  public createDate: string;
  public fileName: string;
  public properties: string[];
  public tags: string[];
  public editTagsBtn: WebdriverIO.Element;
  public editFileNameBtn: WebdriverIO.Element;
  public viewPDFBtn: WebdriverIO.Element;
  public deleteFileBtn: WebdriverIO.Element;

  public async getRow(rowNum: number): Promise<FileRowObject> {
    rowNum = rowNum - 1;
    this.row = (await $$('tbody > tr'))[rowNum];
    if (this.row) {
      this.checkbox = await this.row.$('.mat-column-select .column-select');
      this.id = +await (await this.row.$('.mat-column-id span')).getText();
      this.createDate = await (await this.row.$('.mat-column-createDate span')).getText();
      this.fileName = await (await this.row.$('.mat-column-fileName span')).getText();
      const properties = (await (await this.row.$('.mat-column-property')).getText()).split('home');
      if (properties.length > 0) {
        properties[properties.length - 1] = properties[properties.length - 1].replace('edit', ''); // delete button
        this.properties = properties
          .filter(x => x) // delete empty strings
          .map(x => x.replaceAll('\n', '')); // delete enters
      }
      const tags = (await (await this.row.$('.mat-column-tags')).getText()).split('discount');
      if (tags.length > 0) {
        tags[tags.length - 1] = tags[tags.length - 1].replace('edit', ''); // delete button
        this.tags = tags
          .filter(x => x) // delete empty strings
          .map(x => x.replaceAll('\n', '')); // delete enters
      }
      this.editTagsBtn = await this.row.$('.mat-column-tags button');
      this.viewPDFBtn = await this.row.$$('.mat-column-actions button')[0];
      this.editFileNameBtn = await this.row.$$('.mat-column-actions button')[1];
      this.deleteFileBtn = await this.row.$$('.mat-column-actions button')[2];
    }
    return this;
  }

  public async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  public async openDeleteModal() {
    await this.deleteFileBtn.click();
    await (
      await backendConfigurationFilesPage.cancelDeleteFileBtn()
    ).waitForClickable({timeout: 40000});
  }

  public async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationFilesPage.cancelDeleteFileBtn()
      ).click();
    } else {
      await (
        await backendConfigurationFilesPage.deleteFileBtn()
      ).click();
    }
    await (
      await backendConfigurationFilesPage.filesCreateBtn()
    ).waitForClickable({timeout: 40000});
  }

  public async editFile(fileEdit: BackendFileEdit, clickCancel = false) {
    await this.openEditModal(fileEdit);
    await this.closeEditModal(clickCancel);
    if (fileEdit.tags && fileEdit.tags.length > 0) {
      await this.editTags(fileEdit.tags);
    }
  }

  public async openEditModal(fileEdit: BackendFileEdit) {
    await this.editFileNameBtn.click();
    await (
      await backendConfigurationFilesPage.cancelSaveFileNameBtn()
    ).waitForClickable({timeout: 40000});
    if (fileEdit) {
      if (fileEdit.fileName) {
        await (
          await backendConfigurationFilesPage.fileNameInput()
        ).setValue(fileEdit.fileName);
      }
      if(fileEdit.propertiesForEdit && fileEdit.propertiesForEdit.length > 0) {
        const clearBtn = await $('.ng-clear-wrapper')
        await clearBtn.waitForClickable();
        await clearBtn.click(); // clear all properties
        for (let i = 0; i < fileEdit.propertiesForEdit.length; i++) {
          await selectValueInNgSelector(await backendConfigurationFilesPage.propertyIdSelector(), fileEdit.propertiesForEdit[i], true);
        }
      }
    }
  }

  public async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationFilesPage.cancelSaveFileNameBtn()
      ).click();
    } else {
      await (
        await backendConfigurationFilesPage.fileNameSaveBtn()
      ).click();
    }
    await (
      await backendConfigurationFilesPage.filesCreateBtn()
    ).waitForClickable({timeout: 40000});
  }

  public async editTags(tags: string[], clickCancel = false) {
    await this.openEditTags(tags);
    await this.closeEditTags(clickCancel);
  }

  public async openEditTags(tags: string[]) {
    await this.editTagsBtn.click();
    await (await backendConfigurationFilesPage.tagSelector()).waitForDisplayed();
    if (tags) {
      const clearBtn = await $('.ng-clear-wrapper')
      await clearBtn.waitForClickable();
      await clearBtn.click(); // clear all tags
      for (let i = 0; i < tags.length; i++) {
        await selectValueInNgSelector(await backendConfigurationFilesPage.tagSelector(), tags[i], true);
      }
    }
  }

  public async closeEditTags(clickCancel = false) {
    if (clickCancel) {
      await (await backendConfigurationFilesPage.cancelSaveFileTagsBtn()).click();
    } else {
      await (await backendConfigurationFilesPage.fileTagsSaveBtn()).click();
    }
    await (await backendConfigurationFilesPage.filesCreateBtn()).waitForClickable();
  }
}

export interface BackendFileCreate {
  propertiesForCreate: string[];
  tags: string[];
  files: string[];
  propertyNamesForExpect: string[];
}

export interface BackendFileEdit {
  propertiesForEdit: string[];
  tags: string[];
  fileName: string;
  propertyNamesForExpect: string[];
}
