import {MainPage} from '../../Page objects/Main Page/MainPage';
import {goToMainPage} from '../../Helper methods/go-to-pages';
import {signOut, waitFor, waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';
import {getMainPageRowObject, MainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import data from '../../data';
import {browser, ElementArrayFinder, ElementFinder} from 'protractor';

const mainPage: MainPage = new MainPage();

describe('Main Page - EDIT, DELETE AND CREATE TAGS', function () {
  beforeAll(async () => {
    await goToMainPage();
  });
  afterAll(async () => {
    await signOut();
  });

  describe('POSITIVE: user', function () {
    afterEach(async () => {
      await browser.sleep(1000);
    });
    it('should not perform any changes by doing nothing and clicking "Save" in tag edit window', async  () => {
      // Create new user
      await waitTillVisibleAndClick(mainPage.newEformBtn);
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await waitFor(mainPage.createEFormModal.closeTagInputBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.closeTagInputBtn.click();
        await browser.sleep(1500);
        await waitFor(mainPage.createEFormModal.addTagBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.addTagBtn.click();
      } catch (e) {
        await waitFor(mainPage.createEFormModal.addTagBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.addTagBtn.click();
        await browser.sleep(1500);
      }
      await mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.firstTagForAdding);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await waitFor(mainPage.newEformBtn);
      // Check that tags remain the same
      const initFirstRowObj = await getMainPageRowObject(1);
      await initFirstRowObj.tagEditBtn.click();
      await waitTillVisibleAndClick(mainPage.editTagModal.saveBtn);
      await browser.sleep(5000);
      const finalFirstRowObj = await getMainPageRowObject(1);
      expect(initFirstRowObj.tags).toEqual(finalFirstRowObj.tags);
    });
    it('should add already prepared tag to eform', async  () => {
      // Creating new eform without tags
      await waitTillVisibleAndClick(mainPage.newEformBtn);
      // mainPage.createEFormModal.chunkedEnterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await waitFor(mainPage.newEformBtn);
      // Checking that tag can be added
      const initFirstRowObj = await getMainPageRowObject(1);
      await initFirstRowObj.tagEditBtn.click();
      await waitTillVisibleAndClick(mainPage.editTagModal.templateTagsSelector);
      await browser.sleep(2000);
      const tags: ElementFinder[] = (await mainPage.editTagModal.getTemplateTags());
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      const randomTagText = await randomTag.getText();
      await randomTag.click();
      await mainPage.editTagModal.saveBtn.click();
      await browser.sleep(4000);
      const finalFirstRowObj = await getMainPageRowObject(1);
      expect(finalFirstRowObj.tags.indexOf(randomTagText) !== -1).toBeTruthy('Tag was not added');
    });
    it('should delete eForm tag from eform', async  () => {
      // Create eform with 1 tag
      await waitTillVisibleAndClick(mainPage.newEformBtn);
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await waitFor(mainPage.createEFormModal.closeTagInputBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.closeTagInputBtn.click();
        await browser.sleep(1500);
        await waitFor(mainPage.createEFormModal.addTagBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.addTagBtn.click();
      } catch (e) {
        await waitFor(mainPage.createEFormModal.addTagBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.addTagBtn.click();
        await browser.sleep(1500);
      }
      await mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.fifthTagForAdding);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await waitFor(mainPage.newEformBtn);
      // Check that tag is deleted
      const initFirstRowObj = await getMainPageRowObject(1);
      await waitTillVisibleAndClick(initFirstRowObj.tagEditBtn);
      await waitTillVisibleAndClick(mainPage.editTagModal.templateTagsSelector);
      const tags: ElementFinder[] = (await mainPage.editTagModal.getTemplateTags());
      const tagsTexts: string[] = [];
      for (let i = 0; i < tags.length; i++) {
        tagsTexts.push(await tags[i].getText());
      }
      const addedTagIndex = tagsTexts.indexOf(data.MainPage.fifthTagForAdding);
      const addedTag: ElementFinder = tags[addedTagIndex];
      await addedTag.click();
      await mainPage.editTagModal.saveBtn.click();
      await waitFor(mainPage.newEformBtn);
      let finalFirstRowObj: MainPageRowObject;
      finalFirstRowObj = await getMainPageRowObject(1);
      expect(finalFirstRowObj.tags.indexOf(data.MainPage.fifthTagForAdding) === -1).toBeTruthy('Added tag was not deleted');
    });
    it('should delete tag from list', async () => {
      // Create eform with 1 tag
      await waitFor(mainPage.newEformBtn);
      mainPage.newEformBtn.click();
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await waitFor(mainPage.createEFormModal.closeTagInputBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.closeTagInputBtn.click();
        await browser.sleep(1500);
        await waitFor(mainPage.createEFormModal.addTagBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.addTagBtn.click();
      } catch (e) {
        await waitFor(mainPage.createEFormModal.addTagBtn);
        await browser.sleep(1500);
        await mainPage.createEFormModal.addTagBtn.click();
        await browser.sleep(1500);
      }
      await mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.firstTagForAdding);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await waitFor(mainPage.newEformBtn);
      // Check that tag is deleted
      const initFirstRowObj = await getMainPageRowObject(1);
      await initFirstRowObj.tagEditBtn.click();
      await waitTillVisibleAndClick(mainPage.editTagModal.tagListSelectorForDelete);
      const tags: ElementArrayFinder = mainPage.editTagModal.getTagsInTagList();
      const randomTag: ElementFinder = tags.get(Math.floor(Math.random() * await tags.count()));
      const randomTagText = (await randomTag.getText()).trim();
      await randomTag.click();
      await mainPage.editTagModal.deleteTagBtn.click();
      await waitFor(mainPage.editTagModal.deleteTagBtn);

      const newTags: ElementArrayFinder = mainPage.editTagModal.getTagsInTagList();
      const newTagsTexts: string[] = [];
      for (let i = 0; i < await newTags.count(); i++) {
        let tag = newTags.get(i);
        let tagText = (await tag.getText()).trim();
        newTagsTexts.push(tagText);
      }
      const randomTagIsDeleted: boolean = newTagsTexts.every(item => item !== randomTagText);
      expect(randomTagIsDeleted).toBeTruthy('Tag can\'t be deleted!');
      mainPage.editTagModal.saveBtn.click();
    });
    it('should create tag', async  () => {
      // Create new user
      await browser.sleep(3000);
      await waitTillVisibleAndClick(mainPage.newEformBtn);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await waitFor(mainPage.newEformBtn);
      // Check that tag is created
      const initFirstRowObj = await getMainPageRowObject(1);
      await initFirstRowObj.tagEditBtn.click();
      const randomNum: number = Math.floor(Math.random() * data.MainPage.auxiliaryNumberForReplacing);
      await waitTillVisibleAndClick(mainPage.editTagModal.newTagInput);
      await mainPage.editTagModal.newTagInput.sendKeys(randomNum);
      await mainPage.editTagModal.saveNewTagBtn.click();
      await waitFor(mainPage.editTagModal.saveNewTagBtn);
      const tags: ElementArrayFinder = mainPage.editTagModal.getTagsInTagList();
      const tagsTextArr: string[] = [];
      for (let i = 0; i < await tags.count(); i++) {
        tagsTextArr.push((await tags.get(i).getText()).trim());
      }
      const tagIsAdded: boolean = tagsTextArr.some(tagText => tagText === randomNum.toString());
      expect(tagIsAdded).toBeTruthy('Tag is not created');
      const finalFirstRowObj = await getMainPageRowObject(1);
      expect(finalFirstRowObj.tags.filter(tagText => tagText === randomNum.toString()).length === 0)
        .toBeTruthy('Initial tag array of the first row has changed');
      mainPage.editTagModal.saveBtn.click();
    });
  });
});
