import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import installationPage from '../../../Page objects/InstallationChecking/InstallationChecking-Installation.page';
import {Guid} from 'guid-typescript';
import customersPage from '../../../Page objects/InstallationChecking/Customers.page';
import deviceUsers from '../../../Page objects/DeviceUsers.page';
import installationsPage from '../../../Page objects/InstallationChecking/InstallationChecking.page';

describe('Installation Checking - Installation', function () {
  const companyName = 'BMW';
  const listName = 'My testing list';
  const deviceUserFirstName = 'John';
  const deviceUserLastName = 'Smith';
  const deviceUserFullName = `${deviceUserFirstName} ${deviceUserLastName}`;
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    // Setup customer
    // customersPage.configureSearchableList(listName);
    // customersPage.createCustomer(companyName);
    // // Setup device user
    // deviceUsers.createDeviceUserFromScratch(deviceUserFirstName, deviceUserLastName);
    // Go to installation page
    installationsPage.goToInstallationsPage();
  });
  // it('should create installation', function () {
  //   browser.waitForVisible('#createInstallationBtn', 30000);
  //   installationPage.createInstallation(companyName);
  //   const installation = installationPage.getFirstRowObject();
  //   expect(installation.companyName).equal(companyName);
  //   browser.pause(8000);
  //   browser.refresh();
  // });
  // it('should not create installation', function () {
  //   const rowNumsBeforeCreate = installationPage.rowNum;
  //   browser.pause(8000);
  //   browser.waitForVisible('#createInstallationBtn', 30000);
  //   installationPage.createInstallation_Cancels();
  //   expect(rowNumsBeforeCreate).equal(installationPage.rowNum);
  // });
  // it('should not assign installation', function () {
  //   browser.pause(8000);
  //   const installation = installationPage.getFirstRowObject();
  //   const checkboxBeforeAssign = installation.assignCheckbox;
  //   browser.waitForVisible('#installationAssignBtn', 30000);
  //   installationPage.assignInstallation_Cancels();
  //   expect(installation.assignCheckbox).equal(checkboxBeforeAssign);
  // });
  it('should assign installation', function () {
    browser.waitForVisible('#installationAssignBtn', 30000);
    installationPage.assignInstallation(deviceUserFullName);
    const installation = installationPage.getFirstRowObject();
    expect(installation.assignedTo).equal(deviceUserFullName);
    browser.pause(8000);
    browser.refresh();
  });
  // it('should not retract installation', function () {
  //   browser.pause(8000);
  //   installationPage.retractInstallation_Cancels();
  //   const installation = installationPage.getFirstRowObject();
  //   browser.pause(2000);
  //   expect(installation.assignedTo).equal(deviceUserFullName);
  // });
  // it('should retract installation', function () {
  //     browser.pause(8000);
  //     installationPage.changeSurveyConfigStatus();
  //     const installation = installationPage.getFirstRowObject();
  //     browser.pause(2000);
  //     expect(installation.assignedTo).equal('');
  // });
});
