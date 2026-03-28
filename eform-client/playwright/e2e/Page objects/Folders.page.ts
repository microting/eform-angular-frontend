import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';
import { applicationLanguagesTranslated } from '../../../src/app/common/const';
import { selectValueInNgSelector } from '../helper-functions';

export class FoldersPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public newFolderBtn(): Locator {
    return this.page.locator('#newFolderBtn');
  }

  public createNameInput(translationIndex: number): Locator {
    return this.page.locator(`#createFolderNameTranslation_${translationIndex}`);
  }

  public createDescription(translationIndex: number): Locator {
    return this.page.locator(`#createFolderDescriptionTranslation_${translationIndex}`);
  }

  public createDescriptionInput(translationIndex: number): Locator {
    return this.createDescription(translationIndex).locator('.NgxEditor__Content');
  }

  public createDescriptionInputPellBold(translationIndex: number): Locator {
    return this.createDescription(translationIndex).locator('button[title="Bold"]');
  }

  public createDescriptionInputPellUnderline(translationIndex: number): Locator {
    return this.createDescription(translationIndex).locator('button[title="Underline"]');
  }

  public createDescriptionInputPellItalic(translationIndex: number): Locator {
    return this.createDescription(translationIndex).locator('button[title="Italic"]');
  }

  public createDescriptionInputPellStrikeThrough(translationIndex: number): Locator {
    return this.createDescription(translationIndex).locator('button[title="Strike"]');
  }

  public editDescriptionInputPellBold(translationIndex: number): Locator {
    return this.editDescription(translationIndex).locator('button[title="Bold"]');
  }

  public editDescriptionInputPellUnderline(translationIndex: number): Locator {
    return this.editDescription(translationIndex).locator('button[title="Underline"]');
  }

  public editDescriptionInputPellItalic(translationIndex: number): Locator {
    return this.editDescription(translationIndex).locator('button[title="Italic"]');
  }

  public editDescriptionInputPellStrikeThrough(translationIndex: number): Locator {
    return this.editDescription(translationIndex).locator('button[title="Strike"]');
  }

  public saveCreateBtn(): Locator {
    return this.page.locator('#folderSaveBtn');
  }

  public cancelCreateBtn(): Locator {
    return this.page.locator('#cancelCreateBtn');
  }

  public saveDeleteBtn(): Locator {
    return this.page.locator('#saveDeleteBtn');
  }

  public cancelDeleteBtn(): Locator {
    return this.page.locator('#cancelDeleteBtn');
  }

  public editNameInput(translationIndex: number): Locator {
    return this.page.locator(`#editFolderNameTranslation_${translationIndex}`);
  }

  public editDescription(translationIndex: number): Locator {
    return this.page.locator(`#editFolderDescriptionTranslation_${translationIndex}`);
  }

  public editDescriptionInput(translationIndex: number): Locator {
    return this.editDescription(translationIndex).locator('.NgxEditor__Content');
  }

  public createLanguageSelector(): Locator {
    return this.page.locator('#createLanguageSelector');
  }

  public saveEditBtn(): Locator {
    return this.page.locator('#saveEditBtn');
  }

  public cancelEditBtn(): Locator {
    return this.page.locator('#cancelEditBtn');
  }

  public async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    if ((await this.page.locator('.microting-uid').count()) === 0) {
      await this.page.waitForTimeout(500);
    }
    return await this.page.locator('.microting-uid').count();
  }

  public async rowNumParents(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('mat-tree > mat-tree-node > div > small').count();
  }

  public async rowChildrenNum(): Promise<number> {
    return await this.page.locator('mat-tree > mat-tree-node > small').count();
  }

  public editLanguageSelector(): Locator {
    return this.page.locator('#createLanguageSelector');
  }

  async getFolder(num: number): Promise<FoldersRowObject> {
    const folderObj = new FoldersRowObject(this.page, this);
    return await folderObj.getRow(num);
  }

  async getFolderByName(nameFolder: string): Promise<FoldersRowObject | null> {
    await this.page.waitForTimeout(500);
    for (let i = 1; i < (await this.rowNum()) + 1; i++) {
      const folderObj = new FoldersRowObject(this.page, this);
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
      const folderObj = new FoldersRowObject(this.page, this);
      const folder = await folderObj.getRow(i);
      if (folder.name === nameFolder) {
        return i;
      }
    }
    return -1;
  }

  async getFolderFromTree(numParent: number, numChild: number): Promise<FoldersTreeRowObject> {
    const obj = new FoldersTreeRowObject(this.page, this);
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
    await this.newFolderBtn().click();
    await this.page.waitForTimeout(500);
    await this.cancelCreateBtn().waitFor({ state: 'visible', timeout: 10000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguagesTranslated[0];
        await selectValueInNgSelector(this.page, '#createLanguageSelector', da.text);
        await this.page.waitForTimeout(500);
        await this.createNameInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(nameConverted);
        await this.page.waitForTimeout(500);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await selectValueInNgSelector(this.page, '#createLanguageSelector', language!.text);
          await this.page.waitForTimeout(500);
          await this.createNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(nameConverted[i].name);
          await this.page.waitForTimeout(500);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];
        await selectValueInNgSelector(this.page, '#createLanguageSelector', da.text);
        await this.page.waitForTimeout(500);
        await this.createDescriptionInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(descriptionConvert);
        await this.page.waitForTimeout(500);
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
          await selectValueInNgSelector(this.page, '#createLanguageSelector', language!.text);
          await this.page.waitForTimeout(500);
          await this.createDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(descriptionConvert[i].description);
          await this.page.waitForTimeout(500);
        }
      }
    }
  }

  async closeCreateFolder(clickCancel = false) {
    if (!clickCancel) {
      await this.saveCreateBtn().waitFor({ state: 'visible', timeout: 40000 });
      await this.saveCreateBtn().click();
    } else {
      await this.cancelCreateBtn().click();
    }
    await this.waitForSpinnerHide();
    await this.newFolderBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(1500);
  }
}

export class FoldersRowObject {
  constructor(page: Page, foldersPage: FoldersPage) {
    this.page = page;
    this.foldersPage = foldersPage;
  }

  page: Page;
  foldersPage: FoldersPage;
  folderElement: Locator;
  name: string;
  folderTreeOpenClose: Locator;
  rowNumber: number;
  dropdown: Locator;

  async getRow(rowNum: number): Promise<FoldersRowObject> {
    this.rowNumber = rowNum;
    const elements = this.page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node');
    if ((await elements.count()) >= rowNum) {
      const element = elements.nth(rowNum - 1);
      try {
        this.folderElement = element.locator('.microting-uid');
      } catch (e) {
      }
      this.dropdown = element.locator('button.mat-mdc-menu-trigger');
      try {
        this.name = await element.locator('div > div').textContent() || '';
      } catch (e) {
      }
      this.folderTreeOpenClose = element.locator('mat-tree-node');
    }
    return this;
  }

  async getDescription(): Promise<{ description: string; language: string }[]> {
    await this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguagesTranslated.length; i++) {
      const language = applicationLanguagesTranslated[i];
      await this.foldersPage.editLanguageSelector().locator('input').fill(language.text);
      await this.page.waitForTimeout(500);
      const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language.text}`);
      await value.waitFor({ state: 'visible', timeout: 40000 });
      await value.click();
      await this.page.waitForTimeout(500);
      descriptions.push({
        description: await this.foldersPage.editDescriptionInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
        ).textContent() || '',
        language: language.text,
      });
    }
    await this.foldersPage.cancelEditBtn().click();
    await this.page.waitForTimeout(500);
    return descriptions;
  }

  async createChild(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    if (!(await this.page.locator('#createFolderChildBtn').isVisible())) {
      await this.dropdown.click();
      await this.page.locator('#createFolderChildBtn').waitFor({ state: 'visible', timeout: 40000 });
      await this.getRow(this.rowNumber);
    }
    await this.page.locator('#createFolderChildBtn').click();
    await this.foldersPage.cancelCreateBtn().waitFor({ state: 'visible', timeout: 10000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguagesTranslated[0];
        await this.foldersPage.createLanguageSelector().locator('input').fill(da.text);
        await this.page.waitForTimeout(500);
        const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
        await value.waitFor({ state: 'visible', timeout: 40000 });
        await value.click();
        await this.page.waitForTimeout(500);
        await this.foldersPage.createNameInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(nameConverted);
        await this.page.waitForTimeout(500);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await this.foldersPage.createLanguageSelector().locator('input').fill(language!.text);
          await this.page.waitForTimeout(500);
          const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language!.text}`);
          await value.waitFor({ state: 'visible', timeout: 40000 });
          await value.click();
          await this.page.waitForTimeout(500);
          await this.foldersPage.createNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(nameConverted[i].name);
          await this.page.waitForTimeout(500);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];
        await this.foldersPage.createLanguageSelector().locator('input').fill(da.text);
        await this.page.waitForTimeout(500);
        const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
        await value.waitFor({ state: 'visible', timeout: 40000 });
        await value.click();
        await this.page.waitForTimeout(500);
        await this.foldersPage.createDescriptionInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(descriptionConvert);
        await this.page.waitForTimeout(500);
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
          await this.foldersPage.createLanguageSelector().locator('input').fill(language!.text);
          await this.page.waitForTimeout(500);
          const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language!.text}`);
          await value.waitFor({ state: 'visible', timeout: 40000 });
          await value.click();
          await this.page.waitForTimeout(500);
          await this.foldersPage.createDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(descriptionConvert[i].description);
          await this.page.waitForTimeout(500);
        }
      }
    }
    if (!clickCancel) {
      await this.foldersPage.saveCreateBtn().click();
    } else {
      await this.foldersPage.cancelCreateBtn().click();
    }
    await this.foldersPage.newFolderBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async delete(clickCancel = false) {
    if (!(await this.page.locator('#deleteFolderTreeBtn').isVisible())) {
      if (!this.dropdown) return;
      await this.dropdown.click();
      await this.page.locator('#deleteFolderTreeBtn').waitFor({ state: 'visible', timeout: 40000 });
    }
    await this.page.locator('#deleteFolderTreeBtn').click();
    if (!clickCancel) {
      await this.foldersPage.saveDeleteBtn().waitFor({ state: 'visible', timeout: 40000 });
      await this.foldersPage.saveDeleteBtn().click();
    } else {
      await this.foldersPage.cancelDeleteBtn().click();
    }
    await this.foldersPage.waitForSpinnerHide();
    await this.foldersPage.newFolderBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async openEditModal() {
    if (!(await this.page.locator('#createFolderChildBtn').isVisible())) {
      await this.dropdown.click();
      await this.page.locator('#createFolderChildBtn').waitFor({ state: 'visible', timeout: 40000 });
    }
    await this.page.locator('#editFolderTreeBtn').click();
    await this.foldersPage.cancelEditBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async editFolder(
    name?: string | { name: string; language: string }[],
    description?: string | { description: string; language: string }[],
    clickCancel = false
  ) {
    await this.openEditModal();
    await this.foldersPage.cancelEditBtn().waitFor({ state: 'visible', timeout: 40000 });
    if (name) {
      if (typeof name === typeof '') {
        const nameConverted = name as string;
        const da = applicationLanguagesTranslated[0];
        await this.foldersPage.editLanguageSelector().locator('input').fill(da.text);
        const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
        await value.waitFor({ state: 'visible', timeout: 40000 });
        await value.click();
        await this.foldersPage.editNameInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(nameConverted);
        await this.page.waitForTimeout(500);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await this.foldersPage.editLanguageSelector().locator('input').fill(language!.text);
          const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language!.text}`);
          await value.waitFor({ state: 'visible', timeout: 40000 });
          await value.click();
          await this.foldersPage.editNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(nameConverted[i].name);
          await this.page.waitForTimeout(500);
        }
      }
    }
    if (description) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];
        await this.foldersPage.editLanguageSelector().locator('input').fill(da.text);
        const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
        await value.waitFor({ state: 'visible', timeout: 40000 });
        await value.click();
        await this.foldersPage.editDescriptionInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(descriptionConvert);
        await this.page.waitForTimeout(500);
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
          await this.foldersPage.editLanguageSelector().locator('input').fill(language!.text);
          const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language!.text}`);
          await value.waitFor({ state: 'visible', timeout: 40000 });
          await value.click();
          await this.foldersPage.editDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(descriptionConvert[i].description);
          await this.page.waitForTimeout(500);
        }
      }
    }
    await this.closeEditModal(clickCancel);
  }

  async closeEditModal(clickCancel = false) {
    if (!clickCancel) {
      await this.foldersPage.saveEditBtn().click();
    } else {
      await this.foldersPage.cancelEditBtn().click();
    }
    await this.foldersPage.newFolderBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async collapseChildren() {
    if ((await this.folderTreeOpenClose.locator('fa-icon[icon="folder-open"]').count()) > 0) {
      await this.folderTreeOpenClose.click();
    }
  }

  async expandChildren() {
    if ((await this.page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node[aria-expanded="false"]').count()) > 0) {
      await this.page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node[aria-expanded="false"] > button').click();
    }
    await this.page.waitForTimeout(1000);
  }
}

export class FoldersTreeRowObject {
  constructor(page: Page, foldersPage: FoldersPage) {
    this.page = page;
    this.foldersPage = foldersPage;
  }

  page: Page;
  foldersPage: FoldersPage;
  folderTreeElement: Locator;
  nameTree: string;
  dropdown: Locator;

  async getRow(
    rowNumFolderParent: number,
    rowNumberFolderChildren: number
  ): Promise<FoldersTreeRowObject> {
    const elements = this.page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node.children');
    if ((await elements.count()) >= rowNumberFolderChildren) {
      const element = elements.nth(rowNumberFolderChildren - 1);
      this.dropdown = element.locator('div > button');
      try {
        this.folderTreeElement = element.locator('#folderTreeId');
      } catch (e) {}
      try {
        this.nameTree = await element.locator('.folder-tree-name').textContent() || '';
      } catch (e) {}
    }
    return this;
  }

  async getDescription(): Promise<{ description: string; language: string }[]> {
    await this.openEditModal();
    const descriptions = new Array<{ description: string; language: string }>();

    for (let i = 0; i < applicationLanguagesTranslated.length; i++) {
      const language = applicationLanguagesTranslated[i];
      await this.foldersPage.editLanguageSelector().locator('input').fill(language.text);
      const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language.text}`);
      await value.waitFor({ state: 'visible', timeout: 40000 });
      await value.click();
      descriptions.push({
        description: await this.foldersPage.editDescriptionInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === language.text)
        ).textContent() || '',
        language: language.text,
      });
    }
    await this.foldersPage.cancelEditBtn().click();
    return descriptions;
  }

  async delete(clickCancel = false) {
    if (!(await this.page.locator('#deleteFolderTreeBtn').isVisible())) {
      if (!this.dropdown) return;
      await this.dropdown.click();
      await this.page.waitForTimeout(500);
      await this.page.locator('#deleteFolderTreeBtn').waitFor({ state: 'visible', timeout: 40000 });
    }
    await this.page.locator('#deleteFolderTreeBtn').click();
    if (!clickCancel) {
      await this.foldersPage.saveDeleteBtn().waitFor({ state: 'visible', timeout: 40000 });
      await this.foldersPage.saveDeleteBtn().click();
      await this.page.waitForTimeout(500);
    } else {
      await this.foldersPage.cancelDeleteBtn().waitFor({ state: 'visible', timeout: 40000 });
      await this.foldersPage.cancelDeleteBtn().click();
      await this.page.waitForTimeout(500);
    }
    await this.foldersPage.newFolderBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async openEditModal() {
    if (!(await this.page.locator('#editFolderTreeBtn').isVisible())) {
      await this.dropdown.click();
      await this.page.waitForTimeout(500);
      await this.page.locator('#editFolderTreeBtn').waitFor({ state: 'visible', timeout: 40000 });
    }
    await this.page.locator('#editFolderTreeBtn').click();
    await this.page.waitForTimeout(500);
    await this.foldersPage.saveEditBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(500);
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
        await this.foldersPage.editLanguageSelector().locator('input').fill(da.text);
        await this.page.waitForTimeout(500);
        const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
        await value.waitFor({ state: 'visible', timeout: 40000 });
        await value.click();
        await this.page.waitForTimeout(500);
        await this.foldersPage.editNameInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(nameConverted);
      }
      if (typeof name === typeof []) {
        const nameConverted = name as { name: string; language: string }[];
        for (let i = 0; i > nameConverted.length; i++) {
          const language = applicationLanguagesTranslated.find(
            (x) => x.text === nameConverted[i].language
          );
          await this.foldersPage.editLanguageSelector().locator('input').fill(language!.text);
          await this.page.waitForTimeout(500);
          const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language!.text}`);
          await value.waitFor({ state: 'visible', timeout: 40000 });
          await value.click();
          await this.page.waitForTimeout(500);
          await this.foldersPage.editNameInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(nameConverted[i].name);
        }
      }
    }
    if (description != null) {
      if (typeof description === typeof '') {
        const descriptionConvert = description as string;
        const da = applicationLanguagesTranslated[0];
        await this.foldersPage.editLanguageSelector().locator('input').fill(da.text);
        await this.page.waitForTimeout(500);
        const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
        await value.waitFor({ state: 'visible', timeout: 40000 });
        await value.click();
        await this.page.waitForTimeout(500);
        await this.foldersPage.editDescriptionInput(
          applicationLanguagesTranslated.findIndex((x) => x.text === da.text)
        ).fill(descriptionConvert);
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
          await this.foldersPage.editLanguageSelector().locator('input').fill(language!.text);
          await this.page.waitForTimeout(500);
          const value = this.page.locator('ng-dropdown-panel').locator(`.ng-option=${language!.text}`);
          await value.waitFor({ state: 'visible', timeout: 40000 });
          await value.click();
          await this.page.waitForTimeout(500);
          await this.foldersPage.editDescriptionInput(
            applicationLanguagesTranslated.findIndex((x) => x.text === language!.text)
          ).fill(descriptionConvert[i].description);
        }
      }
    }
    if (!clickCancel) {
      await this.foldersPage.saveEditBtn().click();
    } else {
      await this.foldersPage.cancelEditBtn().click();
    }
    await this.foldersPage.newFolderBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(500);
  }
}
