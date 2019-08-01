import {Guid} from 'guid-typescript';
import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';

describe('Trash Inspection Plugin - Installation', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('Should delete installation.', function () {
    installationPage.goToInstallationsPage();
    installationPage.createInstallation_DoesntAddSite(Guid.create().toString());
    installationPage.deleteInstallation_Deletes();
    const installation = installationPage.getFirstRowObject();
    expect(installation.id === 0);
  });
});
