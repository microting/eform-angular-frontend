import {MainPage} from '../../Page objects/Main Page/MainPage';
import {getMainPageRowObject, MainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import {signOut, waitFor, waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';
import data from '../../data';
import {goToMainPage} from '../../Helper methods/go-to-pages';
import {browser} from 'protractor';

const mainPage = new MainPage();


describe('Main page - DELETE. User', function () {
    beforeAll(async () => {
      await goToMainPage();
      await browser.waitForAngular();
    });
    afterAll(async () => {
      await signOut();
    });
    it('should delete existing eform', async  () => {
      browser.waitForAngular();
      const firstRowObj = await getMainPageRowObject(1);
      await browser.sleep(3000);
      await firstRowObj.deleteEFormBtn.click();
      browser.sleep(3000);
      await waitTillVisibleAndClick(mainPage.deleteEformModal.deleteEFormOkBtn);
      const allMainPageRowObjects = await MainPage.getAllMainPageRowObjects();
      const rowIsDeleted: boolean = allMainPageRowObjects.filter(item => item.id === firstRowObj.id).length === 0;
      expect(rowIsDeleted).toBeTruthy('Some error occured during delettion');
    });
});
