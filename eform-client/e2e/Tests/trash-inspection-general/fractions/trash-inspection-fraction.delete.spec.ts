import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import {Guid} from 'guid-typescript';
import fractionsPage from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import pluginsPage from '../../trash-inspections-settings/application-settings.plugins.page';
import myEformsPage from '../../../Page objects/MyEforms.page';

describe('Trash Inspection Plugin - Fraction', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should check if activated', function () {
    myEformsPage.Navbar.advancedDropdown();
    myEformsPage.Navbar.clickonSubMenuItem('Plugins');
    browser.pause(8000);
    const plugin = pluginsPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting Trash Inspection Plugin');
    expect(plugin.version).equal('1.0.0.0');
    expect(plugin.status).equal('Aktiveret');
  });
  it('should check if menupoint is there', function () {
    expect(fractionsPage.trashInspectionDropdownName.getText()).equal('Affaldsinspektion');
    fractionsPage.trashInspectionDropDown();
    browser.pause(4000);
    expect(fractionsPage.fractionBtn.getText()).equal('Fraktioner');
    browser.pause(4000);
    fractionsPage.trashInspectionDropDown();
    browser.refresh();
  });
  it('should delete Fraction', function () {
    fractionsPage.goToFractionsPage();
    fractionsPage.deleteFraction();
    browser.pause(8000);
    const fraction = fractionsPage.getFirstRowObject();
    expect(fraction.id === null);
  });

});
