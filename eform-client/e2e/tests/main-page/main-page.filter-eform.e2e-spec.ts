import {MainPage} from '../../Page objects/Main Page/MainPage';
import {goToMainPage} from '../../Helper methods/go-to-pages';
import {signOut, waitFor, waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';
import {getMainPageRowObject, MainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import {browser, ElementArrayFinder, ElementFinder, protractor} from 'protractor';
import data from '../../data';

const mainPage = new MainPage();


describe('Main page - FILTERS', function () {
  xdescribe('By label user', function () {
    beforeAll(async () => {
      await goToMainPage();
    });
    afterAll(async () => {
      await signOut();
    });
    it('should be able to filter by 1 word in label input', async () => {
      const initRowNum = await mainPage.getRowNumber();
      const initRowObjArr: MainPageRowObject[] = [];
      for (let i = 1; i <= initRowNum; i++) {
        initRowObjArr.push(await getMainPageRowObject(i));
      }
      const initNameArr = initRowObjArr.map(obj => obj.nameEForm);
      // const randomName: string = initNameArr[Math.floor(Math.random() * initNameArr.length)];
      const randomName: string = initNameArr[0];
      await waitFor(mainPage.labelInput);
      await mainPage.labelInput.sendKeys(randomName);
      await mainPage.labelInput.sendKeys(protractor.Key.ENTER);
      const finalRowNum = await mainPage.getRowNumber();
      const finalRowObjArr: MainPageRowObject[] = [];
      for (let i = 1; i <= finalRowNum; i++) {
        finalRowObjArr.push(await getMainPageRowObject(i));
      }
      const finalNameArr: string[] = finalRowObjArr.map(obj => obj.nameEForm);
      const everyNameContainsSelecedLabel: Boolean = finalNameArr.every(name => name.includes(randomName));
      expect(everyNameContainsSelecedLabel).toBeTruthy();
    });
    it('should be able to see all eforms by leaving label input empty', async () => {
      const initRowNum = await mainPage.getRowNumber();
      await mainPage.labelInput.clear();
      await mainPage.labelInput.sendKeys(protractor.Key.ENTER);
      await browser.waitForAngular();
      const finalRowNum = await mainPage.getRowNumber();
      expect(initRowNum).toBeLessThan(finalRowNum);
    });
  });
  describe('By tag user', function () {
    beforeAll(async () => {
      await goToMainPage();
    });
    afterAll(async () => {
      await signOut();
    });
    it('should be able to filter using 1 tag', async () => {
      await browser.waitForAngular();
      await waitTillVisibleAndClick(mainPage.tagSelector);
      const tagArray: ElementArrayFinder = mainPage.getTagsForFilter(); // ElementArrayFinder lacks functionality compared to ordinary
                                                                        // arrays. Thus it is better to make simple array
      const tagArr: ElementFinder[] = []; // This is simple array of ElementFinder elements
      for (let i = 0; i < await tagArray.count(); i++) {
        tagArr.push(tagArray.get(i));
      }
      const randomTag = tagArr[Math.floor(Math.random() * tagArr.length)];
      await randomTag.click();
      await browser.waitForAngular();
      const finalRowNum = await mainPage.getRowNumber();
      const finalRowObjArr: MainPageRowObject[] = [];
      for (let i = 1; i <= finalRowNum; i++) {
      // for (let i = 0; i < finalRowNum; i++) {
        finalRowObjArr.push(await getMainPageRowObject(i));
      }
      const randomTagText = await randomTag.getText();
      const objTagArr: string[][] = finalRowObjArr.map(obj => obj.tags);
      const filteredByTags: boolean = objTagArr.every(array => array.indexOf(randomTagText) >= 0);
      expect(filteredByTags).toBeTruthy('Eforms have not become filtered by 1 tag');
      await browser.sleep(5000);
      await randomTag.click();
      await mainPage.tagSelector.click();
    });
    it('should be able to filter using several tags', async () => {
      try {
        await mainPage.tagSelector.click();
      } catch (e) {
        console.log('Failed to click tag selector. Maybe there are no selectors in dropdown');
      }
      const tagArray: ElementArrayFinder = mainPage.getTagsForFilter(); // ElementArrayFinder lacks functionality compared to ordinary
                                                                        // arrays. Thus it is better to make simple array
      const tagArr: ElementFinder[] = []; // This is simple array of ElementFinder elements
      for (let i = 0; i < await tagArray.count(); i++) {
        tagArr.push(tagArray.get(i));
      }
      const randomTagArray: ElementFinder[] = []; // Array of random tags
      for (let i = 0; i < data.MainPage.tagsNumberForSelectionForFilter; i++) {
        randomTagArray.push(tagArr.splice(Math.random() * (tagArr.length - 1), 1).pop()); // delete from original tag array
        // and insert into random tag array
      }
      await randomTagArray.forEach(async (item) => await item.click()) ;
      await browser.waitForAngular();
      await browser.sleep(5000);
      const finalRowNum = await mainPage.getRowNumber();
      const finalRowObjArr: MainPageRowObject[] = [];
      for (let i = 1; i <= finalRowNum; i++) {
        finalRowObjArr.push(await getMainPageRowObject(i));
      }
      const randomTagTextArray: string[] = await Promise.all(randomTagArray.map(async (tag) => {
        return await tag.getText();
      }));
      const objTagArr: string[][] = finalRowObjArr.map(obj => obj.tags);
      const filteredByTags: boolean = objTagArr.every(tagArrayInOneObj => {
        return randomTagTextArray.some(randomTagText => tagArrayInOneObj.indexOf(randomTagText) >= 0);
      });
      expect(filteredByTags).toBeTruthy('Eforms are filtered by tags incorrectly');
      await randomTagArray.forEach(async tag => await tag.click());
      await browser.waitForAngular();
      await browser.sleep(5000);
      const postRefilterRowNum = await mainPage.getRowNumber();
      expect(postRefilterRowNum).toBeGreaterThan(finalRowNum, 'Deleting tags in selector hasn\'t increased eforms number');
    });
  });
});
