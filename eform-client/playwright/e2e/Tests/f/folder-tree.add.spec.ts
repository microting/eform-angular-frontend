import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { FoldersPage, FoldersRowObject } from '../../Page objects/Folders.page';
import { generateRandmString } from '../../helper-functions';
import { applicationLanguages } from '../../../src/app/common/const';

const folderName = [
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
];
let page;

test.describe('Create folder', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const foldersPage = new FoldersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await (await foldersPage.newFolderBtn()).waitFor({ state: 'visible', timeout: 40000 });
  });

  test.afterAll(async () => {
    const loginPage = new LoginPage(page);
    const foldersPage = new FoldersPage(page);
    await page.waitForTimeout(1500);
    for (let i = 0; i < 5; i++) {
      const folderObj = new FoldersRowObject(page);
      const folder = await folderObj.getRow(1);
      await folder.delete();
      await loginPage.waitForSpinnerHide();
      await page.waitForTimeout(500);
    }
    await page.close();
  });

  test('With name and with description', async () => {
    const foldersPage = new FoldersPage(page);
    const description = generateRandmString();
    const rowCountBeforeCreation = await foldersPage.rowNum();
    await foldersPage.createNewFolder(folderName[0], description);
    const rowCountAfterCreation = await foldersPage.rowNum();
    expect(rowCountAfterCreation).toBe(rowCountBeforeCreation + 1);
    const folder = await foldersPage.getFolderByName(folderName[0]);
    expect(folder.name).toBe(folderName[0]);
    expect(
      (await folder.getDescription()).find((x) => x.language === 'Dansk')
        .description
    ).toBe(description);
  });

  test('should not be created if cancel was clicked', async () => {
    const foldersPage = new FoldersPage(page);
    const rowCountBeforeCreation = await foldersPage.rowNum();
    await foldersPage.createNewFolder(
      generateRandmString(),
      generateRandmString(),
      true
    );
    const rowCountAfterCreation = await foldersPage.rowNum();
    expect(rowCountAfterCreation).toBe(rowCountBeforeCreation);
  });

  test('should create new folder with bold description', async () => {
    const foldersPage = new FoldersPage(page);
    await foldersPage.openCreateFolder(folderName[1]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (
      await (await foldersPage.createLanguageSelector()).locator('input')
    ).fill(da.text);
    let value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).fill(description);

    await page.keyboard.press('Control+a');
    await (
      await foldersPage.createDescriptionInputPellBold(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[1]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).locator('input')
    ).fill(da.text);
    value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).innerHTML();

    expect(html).toBe(`<div>\n  <b>${description}</b>\n</div>`);
    await foldersRowObject.closeEditModal(true);
  });

  test('should create new folder with underline description', async () => {
    const foldersPage = new FoldersPage(page);
    await foldersPage.openCreateFolder(folderName[2]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (await foldersPage.createLanguageSelector()).locator('input').fill(da.text);
    let value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).fill(description);

    await page.keyboard.press('Control+a');
    await (
      await foldersPage.createDescriptionInputPellUnderline(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[2]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).locator('input')
    ).fill(da.text);
    value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).innerHTML();

    expect(html).toBe(`<div>\n  <u>${description}</u>\n</div>`);
    await foldersRowObject.closeEditModal(true);
  });

  test('should create new folder with italic description', async () => {
    const foldersPage = new FoldersPage(page);
    await foldersPage.openCreateFolder(folderName[3]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (
      await (await foldersPage.createLanguageSelector()).locator('input')
    ).fill(da.text);
    let value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).fill(description);

    await page.keyboard.press('Control+a');
    await (
      await foldersPage.createDescriptionInputPellItalic(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[3]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).locator('input')
    ).fill(da.text);
    value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).innerHTML();

    expect(html).toBe(`<div>\n  <i>${description}</i>\n</div>`);
    await foldersRowObject.closeEditModal(true);
  });

  test('should create new folder with strike-through description', async () => {
    const foldersPage = new FoldersPage(page);
    await foldersPage.openCreateFolder(folderName[4]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (
      await (await foldersPage.createLanguageSelector()).locator('input')
    ).fill(da.text);
    let value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).fill(description);

    await page.keyboard.press('Control+a');
    await (
      await foldersPage.createDescriptionInputPellStrikeThrough(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[4]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).locator('input')
    ).fill(da.text);
    value = page.locator('ng-dropdown-panel').locator(`.ng-option=${da.text}`);
    await value.waitFor({ state: 'visible', timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).innerHTML();

    expect(html).toBe(`<div>\n  <s>${description}</s>\n</div>`);
    await foldersRowObject.closeEditModal(true);
  });
});
