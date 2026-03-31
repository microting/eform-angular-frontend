// noinspection JSIgnoredPromiseFromCall

import { PageWithNavbarPage } from './PageWithNavbar.page';
import XMLForEform from '../Constants/XMLForEform';
import { FoldersRowObject } from './Folders.page';
import { DeviceUsersRowObject } from './DeviceUsers.page';
import { TagsModalPage } from './TagsModal.page';
import { Page, Locator } from '@playwright/test';

export class MyEformsPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public newEformBtn(): Locator {
    return this.page.locator('#newEFormBtn');
  }

  public async waitForNewEformBtn(): Promise<Locator> {
    const el = this.newEformBtn();
    await el.waitFor({ state: 'visible', timeout: 40000 });
    return el;
  }

  public async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('.eform-id').count();
  }

  public idSortBtn(): Locator {
    return this.page.locator('.eform-id-header .mat-header-cell-inner .mat-sort-header');
  }

  public async waitForIdSortBtn(): Promise<Locator> {
    const ele = this.idSortBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public createdAtSortBtn(): Locator {
    return this.page.locator('.eform-created-at-header .mat-header-cell-inner .mat-sort-header');
  }

  public async waitForCreatedAtSortBtn(): Promise<Locator> {
    const ele = this.createdAtSortBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public eformNameSortBtn(): Locator {
    return this.page.locator('.eform-name-header .mat-header-cell-inner .mat-sort-header');
  }

  public async waitForEformNameSortBtn(): Promise<Locator> {
    const ele = this.eformNameSortBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public eformFilter(): Locator {
    return this.page.locator('#labelInput');
  }

  // Create eform modal
  public createEformTagSelector(): Locator {
    return this.page.locator('#createEFormMultiSelector');
  }

  public async waitForCreateEformTagSelector(): Promise<Locator> {
    const ele = this.createEformTagSelector();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public importEformsBtn(): Locator {
    return this.page.locator('#importEformsBtn');
  }

  public async waitForImportEformsBtn(): Promise<Locator> {
    const ele = this.importEformsBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public createEformNewTagInput(): Locator {
    return this.page.locator('#addTagInput');
  }

  public xmlTextArea(): Locator {
    return this.page.locator('#eFormXml');
  }

  public async waitForXmlTextArea(): Promise<Locator> {
    const ele = this.xmlTextArea();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public createEformBtn(): Locator {
    return this.page.locator('#createEformBtn');
  }

  public async waitForCreateEformBtn(): Promise<Locator> {
    const ele = this.createEformBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public cancelCreateEformBtn(): Locator {
    return this.page.locator('#cancelCreateEformBtn');
  }

  tagEditSaveBtn(): Locator {
    return this.page.locator('#tagEditSaveBtn');
  }

  async waitForTagEditSaveBtn(): Promise<Locator> {
    const el = this.tagEditSaveBtn();
    await el.waitFor({ state: 'visible', timeout: 30000 });
    return el;
  }

  tagEditSaveCancelBtn(): Locator {
    return this.page.locator('#tagEditSaveCancelBtn');
  }

  async waitForTagEditSaveCancelBtn(): Promise<Locator> {
    const ele = this.tagEditSaveCancelBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  tagSelector(): Locator {
    return this.page.locator('#tagSelector');
  }

  saveParingBtn(): Locator {
    return this.page.locator('#saveParingBtn');
  }

  cancelParingBtn(): Locator {
    return this.page.locator('#cancelParingBtn');
  }

  xlsxImportInput(): Locator {
    return this.page.locator('#xlsxImportInput');
  }

  eformsManageTagsBtn(): Locator {
    return this.page.locator('#eformsManageTagsBtn');
  }

  async waitForEformsManageTagsBtn(): Promise<Locator> {
    const ele = this.eformsManageTagsBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  async getFirstMyEformsRowObj(): Promise<MyEformsRowObject> {
    await this.page.waitForTimeout(500);
    const result = new MyEformsRowObject(this.page, this);
    return await result.getRow(1);
  }

  async getEformsRowObjByNameEForm(
    nameEform: string
  ): Promise<MyEformsRowObject | null> {
    await this.page.waitForTimeout(500);
    const rowNum = await this.rowNum();
    for (let i = 1; i < rowNum + 1; i++) {
      const form = await this.getEformRowObj(i, false);
      if (form.eFormName === nameEform) {
        return form;
      }
    }
    return null;
  }

  async getLastMyEformsRowObj(): Promise<MyEformsRowObject> {
    await this.page.waitForTimeout(1500);
    const obj = new MyEformsRowObject(this.page, this);
    const rowNum = await this.rowNum();
    return await obj.getRow(rowNum);
  }

  async getEformRowObj(
    num: number,
    pause: boolean = false
  ): Promise<MyEformsRowObject> {
    if (pause) {
      await this.page.waitForTimeout(500);
    }
    const result = new MyEformsRowObject(this.page, this);
    return await result.getRow(num);
  }

  public async clearEFormTable() {
    await this.page.waitForTimeout(2000);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      await (await this.getEformRowObj(1)).deleteEForm();
    }
  }

  async createNewEform(
    eFormLabel: string,
    newTagsList: string[] = [],
    tagAddedNum = 0,
    xml = ''
  ) {
    await (await this.waitForNewEformBtn()).click();
    await this.page.waitForTimeout(500);
    await this.xmlTextArea().waitFor({ state: 'visible', timeout: 40000 });
    // Create replaced xml and insert it in textarea
    if (!xml) {
      xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
    }
    await this.page.evaluate(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    await this.page.waitForTimeout(200);
    await this.xmlTextArea().pressSequentially(' ');
    await this.page.waitForTimeout(500);
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      await this.createEformNewTagInput().fill(
        newTagsList.join(',')
      );
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      for (let i = 0; i < tagAddedNum; i++) {
        await this.createEformTagSelector().click();
        await this.page.waitForTimeout(500);
        const selectedTag = this.page.locator('.ng-option:not(.ng-option-selected)').first();
        selectedTags.push((await selectedTag.textContent())?.trim());
        await selectedTag.waitFor({ state: 'visible', timeout: 40000 });
        await selectedTag.click();
        await this.page.waitForTimeout(500);
        await this.page.locator('#createEformBtn').waitFor({ state: 'visible', timeout: 10000 });
      }
    }
    await (await this.waitForCreateEformBtn()).click();
    await this.newEformBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(500);
    return { added: addedTags, selected: selectedTags };
  }

  async createNewTag(nameTag: string) {
    await this.createNewTags([nameTag]);
  }

  async createNewTags(nameTags: string[]) {
    const tagsModal = new TagsModalPage(this.page);
    await (await this.waitForEformsManageTagsBtn()).click();
    await tagsModal.tagsModalCloseBtn().waitFor({
      state: 'visible',
      timeout: 40000,
    });
    for (let i = 0; i < nameTags.length; i++) {
      await tagsModal.createTag(nameTags[i]);
    }
    await tagsModal.closeTagModal();
    await this.newEformBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async removeTag(nameTag: string) {
    await this.removeTags([nameTag]);
  }

  async removeTags(nameTags: string[]) {
    const tagsModal = new TagsModalPage(this.page);
    await (await this.waitForEformsManageTagsBtn()).click();
    await tagsModal.tagsModalCloseBtn().waitFor({ state: 'visible', timeout: 40000 });
    for (let i = 0; i < nameTags.length; i++) {
      const tag = await tagsModal.getTagByName(nameTags[i]);
      if (tag) {
        await tag.deleteTag();
      }
    }
    await tagsModal.closeTagModal();
    await this.newEformBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async enterTagFilter(nameTag: string) {
    await this.tagSelector().locator('input').fill(nameTag);
    const option = this.page.locator('ng-dropdown-panel .ng-option').first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }
}

export class MyEformsRowObject {
  public page: Page;
  private myEformsPage: MyEformsPage;

  constructor(page: Page, myEformsPage: MyEformsPage) {
    this.page = page;
    this.myEformsPage = myEformsPage;
  }

  currentPosition: number;
  element: Locator;
  id: number;
  createdAt: Date;
  eFormName: string;
  tags: Locator;
  editTagsBtn: Locator;
  addPairEformBtn: Locator;
  editPairEformBtn: Locator;
  editColumnsBtn: Locator;
  deleteBtn: Locator;
  uploadZipArchiveBtn: Locator;
  goVisualEditorBtn: Locator;

  async getRow(rowNum: number) {
    this.currentPosition = rowNum - 1;
    this.element = this.page.locator('#mainPageEFormsTableBody tr.mat-mdc-row').nth(this.currentPosition);
    this.id = +(await this.page.locator('#eform-id-' + (this.currentPosition)).first().textContent());
    try {
      const val = this.page.locator('#eform-created-at-' + (this.currentPosition)).first();
      this.createdAt = new Date(await val.textContent());
    } catch (e) {
    }
    try {
      const val = this.page.locator('#eform-label-' + (this.currentPosition)).first();
      this.eFormName = await val.textContent();
    } catch (e) {
    }
    this.tags = this.element.locator('.mat-column-tags mat-chip span span span.mat-mdc-chip-action-label');
    this.editTagsBtn = this.page.locator('#eform-edit-btn-' + (this.currentPosition)).first();
    this.editPairEformBtn = this.page.locator(`#mainPageEFormsTableBody tr.mat-mdc-row`).nth(this.currentPosition)
      .locator('#eform-pairing-btn-' + (this.currentPosition));
    this.addPairEformBtn = this.page.locator(`#mainPageEFormsTableBody tr.mat-mdc-row`).nth(this.currentPosition)
      .locator('#eform-add-btn-' + (this.currentPosition));
    this.editColumnsBtn = this.page.locator('#edit-columns-btn-' + (this.currentPosition));
    this.deleteBtn = this.page.locator('#delete-eform-btn-' + (this.currentPosition));
    this.uploadZipArchiveBtn = this.page.locator('#upload-zip-btn-' + (this.currentPosition));
    this.goVisualEditorBtn = this.page.locator('#edit-eform-btn-' + (this.currentPosition));
    return this;
  }

  async deleteEForm() {
    await this.clickActionsMenu();
    await this.deleteBtn.click();
    await this.page.waitForTimeout(1000);
    const eFormDeleteDeleteBtn = this.page.locator('#eFormDeleteDeleteBtn');
    await eFormDeleteDeleteBtn.click();
    await this.page.waitForTimeout(1000);
  }

  private async clickActionsMenu() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(`#actionMenu${this.currentPosition}`).click();
    await this.page.waitForTimeout(1000);
  }

  async addTag(tag: string) {
    await this.editTagsBtn.waitFor({ state: 'visible', timeout: 40000 });
    await this.editTagsBtn.click();
    await this.page.waitForTimeout(500);
    const tagSelector = this.page.locator('app-eform-edit-tags-modal #tagSelector input');
    await tagSelector.waitFor({ state: 'visible', timeout: 40000 });
    await tagSelector.fill(tag);
    const ngDropdownPanel = this.page.locator('.ng-option');
    await ngDropdownPanel.waitFor({ state: 'visible', timeout: 40000 });
    await ngDropdownPanel.click();
    await (await this.myEformsPage.waitForTagEditSaveBtn()).click();
    await this.page.waitForTimeout(500);
  }

  async deleteTags(tags: string[]) {
    await this.editTagsBtn.waitFor({ state: 'visible', timeout: 40000 });
    await this.editTagsBtn.click();
    await this.page.locator('app-eform-edit-tags-modal #tagSelector').waitFor({
      state: 'visible',
      timeout: 40000,
    });
    const tagSelectorValues = this.page.locator(
      'app-eform-edit-tags-modal #tagSelector .ng-value'
    );
    const count = await tagSelectorValues.count();
    for (let i = 0; i < count; i++) {
      const tagName = await tagSelectorValues.nth(i).locator('span.ng-value-label').textContent();
      const deleteTagButton = tagSelectorValues.nth(i).locator('span.ng-value-icon');
      if (tags.includes(tagName?.trim())) {
        await deleteTagButton.click();
      }
    }
    await (await this.myEformsPage.waitForTagEditSaveBtn()).click();
    await this.page.waitForTimeout(500);
  }

  async pair(folder: FoldersRowObject, users: DeviceUsersRowObject[]) {
    if ((await this.editPairEformBtn.count()) > 0) {
      await this.editPairEformBtn.click();
    } else {
      await this.addPairEformBtn.click();
    }
    await this.page.waitForTimeout(500);
    await this.myEformsPage.cancelParingBtn().waitFor({
      state: 'visible',
      timeout: 40000,
    });
    await this.page.waitForTimeout(500);
    const folders = this.page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node');
    const foldersCount = await folders.count();
    for (let i = 0; i < foldersCount; i++) {
      if (
        (await folders.nth(i).locator('div > div').first().textContent()).includes(
          folder.name
        )
      ) {
        await folders.nth(i).locator('div').first().click();
        await this.page.waitForTimeout(1000);
      }
    }
    for (let i = 0; i < users.length; i++) {
      const checkbox = this.page.locator(`#checkbox${users[i].siteId}`);
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.click();
      await this.page.waitForTimeout(500);
    }
    await this.myEformsPage.saveParingBtn().click();
    await this.page.waitForTimeout(1000);
  }

  async unPair(users: DeviceUsersRowObject[]) {
    await this.editPairEformBtn.click();
    await this.page.waitForTimeout(1000);
    await this.myEformsPage.cancelParingBtn().waitFor({
      state: 'visible',
      timeout: 40000,
    });
    for (let i = 0; i < users.length; i++) {
      const checkbox = this.page.locator(`#checkbox${users[i].siteId}`);
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.click();
      await this.page.waitForTimeout(1000);
    }
    await this.myEformsPage.saveParingBtn().click();
    await this.page.waitForTimeout(1000);
  }

  async goToVisualEditor() {
    await this.clickActionsMenu();
    await this.goVisualEditorBtn.click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#manageTags').waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(500);
  }
}
