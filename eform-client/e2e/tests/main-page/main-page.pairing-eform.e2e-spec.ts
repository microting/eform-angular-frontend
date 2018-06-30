import {goToDeviceUsersPage, goToMainPage} from '../../Helper methods/go-to-pages';
import {signOut, waitFor} from '../../Helper methods/other-helper-methods';
import {MainPage} from '../../Page objects/Main Page/MainPage';
import {getMainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import {browser} from 'protractor';
import {DeviceUsersPage} from '../../Page objects/Device users/DeviceUsersPage';
import {debug} from 'util';

const deviceUsersPage = new DeviceUsersPage();
describe('Pairing on the main page:', function () {
  beforeAll(done => {
    // goToDeviceUsersPage();
    // deviceUsersPage.newDeviceUserButton.click();
    // deviceUsersPage.addNewUserModal.fillFirstNameInput();
    // deviceUsersPage.addNewUserModal.fillLastNameInput();
    // deviceUsersPage.addNewUserModal.save();
    // browser.waitForAngular();
    // signOut();
    // browser.waitForAngular();
    goToMainPage();
    done();
  });
  afterAll(done => {
    signOut();
    done();
  });

  describe('After clicking "Pair eForm" button user', function () {
    afterEach(done => {
      const mainPage = new MainPage();

      mainPage.labelInput.click();
      done();
    });
    it('should pair several device users', async function (done) {
      const mainPage = new MainPage();

      browser.waitForAngular();
      waitFor(mainPage.newEformBtn);
      const mainRowObj = await getMainPageRowObject(1);
      mainRowObj.pairingBtn.click();
      browser.waitForAngular();
      waitFor(mainPage.pairEformModal.saveBtn);
      await mainPage.pairEformModal.getAllPairingModalRowObjects();
      const uncheckedPairEformModalRowObj1 = mainPage.pairEformModal.uncheckedPairEformRowObjects[3];
      const uncheckedPairEformModalRowObj2 = mainPage.pairEformModal.uncheckedPairEformRowObjects[4];
      uncheckedPairEformModalRowObj1.checkToPairChbx.click();
      uncheckedPairEformModalRowObj2.checkToPairChbx.click();
      let expectedPairedNamesArr: string[] = [];
      expectedPairedNamesArr.push(uncheckedPairEformModalRowObj1.userDeviceName); // add name of selected
      expectedPairedNamesArr.push(uncheckedPairEformModalRowObj2.userDeviceName); // add name of selected
      const checkedNames: string[] = mainPage.pairEformModal.checkedPairEformRowObjects.map(item => item.userDeviceName);
      expectedPairedNamesArr = expectedPairedNamesArr.concat(checkedNames); // add names of already checked items
      expectedPairedNamesArr.sort();
      mainPage.pairEformModal.saveBtn.click();
      browser.waitForAngular();
      waitFor(mainPage.newEformBtn);
      const editedMainRowObj = await getMainPageRowObject(1);
      browser.waitForAngular();
      editedMainRowObj.pairedNames.sort();
      expect(editedMainRowObj.pairedNames).toEqual(expectedPairedNamesArr);
      done();
    });
    it('should unpair one', async function (done) {
      const mainPage = new MainPage();

      browser.waitForAngular();
      waitFor(mainPage.newEformBtn);
      const mainRowObj = await getMainPageRowObject(1);
      mainRowObj.pairingBtn.click(); // OPEN PAIRING MODAL
      browser.waitForAngular();
      waitFor(mainPage.pairEformModal.saveBtn);
      await mainPage.pairEformModal.getAllPairingModalRowObjects();
      let expectedPairedNamesArr: string[] = [];
      try {
        const checkedPairEformModalRowObj = mainPage.pairEformModal.checkedPairEformRowObjects[0];
        checkedPairEformModalRowObj.checkToPairChbx.click();
        mainPage.pairEformModal.checkedPairEformRowObjects.shift(); // remove clicked row from list of checked rows
        expectedPairedNamesArr = mainPage.pairEformModal.checkedPairEformRowObjects.map(item => item.userDeviceName);
        expectedPairedNamesArr.sort();
      } catch (e) {
        console.log('Some error occured. Perhaps there are no paired device users for the selected eform');
      }
      mainPage.pairEformModal.saveBtn.click(); // CLOSE PAIRING MODAL
      browser.waitForAngular();
      waitFor(mainPage.newEformBtn);
      const editedMainRowObj = await getMainPageRowObject(1);
      browser.waitForAngular();
      editedMainRowObj.pairedNames.sort();
      expect(editedMainRowObj.pairedNames).toEqual(expectedPairedNamesArr);
      done();
    });
    it('should pair and unpair simultaneously', async function (done) {
      const mainPage = new MainPage();

      browser.waitForAngular();
      waitFor(mainPage.newEformBtn);
      const mainRowObj = await getMainPageRowObject(1);
      mainRowObj.pairingBtn.click(); // OPEN PAIRING MODAL
      browser.waitForAngular();
      waitFor(mainPage.pairEformModal.saveBtn);
      await mainPage.pairEformModal.getAllPairingModalRowObjects();
      let expectedPairedNamesArr: string[] = [];
      try {
        const checkedPairEformModalRowObj = mainPage.pairEformModal.checkedPairEformRowObjects[0];
        const uncheckedPairEformModalRowObj = mainPage.pairEformModal.uncheckedPairEformRowObjects[3];
        checkedPairEformModalRowObj.checkToPairChbx.click();
        uncheckedPairEformModalRowObj.checkToPairChbx.click();
        mainPage.pairEformModal.checkedPairEformRowObjects.shift(); // remove clicked row from list of checked rows
        mainPage.pairEformModal.checkedPairEformRowObjects.push(uncheckedPairEformModalRowObj);
        expectedPairedNamesArr = mainPage.pairEformModal.checkedPairEformRowObjects.map(item => item.userDeviceName);
        expectedPairedNamesArr.sort();
      } catch (e) {
        console.log('Some error occured. Perhaps there are no paired or unpaired device users for the selected eform');
      }
      mainPage.pairEformModal.saveBtn.click(); // CLOSE PAIRING MODAL
      browser.waitForAngular();
      waitFor(mainPage.newEformBtn);
      const editedMainRowObj = await getMainPageRowObject(1);
      browser.waitForAngular();
      editedMainRowObj.pairedNames.sort();
      expect(editedMainRowObj.pairedNames).toEqual(expectedPairedNamesArr);
      done();
    });
  });
})
;
