import {Guid} from 'guid-typescript';
import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';

describe('Trash Inspection Plugin - Installation', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('Should edit installation with only name.', function () {
    const newName = Guid.create().toString();
    const name = Guid.create().toString();
    installationPage.goToInstallationsPage();
    installationPage.createInstallation_DoesntAddSite(name);
    installationPage.editInstallation_OnlyEditsName(newName);
    const installation = installationPage.getFirstRowObject();
    expect(installation.name).equal(newName);
    installationPage.deleteInstallation_Deletes();
  });
});
