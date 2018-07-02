import {goToMainPage} from '../../Helper methods/go-to-pages';
import {signOut, waitFor} from '../../Helper methods/other-helper-methods';
import {MainPage} from '../../Page objects/Main Page/MainPage';
import data from '../../data';
import {$, browser, ExpectedConditions} from 'protractor';
import {getMainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';

const mainPage = new MainPage();

describe('Main Page - CREATE', function () {
  describe('Positive: user', function () {
    beforeAll(async () => {
      await goToMainPage();
      await browser.waitForAngular();
    });
    afterAll(async () => {
      await signOut();
    });
    it('should create eform without any tags', async () => {
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.newEformBtn.click();
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const finalRowNum = await mainPage.getRowNumber();
      const awaitedTagArray = [''];
      expect(finalRowNum).toEqual(initRowNum + 1, 'EForm was not added');
      const firstRowObj = await getMainPageRowObject(1);
      expect(firstRowObj.tags).toEqual(awaitedTagArray, 'Tag list is not empty');
    });
    it('should create eform simultaneously with creating 1 tag', async () => {
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.newEformBtn.click();
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
      await  mainPage.createEFormModal.saveEFormBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const finalRowNum = await mainPage.getRowNumber();
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      const firstRowObj = await getMainPageRowObject(1);
      const awaitedTagArray = [data.MainPage.firstTagForAdding];
      expect(firstRowObj.tags).toEqual(awaitedTagArray, 'Tags are added not properly');
    });
    it('should create eform simultaneously with creating 2 and more tags', async () => {
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.newEformBtn.click();
      await browser.sleep(5000);
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
      const tagArrayForAdding = [data.MainPage.secondTagForAdding, data.MainPage.thirdTagForAdding];
      const stringWithTagsForAdding = tagArrayForAdding.join(',');
      await mainPage.createEFormModal.addTagInput.sendKeys(stringWithTagsForAdding);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const finalRowNum = await mainPage.getRowNumber();
      const rowObj = await getMainPageRowObject(1);
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      expect(rowObj.tags).toEqual(tagArrayForAdding, 'Tags were added incorrectly');
    });
    it('should create eform with creating 1 tag and using 1 already prepared tag', async () => {
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.newEformBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.createEFormModal.saveEFormBtn));
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
      await mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.thirdTagForAdding);
      await mainPage.createEFormModal.tagSelector.click();
      await mainPage.createEFormModal.selectTag(data.MainPage.firstTagForAdding);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const desiredTagArray = [data.MainPage.firstTagForAdding, data.MainPage.thirdTagForAdding];
      const finalRowNum = await mainPage.getRowNumber();
      const rowObj = await getMainPageRowObject(1);
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      expect((rowObj).tags).toEqual(desiredTagArray);
    });
    it('should create eform while adding 1 already prepared tag', async () => {
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.newEformBtn.click();
      await waitFor(mainPage.createEFormModal.saveEFormBtn);
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
      await mainPage.createEFormModal.tagSelector.click();
      await mainPage.createEFormModal.selectTag(data.MainPage.firstTagForAdding);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const desiredTagArray = [data.MainPage.firstTagForAdding];
      const finalRowNum = await mainPage.getRowNumber();
      const rowObj = await getMainPageRowObject(1);
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      expect(rowObj.tags).toEqual(desiredTagArray);
    });
    it('should create eform while adding more than 2 already prepared tags', async () => {
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.newEformBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.createEFormModal.saveEFormBtn));
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await mainPage.createEFormModal.closeTagInputBtn.click();
      } catch (e) {

      }
      await mainPage.createEFormModal.tagSelector.click();
      await mainPage.createEFormModal.selectTag(data.MainPage.firstTagForAdding);
      await mainPage.createEFormModal.selectTag(data.MainPage.secondTagForAdding);
      await mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const desiredTagArray = [data.MainPage.firstTagForAdding, data.MainPage.secondTagForAdding];
      const finalRowNum = await mainPage.getRowNumber();
      const rowObj = await getMainPageRowObject(1);
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      expect(rowObj.tags).toEqual(desiredTagArray);
    });
  });
  describe('Negative: user ', function () {
    beforeAll(async () => {
      await goToMainPage();
    });
    afterAll(async () => {
      await signOut();
    });
    it('should not create eform if xml is empty', async () => {
      await browser.waitForAngular();
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.newEformBtn.click();
      await waitFor(mainPage.createEFormModal.cancelBtn);
      await mainPage.createEFormModal.saveEFormBtn.click();
      await waitFor(mainPage.newEformBtn);
      const finalRowNum = await mainPage.getRowNumber();
      expect(finalRowNum).toEqual(initRowNum);
      await browser.waitForAngular();
    });
  });
});
