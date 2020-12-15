import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';
import foldersPage, {FoldersRowObject} from '../../Page objects/Folders.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';

const expect = require('chai').expect;

describe('Create eform', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
  });
  it('Create e-form', function () {
     // Create folder
     const name = Guid.create().toString();
     const description = Guid.create().toString();
     foldersPage.createNewFolder(name, description);

     // Create 2 device users
     myEformsPage.Navbar.goToDeviceUsersPage();
     $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
     const firstName = Guid.create().toString();
     const lastName = Guid.create().toString();
     deviceUsersPage.createNewDeviceUser(firstName, lastName);
     browser.pause(5100);
     const firstName1 = Guid.create().toString();
     const lastName1 = Guid.create().toString();
     deviceUsersPage.createNewDeviceUser(firstName1, lastName1);
     $('#newDeviceUserBtn').waitForEnabled({timeout: 20000});

     // Create e-form
     loginPage.open('/');
       const rowNumberBeforeCreating = myEformsPage.rowNum;
     const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
       '<Main>\n' +
       '  <Id>138798</Id>\n' +
       '  <Repeated>0</Repeated>\n' +
       '  <Label>Number 1</Label>\n' +
       '  <StartDate>2018-05-08</StartDate>\n' +
       '  <EndDate>2028-05-08</EndDate>\n' +
       '  <Language>da</Language>\n' +
       '  <MultiApproval>false</MultiApproval>\n' +
       '  <FastNavigation>false</FastNavigation>\n' +
       '  <Review>false</Review>\n' +
       '  <Summary>false</Summary>\n' +
       '  <DisplayOrder>0</DisplayOrder>\n' +
       '  <ElementList>\n' +
       '    <Element type="DataElement">\n' +
       '      <Id>138798</Id>\n' +
       '      <Label>Number 1</Label>\n' +
       '      <Description><![CDATA[]]></Description>\n' +
       '      <DisplayOrder>0</DisplayOrder>\n' +
       '      <ReviewEnabled>false</ReviewEnabled>\n' +
       '      <ManualSync>false</ManualSync>\n' +
       '      <ExtraFieldsEnabled>false</ExtraFieldsEnabled>\n' +
       '      <DoneButtonDisabled>false</DoneButtonDisabled>\n' +
       '      <ApprovalEnabled>false</ApprovalEnabled>\n' +
       '      <DataItemList>\n' +
       '        <DataItem type="Number">\n' +
       '          <Id>343963</Id>\n' +
       '          <Label>Number 1</Label>\n' +
       '          <Description><![CDATA[Number 1 description]]></Description>\n' +
       '          <DisplayOrder>0</DisplayOrder>\n' +
       '          <Mandatory>true</Mandatory>\n' +
       '          <MinValue>1</MinValue>\n' +
       '          <MaxValue>1100</MaxValue>\n' +
       '          <Value>24</Value>\n' +
       '          <DecimalCount>2</DecimalCount>\n' +
       '          <UnitName/>\n' +
       '          <Color>e8eaf6</Color>\n' +
       '        </DataItem>\n' +
       '      </DataItemList>\n' +
       '    </Element>\n' +
       '  </ElementList>\n' +
       '</Main>';
     myEformsPage.newEformBtn.click();
     myEformsPage.xmlTextArea.waitForDisplayed({timeout: 20000});
     myEformsPage.xmlTextArea.click();
     myEformsPage.xmlTextArea.setValue(xml);
     myEformsPage.createEformBtn.click();
     myEformsPage.newEformBtn.waitForEnabled({timeout: 20000});
     browser.pause(1000);
     $$('#eform-add-btn')[$$('#eform-add-btn').length - 1].click();
     $('#folderTreeId').waitForDisplayed({timeout: 20000});
     $$('#folderTreeId')[$$('#folderTreeId').length - 1].click();
     const microtingIds = $$('#microtingId');
     $(`#checkboxLabel${microtingIds[microtingIds.length - 2].getText()}`).click();
     $(`#checkboxLabel${microtingIds[microtingIds.length - 1].getText()}`).click();
     $('#saveParingBtn').click();
    const rowNumberAfterCreating = myEformsPage.rowNum;
    expect(rowNumberBeforeCreating, 'EForm was not created', rowNumberAfterCreating - 1);
  });
  it('Remove pairing', function () {
    browser.pause(1000);
    $('#eform-pairing-btn').waitForDisplayed({timeout: 2000});
    const numPairingBtnBeforeRemoving = $$('#eform-pairing-btn').length;
    $$('#eform-pairing-btn')[$$('#eform-pairing-btn').length - 1].click();
    $('#folderTreeId').waitForDisplayed({timeout: 20000});
    $$('#folderTreeId')[$$('#folderTreeId').length - 1].click();
    const microtingIds = $$('#microtingId');
    $(`#checkboxLabel${microtingIds[microtingIds.length - 2].getText()}`).click();
    $(`#checkboxLabel${microtingIds[microtingIds.length - 1].getText()}`).click();
    $('#saveParingBtn').click();
    myEformsPage.newEformBtn.waitForEnabled({timeout: 2000});
    const numPairingBtnAfterRemoving = $$('#eform-pairing-btn').length;
    expect(numPairingBtnBeforeRemoving, 'Pairing was not removed', numPairingBtnAfterRemoving - 1);
  });
  it('Cancel pairing editing', function () {
    $('#eform-add-btn').waitForDisplayed({timeout: 2000});
    const numAddPairingBtnBeforeCancel = $$('#eform-add-btn').length;
    $$('#eform-add-btn')[$$('#eform-add-btn').length - 1].click();
    $('#folderTreeId').waitForDisplayed({timeout: 20000});
    $$('#folderTreeId')[$$('#folderTreeId').length - 1].click();
    $('#cancelParingBtn').click();
    myEformsPage.newEformBtn.waitForEnabled({timeout: 2000});
    const numAddPairingBtnAfterCancel = $$('#eform-add-btn').length;
    expect(numAddPairingBtnBeforeCancel, 'Pairing was not canceled', numAddPairingBtnAfterCancel);
  });
  it('should delete user', function () {
    myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = deviceUsersPage.rowNum;
    $('#deviceUserId').waitForDisplayed({timeout: 20000});
    let lastDeviceUser = deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    lastDeviceUser.deleteBtn.waitForDisplayed({timeout: 5000});
    lastDeviceUser.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    deviceUsersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumAfterDelete = deviceUsersPage.rowNum;
    expect(rowNumBeforeDelete, 'User deleted incorrectly').equal(rowNumAfterDelete + 1);
    lastDeviceUser = deviceUsersPage.getDeviceUser(1);
    lastDeviceUser.deleteBtn.waitForDisplayed({timeout: 5000});
    lastDeviceUser.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    deviceUsersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('Should delete folder', function () {
    // Create
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[0].click();
    const lastFolder = foldersPage.getFolder(1);
    lastFolder.deleteBtn.waitForDisplayed({timeout: 5000});
    lastFolder.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
});
