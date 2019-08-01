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
  it('should create Fraction', function(){
    fractionsPage.goToFractionsPage();
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    fractionsPage.createFraction(newName, newDescription);
    const fraction = fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(newName);
    expect(fraction.description).equal(newDescription);
  })
  it('should cancel edit Fraction', function(){
    fractionsPage.goToFractionsPage();
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    const fraction = fractionsPage.getFirstRowObject();
    const oldName = fraction.name;
    const oldDescription = fraction.description;
    fractionsPage.cancelEditFraction(newName, newDescription);
    expect(fraction.name).equal(oldName);
    expect(fraction.description).equal(oldDescription);
  });
  it('should edit Fraction', function () {
    fractionsPage.goToFractionsPage();
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    fractionsPage.editFraction(newName, newDescription);
    const fraction = fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(newName);
    expect(fraction.description).equal(newDescription);
  });
  it('should clean up', function(){
    fractionsPage.goToFractionsPage();
    const fraction = fractionsPage.getFirstRowObject();
    fraction.deleteBtn.click();
    browser.waitForVisible('#fractionDeleteDeleteBtn', 10000);
    fractionsPage.fractionDeleteDeleteBtn.click();
    browser.pause(4000);
    browser.refresh();
    expect(fraction.id).equal(null);
  });
});
