import rulesPage from '../../Page objects/Monitoring/Monitoring-notification-rules.page';
import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import searchableLists from '../../Page objects/SearchableLists.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {Guid} from 'guid-typescript';
const expect = require('chai').expect;

describe('Monitoring - Monitoring Rules - Add', function () {
  before(function () {
    loginPage.open('/auth');
  });
  it('should create a searchable, selectable list and eForm', function () {
    loginPage.login();
    myEformsPage.Navbar.goToEntitySearch();
    searchableLists.createSearchableList_NoItem('Searchable');
    const searchableList = searchableLists.getFirstRowObject();
    const searchableId = searchableList.id.getText();
    myEformsPage.Navbar.goToEntitySelect();
    selectableLists.createSelectableList_NoItem('Selectable');
    const selectableList = selectableLists.getFirstRowObject();
    const selectableId = selectableList.id.getText();
    loginPage.open('/');
    browser.pause(8000);
    rulesPage.createNewEform('Number 1', selectableId, searchableId);
    browser.pause(8000);
  });
  it('should go to monitoring rules page', function () {
    rulesPage.goToMonitoringRulesPage();
    browser.pause(8000);
  });
  it('should create a new rule with checkbox', function () {
    const template = 'Test e-mail notifikation på alle felter';
    const dataField = '2. Sæt flueben';
    const emailSubject = Guid.create().toString();
    const emailText = Guid.create().toString();
    const recipient = 'hej@hej.com';
    rulesPage.createNewMonitoringRuleWithCheckbox(template, dataField, emailSubject, emailText, recipient);
    const rule = rulesPage.getFirstRowObject(1);
    expect(rule.id).equal(1);
    expect(rule.eFormName).equal(template);
    expect(rule.trigger).equal('2. Sæt flueben = Checked');
    expect(rule.event).equal('Email');
  });
});
