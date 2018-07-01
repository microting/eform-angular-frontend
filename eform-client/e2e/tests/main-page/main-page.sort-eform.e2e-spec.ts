import {MainPage} from '../../Page objects/Main Page/MainPage';
import {getMainPageRowObject, MainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import {goToMainPage} from '../../Helper methods/go-to-pages';
import {signOut} from '../../Helper methods/other-helper-methods';
import {browser} from 'protractor';
import data from '../../data';

const mainPage: MainPage = new MainPage();


describe('Main Page - SORT', function () {
  describe('user', function () {
    beforeEach(done => {
      goToMainPage();
      browser.waitForAngular();
      done();
    });
    afterEach(done => {
      signOut();
      browser.waitForAngular();
      done();
    });
    it('should be able to sort by ID', async function (done) {
      const initIDArr: number[] = [];
      const rowNum = await mainPage.getRowNumber();
      for (let i = 1; i <= rowNum; i++) {
        initIDArr.push((await getMainPageRowObject(i)).id);
      }
      const arrayIsSortedByAscending: boolean = initIDArr.every((item, i, arr) => i === 0 || item <= arr[i - 1]);
      expect(arrayIsSortedByAscending).toBeTruthy('Array is not sorted by ascending (the greatest is above and the lowest is below');
      mainPage.idSortBtn.click();
      const finalIDArr = [];
      for (let i = 1; i <= rowNum; i++) {
        finalIDArr.push((await getMainPageRowObject(i)).id);
      }
      expect(finalIDArr).toEqual(initIDArr.reverse(), 'Sorting - The the greatest number below and the lowest is above - doesn\'t work properly');
      done();
    });
    it('should be able to sort by "Created at"', async function (done) {
      // Parse date string into date
      const toDateFunc = (createdAtStr) => {
        const [globalPart, dayPart] = createdAtStr.split(' ');
        const [gday, gmonth, gyear] = globalPart.split('.');
        const rearrangedGlobalPart = [gyear, gmonth, gday].join('-');
        const finalDateStr = [rearrangedGlobalPart, 'T', dayPart, 'Z'].join('');
        const date = new Date(finalDateStr);
        return date;
      };

      mainPage.createdAtSortBtn.click();
      const initCreatedAtArr: Date[] = [];
      const rowNum = await mainPage.getRowNumber();
      for (let i = 1; i <= rowNum; i++) {
        const createdAt = (await getMainPageRowObject(i)).createdAt;
        initCreatedAtArr.push(toDateFunc(createdAt));
      }
      const arrayIsSortedByDescending: boolean = initCreatedAtArr.every((item, i, arr) => i === 0 || item >= arr[i - 1]);
      expect(arrayIsSortedByDescending).toBeTruthy('Array is not sorted by descending (the lowest is above and the greatest is below');
      mainPage.createdAtSortBtn.click();
      const finalCreatedAtArr: Date[] = [];
      for (let i = 1; i <= rowNum; i++) {
        const createdAt = (await getMainPageRowObject(i)).createdAt;
        finalCreatedAtArr.push(toDateFunc(createdAt));
      }
      expect(finalCreatedAtArr).toEqual(initCreatedAtArr.reverse(), 'Sorting - The the greatest number below and the lowest is above - doesn\'t work properly');
      done();
    });
    it('should be able to sort by "Name eForm"', async function (done) {
      mainPage.nameEFormSortBtn.click();
      const initNameArr = [];
      const rowNum = await mainPage.getRowNumber();
      for (let i = 1; i <= rowNum; i++) {
        initNameArr.push((await getMainPageRowObject(i)).nameEForm);
      }
      const arrayIsSortedByDescending: boolean = initNameArr.every((item, i, arr) => i === 0 || item >= arr[i - 1]);
      expect(arrayIsSortedByDescending).toBeTruthy('Array is not sorted by ascending (the greatest is above and the lowest is below');
      mainPage.nameEFormSortBtn.click();
      const finalNameArr = [];
      for (let i = 1; i <= rowNum; i++) {
        finalNameArr.push((await getMainPageRowObject(i)).nameEForm);
      }
      expect(finalNameArr).toEqual(initNameArr.reverse(), 'Sorting - The the greatest number below and the lowest is aboe - doesn\'t work properly');
      done();
    });
  });
});
