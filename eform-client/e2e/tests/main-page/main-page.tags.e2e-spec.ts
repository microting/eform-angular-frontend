import {MainPage} from '../../Page objects/Main Page/MainPage';
import {goToMainPage} from '../../Helper methods/go-to-pages';
import {signOut, waitFor, waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';
import {getMainPageRowObject, MainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import data from '../../data';
import {browser, ElementArrayFinder, ElementFinder} from 'protractor';

const mainPage: MainPage = new MainPage();

describe('Main Page - EDIT, DELETE AND CREATE TAGS', function () {
  beforeAll(done => {
    goToMainPage();
    done();
  });
  afterAll(done => {
    signOut();
    done();
  });

  describe('POSITIVE: user', function () {
    afterEach(done => {
      browser.sleep(1000);
      done();
    });
    it('should not perform any changes by doing nothing and clicking "Save" in tag edit window', async function (done) {
      // Create new user
      waitTillVisibleAndClick(mainPage.newEformBtn);
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
      mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.firstTagForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      waitFor(mainPage.newEformBtn);
      // Check that tags remain the same
      const initFirstRowObj = await getMainPageRowObject(1);
      initFirstRowObj.tagEditBtn.click();
      waitTillVisibleAndClick(mainPage.editTagModal.saveBtn);
      browser.sleep(5000);
      const finalFirstRowObj = await getMainPageRowObject(1);
      expect(initFirstRowObj.tags).toEqual(finalFirstRowObj.tags);
      done();
    });
    it('should add already prepared tag to eform', async function (done) {
      // Creating new eform without tags
      waitTillVisibleAndClick(mainPage.newEformBtn);
      // mainPage.createEFormModal.chunkedEnterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      waitFor(mainPage.newEformBtn);
      // Checking that tag can be added
      const initFirstRowObj = await getMainPageRowObject(1);
      initFirstRowObj.tagEditBtn.click();
      waitTillVisibleAndClick(mainPage.editTagModal.templateTagsSelector);
      browser.sleep(2000);
      const tags: ElementFinder[] = (await mainPage.editTagModal.getTemplateTags());
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      const randomTagText = await randomTag.getText();
      randomTag.click();
      mainPage.editTagModal.saveBtn.click();
      const finalFirstRowObj = await getMainPageRowObject(1);
      expect(finalFirstRowObj.tags.indexOf(randomTagText) !== -1).toBeTruthy('Tag was not added');
      done();
    });
    it('should delete eForm tag from eform', async function (done) {
      // Create eform with 1 tag
      waitTillVisibleAndClick(mainPage.newEformBtn);
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
      mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.fifthTagForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      waitFor(mainPage.newEformBtn);
      // Check that tag is deleted
      const initFirstRowObj = await getMainPageRowObject(1);
      waitTillVisibleAndClick(initFirstRowObj.tagEditBtn);
      waitTillVisibleAndClick(mainPage.editTagModal.templateTagsSelector);
      const tags: ElementFinder[] = (await mainPage.editTagModal.getTemplateTags());
      const tagsTexts: string[] = [];
      for (let i = 0; i < tags.length; i++) {
        tagsTexts.push(await tags[i].getText());
      }
      const addedTagIndex = tagsTexts.indexOf(data.MainPage.fifthTagForAdding);
      const addedTag: ElementFinder = tags[addedTagIndex];
      addedTag.click();
      mainPage.editTagModal.saveBtn.click();
      waitFor(mainPage.newEformBtn);
      let finalFirstRowObj: MainPageRowObject;
      finalFirstRowObj = await getMainPageRowObject(1);
      expect(finalFirstRowObj.tags.indexOf(data.MainPage.fifthTagForAdding) === -1).toBeTruthy('Added tag was not deleted');
      done();
    });
    it('should delete tag from list', async function (done) {
      // Create eform with 1 tag
      waitFor(mainPage.newEformBtn);
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
      mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.firstTagForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      waitFor(mainPage.newEformBtn);
      // Check that tag is deleted
      const initFirstRowObj = await getMainPageRowObject(1);
      initFirstRowObj.tagEditBtn.click();
      waitTillVisibleAndClick(mainPage.editTagModal.tagListSelectorForDelete);
      const tags: ElementArrayFinder = mainPage.editTagModal.getTagsInTagList();
      const randomTag: ElementFinder = tags.get(Math.floor(Math.random() * await tags.count()));
      const randomTagText = (await randomTag.getText()).trim();
      randomTag.click();
      mainPage.editTagModal.deleteTagBtn.click();
      waitFor(mainPage.editTagModal.deleteTagBtn);

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
      done();
    });
    it('should create tag', async function (done) {
      // Create new user
      browser.sleep(3000);
      waitTillVisibleAndClick(mainPage.newEformBtn);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      waitFor(mainPage.newEformBtn);
      // Check that tag is created
      const initFirstRowObj = await getMainPageRowObject(1);
      initFirstRowObj.tagEditBtn.click();
      const randomNum: number = Math.floor(Math.random() * data.MainPage.auxiliaryNumberForReplacing);
      waitTillVisibleAndClick(mainPage.editTagModal.newTagInput);
      mainPage.editTagModal.newTagInput.sendKeys(randomNum);
      mainPage.editTagModal.saveNewTagBtn.click();
      waitFor(mainPage.editTagModal.saveNewTagBtn);
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
      done();
    });
  });
});
