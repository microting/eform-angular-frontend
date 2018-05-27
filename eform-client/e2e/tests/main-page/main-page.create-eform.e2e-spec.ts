import {goToMainPage} from '../../Helper methods/go-to-pages';
import {signOut, waitFor} from '../../Helper methods/other-helper-methods';
import {MainPage} from '../../Page objects/Main Page/MainPage';
import data from '../../data';
import {$, browser, by, element, ExpectedConditions} from 'protractor';
import {getMainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';

const mainPage = new MainPage();

describe('Main Page - CREATE', function () {

  beforeAll(done => {
    goToMainPage();
    done();
  });

  afterAll(done => {
    signOut();
    done();
  });

  describe('Positive: user', function () {

    it('should create eform without any tags', async function (done) {
      const initRowNum = await mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const finalRowNum = await mainPage.getRowNumber();
      const awaitedTagArray = [''];
      expect(finalRowNum).toEqual(initRowNum + 1);
      const firstRowObj = await getMainPageRowObject(1);
      expect(firstRowObj.tags).toEqual(awaitedTagArray);
      done();
    });
    it('should create eform simultaneously with creating 1 tag', async function (done) {
      const initRowNum = await mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await mainPage.createEFormModal.closeTagInputBtn.click();
        await mainPage.createEFormModal.addTagBtn.click();
      } catch (e) {
        await mainPage.createEFormModal.addTagBtn.click();
      }
      mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.firstTagForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const finalRowNum = await mainPage.getRowNumber();
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      const firstRowObj = await getMainPageRowObject(1);
      const awaitedTagArray = [data.MainPage.firstTagForAdding];
      expect(firstRowObj.tags).toEqual(awaitedTagArray);
      done();
    });
    it('should create eform simultaneously with creating 2 and more tags', async function (done) {
      const initRowNum = await mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      browser.sleep(5000);
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await mainPage.createEFormModal.closeTagInputBtn.click();
        await mainPage.createEFormModal.addTagBtn.click();
      } catch (e) {
        await mainPage.createEFormModal.addTagBtn.click();
      }
      const tagArrayForAdding = [data.MainPage.secondTagForAdding, data.MainPage.thirdTagForAdding];
      const stringWithTagsForAdding = tagArrayForAdding.join(',');
      mainPage.createEFormModal.addTagInput.sendKeys(stringWithTagsForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const finalRowNum = await mainPage.getRowNumber();
      const rowObj = await
        getMainPageRowObject(1);
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      expect(rowObj.tags).toEqual(tagArrayForAdding, 'Tags were added incorrectly');
      done();
    });
    it('should create eform with creating 1 tag and using 1 already prepared tag', async function (done) {
      const initRowNum = mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.createEFormModal.saveEFormBtn));
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await mainPage.createEFormModal.closeTagInputBtn.click();
        await mainPage.createEFormModal.addTagBtn.click();
      } catch (e) {
        await mainPage.createEFormModal.addTagBtn.click();
      }
      mainPage.createEFormModal.addTagInput.sendKeys(data.MainPage.thirdTagForAdding);
      mainPage.createEFormModal.tagSelector.click();
      mainPage.createEFormModal.selectTag(data.MainPage.firstTagForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const desiredTagArray = [data.MainPage.firstTagForAdding, data.MainPage.thirdTagForAdding];
      const finalRowNum = mainPage.getRowNumber();
      const rowObj = getMainPageRowObject(1);
      expect(await finalRowNum).toEqual(await initRowNum + 1, 'Row was not added!');
      expect((await rowObj).tags).toEqual(desiredTagArray);
      done();
    });
    it('should create eform while adding 1 already prepared tag', async function (done) {
      const initRowNum = await mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      waitFor(mainPage.createEFormModal.saveEFormBtn);
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await mainPage.createEFormModal.closeTagInputBtn.click();
      } catch (e) {

      }
      mainPage.createEFormModal.tagSelector.click();
      mainPage.createEFormModal.selectTag(data.MainPage.firstTagForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const desiredTagArray = [data.MainPage.firstTagForAdding];
      const finalRowNum = await mainPage.getRowNumber();
      const rowObj = await getMainPageRowObject(1);
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      expect(rowObj.tags).toEqual(desiredTagArray);
      done();
    });
    it('should create eform while adding more than 2 already prepared tags', async function (done) {
      const initRowNum = await mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.createEFormModal.saveEFormBtn));
      try {
        await mainPage.createEFormModal.closeTagInputBtn.isDisplayed();
        await mainPage.createEFormModal.closeTagInputBtn.click();
      } catch (e) {

      }
      mainPage.createEFormModal.tagSelector.click();
      mainPage.createEFormModal.selectTag(data.MainPage.firstTagForAdding);
      mainPage.createEFormModal.selectTag(data.MainPage.secondTagForAdding);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.saveEFormBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const desiredTagArray = [data.MainPage.firstTagForAdding, data.MainPage.secondTagForAdding];
      const finalRowNum = await mainPage.getRowNumber();
      const rowObj = await getMainPageRowObject(1);
      expect(finalRowNum).toEqual(initRowNum + 1, 'Row was not added!');
      expect(rowObj.tags).toEqual(desiredTagArray);
      done();
    });
  });
  describe('Negative: user ', function () {
    it('should not create eform if xml is empty', async function (done) {
      browser.sleep(5000);
      const initRowNum = await mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      waitFor(mainPage.createEFormModal.cancelBtn);
      mainPage.createEFormModal.saveEFormBtn.click();
      waitFor(mainPage.newEformBtn);
      const finalRowNum = await mainPage.getRowNumber();
      expect(finalRowNum).toEqual(initRowNum);
      done();
    });
    it('should not create eform if he presses Cancel', async function (done) {
      const initRowNum = await mainPage.getRowNumber();
      mainPage.newEformBtn.click();
      waitFor(mainPage.createEFormModal.saveEFormBtn);
      mainPage.createEFormModal.enterXML(data.MainPage.wordToReplaceBy);
      mainPage.createEFormModal.cancelBtn.click();
      browser.wait(ExpectedConditions.elementToBeClickable(mainPage.newEformBtn));
      const finalRowNum = await mainPage.getRowNumber();
      expect(finalRowNum).toEqual(initRowNum);
      done();
    });

  });
})
;
