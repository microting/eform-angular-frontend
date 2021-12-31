import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
import { applicationLanguages } from '../../../../src/app/common/const';

const expect = require('chai').expect;
const folderName = [
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
];

describe('Create folder', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await (await foldersPage.newFolderBtn()).waitForDisplayed({
      timeout: 40000,
    });
  });
  it('With name and with description', async () => {
    const description = generateRandmString();
    const rowCountBeforeCreation = await foldersPage.rowNum();
    await foldersPage.createNewFolder(folderName[0], description);
    const rowCountAfterCreation = await foldersPage.rowNum();
    expect(
      rowCountAfterCreation,
      `Number of rows hasn't changed after creating new folder`
    ).equal(rowCountBeforeCreation + 1);
    const folder = await foldersPage.getFolderByName(folderName[0]);
    expect(folder.name, 'Name of created user is incorrect').equal(
      folderName[0]
    );
    expect(
      (await folder.getDescription()).find((x) => x.language === 'Danish')
        .description,
      'Description of created folder is incorrect'
    ).equal(description);
  });
  // it('should not be created without description', async () => {
  //   const name = generateRandmString();
  //   foldersPage.openCreateFolder(name);
  //   expect(
  //     foldersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new folder is active when only name is provided'
  //   ).equal(false);
  //   foldersPage.closeCreateFolder(true);
  // });
  // it('should not be created without name', async () => {
  //   const description = generateRandmString();
  //   foldersPage.openCreateFolder(null, description);
  //   expect(
  //     foldersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new folder is active when only name is provided'
  //   ).equal(false);
  //   foldersPage.closeCreateFolder(true);
  // });
  // it('should not be created without name and description', async () => {
  //   foldersPage.openCreateFolder();
  //   expect(
  //     foldersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new folder is active when only name is provided'
  //   ).equal(false);
  //   foldersPage.closeCreateFolder(true);
  // });
  // it('should not be created if the description has only spaces', async () => {
  //   foldersPage.openCreateFolder(generateRandmString(), '    ');
  //   expect(
  //     foldersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new folder is active when only name is provided'
  //   ).equal(false);
  //   foldersPage.closeCreateFolder(true);
  // });
  // it('should not be created if the name has only spaces', async () => {
  //   foldersPage.openCreateFolder('    ', generateRandmString());
  //   expect(
  //     foldersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new folder is active when only name is provided'
  //   ).equal(false);
  //   foldersPage.closeCreateFolder(true);
  // });
  // it('should not be created if the name and description has only spaces', async () => {
  //   foldersPage.openCreateFolder('    ', '  ');
  //   expect(
  //     foldersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new folder is active when only name is provided'
  //   ).equal(false);
  //   foldersPage.closeCreateFolder(true);
  // });
  it('should not be created if cancel was clicked', async () => {
    const rowCountBeforeCreation = await foldersPage.rowNum();
    await foldersPage.createNewFolder(
      generateRandmString(),
      generateRandmString(),
      true
    );
    const rowCountAfterCreation = await foldersPage.rowNum();
    expect(
      rowCountAfterCreation,
      'Number of rows has changed after cancel'
    ).equal(rowCountBeforeCreation);
  });
  it('should create new folder with bold description', async () => {
    await foldersPage.openCreateFolder(folderName[1]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (
      await (await foldersPage.createLanguageSelector()).$('input')
    ).setValue(da.text);
    let value = await (await foldersPage.createLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).addValue(description);

    await browser.keys(['Control', 'KeyA', 'Control']);
    await (
      await foldersPage.createDescriptionInputPellBold(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[1]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).$('input')
    ).setValue(da.text);
    value = await (await foldersPage.editLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    await value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).getHTML(false);

    expect(html, 'save description incorrect').eq(
      `<div><b>${description}</b></div>`
    );
    await foldersRowObject.closeEditModal(true);
  });
  it('should create new folder with underline description', async () => {
    await foldersPage.openCreateFolder(folderName[2]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (await foldersPage.createLanguageSelector())
      .$('input')
      .setValue(da.text);
    let value = await (await foldersPage.createLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    await value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).addValue(description);

    await browser.keys(['Control', 'KeyA', 'Control']);
    await (
      await foldersPage.createDescriptionInputPellUnderline(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[2]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).$('input')
    ).setValue(da.text);
    value = await (await foldersPage.editLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    await value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).getHTML(false);

    expect(html, 'save description incorrect').eq(
      `<div><u>${description}</u></div>`
    );
    await foldersRowObject.closeEditModal(true);
  });
  it('should create new folder with italic description', async () => {
    await foldersPage.openCreateFolder(folderName[3]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (
      await (await foldersPage.createLanguageSelector()).$('input')
    ).setValue(da.text);
    let value = await (await foldersPage.createLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    await value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).addValue(description);

    await browser.keys(['Control', 'KeyA', 'Control']);
    await (
      await foldersPage.createDescriptionInputPellItalic(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[3]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).$('input')
    ).setValue(da.text);
    value = await (await foldersPage.editLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    await value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).getHTML(false);

    expect(html, 'save description incorrect').eq(
      `<div><i>${description}</i></div>`
    );
    await foldersRowObject.closeEditModal(true);
  });
  it('should create new folder with strike-through description', async () => {
    await foldersPage.openCreateFolder(folderName[4]);
    const description = generateRandmString();

    const da = applicationLanguages[0];
    await (
      await (await foldersPage.createLanguageSelector()).$('input')
    ).setValue(da.text);
    let value = await (await foldersPage.createLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    await value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    await (
      await foldersPage.createDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).addValue(description);

    await browser.keys(['Control', 'KeyA', 'Control']);
    await (
      await foldersPage.createDescriptionInputPellStrikeThrough(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).click();
    await foldersPage.closeCreateFolder();
    const foldersRowObject = await foldersPage.getFolderByName(folderName[4]);
    await foldersRowObject.openEditModal();

    await (
      await (await foldersPage.editLanguageSelector()).$('input')
    ).setValue(da.text);
    value = await (await foldersPage.editLanguageSelector()).$(
      `.ng-option=${da.text}`
    );
    await value.waitForDisplayed({ timeout: 40000 });
    await value.click();
    const html = await (
      await foldersPage.editDescriptionInput(
        applicationLanguages.findIndex((x) => x.text === da.text)
      )
    ).getHTML(false);

    expect(html, 'save description incorrect').eq(
      `<div><s>${description}</s></div>`
    );
    await foldersRowObject.closeEditModal(true);
  });
  after('should delete folders', async () => {
    const rowCountBeforeCreation = await foldersPage.rowNum();
    for (let i = 0; i < folderName.length; i++) {
      await (await foldersPage.getFolderByName(folderName[i])).delete();
    }
    const rowCountAfterCreation = await foldersPage.rowNum();
    expect(
      rowCountBeforeCreation - folderName.length,
      'Folder not delete'
    ).equal(rowCountAfterCreation);
  });
});
