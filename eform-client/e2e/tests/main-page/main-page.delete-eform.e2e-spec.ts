import {MainPage} from '../../Page objects/Main Page/MainPage';
import {getMainPageRowObject, MainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import {signOut, waitFor, waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';
import data from '../../data';
import {goToMainPage} from '../../Helper methods/go-to-pages';

const mainPage = new MainPage();


describe('Main page - DELETE. User', function () {
    beforeAll(done => {
      goToMainPage();
      done();
    });
    afterAll(done => {
      signOut();
      done();
    });
    it('should delete existing eform', async function (done) {
      const firstRowObj = await getMainPageRowObject(1);
      firstRowObj.deleteEFormBtn.click();
      waitTillVisibleAndClick(mainPage.deleteEformModal.deleteEFormOkBtn);
      const allMainPageRowObjects = await MainPage.getAllMainPageRowObjects();
      const rowIsDeleted: boolean = allMainPageRowObjects.filter(item => item.id === firstRowObj.id).length === 0;
      expect(rowIsDeleted).toBeTruthy('Some error occured during delettion');
      done();
    });
});
