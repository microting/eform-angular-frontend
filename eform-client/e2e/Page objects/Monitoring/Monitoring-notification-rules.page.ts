import Page from '../Page';
import XMLForEform from '../../Constants/XMLForEform';
import XMLForeFormExtended from '../../Constants/XMLForeFormExtended';
import XMLForEformFractions from '../../Constants/XMLForEformFractions';

export class MonitoringNotificationRulesPage extends Page {
  constructor() {
    super();
  }
  public get newEformBtn() {
    return browser.element('#newEFormBtn');
  }
  public get createEformTagSelector() {
    return browser.element('#createEFormMultiSelector');
  }

  public get createEformNewTagInput() {
    return browser.element('#addTagInput');
  }

  public get xmlTextArea() {
    return browser.element('#eFormXml');
  }

  public get createEformBtn() {
    return browser.element('#createEformBtn');
  }
  public get MonitoringDropdown() {
    return browser.element(`//*[@class= 'dropdown']//*[@id= '']`);
  }
  public get MonitoringRulesBtn() {
    return browser.element(`//*[@id= 'monitoring-pn-calendar']`);
  }
  public get RuleCreateBtn() {
    return browser.element('#ruleCreateBtn');
  }
  public get templateSelector() {
    return browser.element(`//*[@id= 'templateSelector']`);
  }
  public get DataFieldSelector() {
    return browser.element('#dataFieldSelector');
  }
  public get CheckboxOption() {
    return browser.element(`//div[@id= 'checkbox']`);
  }
  public get GreaterThanValue() {
    return browser.element('#greaterThanValue');
  }
  public get LessThanValue() {
    return browser.element('#lessThanValue');
  }
  public get EqualValue() {
    return browser.element('#equalValue');
  }
  public get EmailSubject() {
    return browser.element('#emailSubject');
  }
  public get EmailTextArea() {
    return browser.element('#emailText');
  }
  public get AttachReportBox() {
    return browser.element('#attachReport');
  }
  public get RecipientEmail() {
    return browser.element('#recipientEmail');
  }
  public get AddRecipientBtn() {
    return browser.element('#addRecipientBtn');
  }
  public get RuleSaveBtn() {
    return browser.element('#ruleEditSaveBtn');
  }
  public get RuleCancelBtn() {
    return browser.element('#ruleEditCancelBtn');
  }

  createNewEform(eFormLabel, selectableReplace, searchableReplace) {
    this.newEformBtn.click();
    browser.waitForVisible('#eFormXml', 20000);
    // Create replaced xml and insert it in textarea
    let xml = XMLForeFormExtended.XML.replace('TEST_LABEL', eFormLabel);
    xml = xml.replace('REPLACE_SEARCHABLE_ID', searchableReplace);
    xml = xml.replace('REPLACE_SEARCHABLE_ID', searchableReplace);
    xml = xml.replace('REPLACE_SINGLE_SELECT_SEARCH_ID', selectableReplace);
    xml = xml.replace('REPLACE_SINGLE_SELECT_SEARCH_ID', selectableReplace);
    browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    this.xmlTextArea.addValue(' ');
        this.createEformTagSelector.click();
        browser.waitForVisible('#createEformBtn', 10000);
        // browser.pause(5000);
    this.createEformBtn.click();
    // browser.pause(14000);
    browser.waitForVisible('#delete-eform-btn', 20000);
  }
  public selectOption(option) {
    browser.element(`//*[text()="${option}"]`).click();
  }
  public getFirstRowObject(rowNum): RulesRowObject {
    return new RulesRowObject(rowNum);
  }
  public goToMonitoringRulesPage() {
    this.MonitoringDropdown.click();
    browser.waitForVisible('#monitoring-pn-calendar', 20000);
    this.MonitoringRulesBtn.click();
    browser.waitForVisible('#ruleCreateBtn', 20000);
  }
  public createNewMonitoringRuleWithCheckbox(template, dataField, emailSubject, emailText, recipient) {
    this.RuleCreateBtn.click();
    browser.waitForVisible('#templateSelector', 20000);
    this.templateSelector.click();
    browser.pause(2000);
    this.selectOption(template);
    browser.pause(8000);
    this.DataFieldSelector.click();
    browser.pause(2000);
    this.selectOption(dataField);
    browser.pause(8000);
    this.CheckboxOption.click();
    this.EmailSubject.addValue(emailSubject);
    this.EmailTextArea.addValue(emailText);
    this.AttachReportBox.click();
    browser.pause(2000);
    this.RecipientEmail.addValue(recipient);
    this.AddRecipientBtn.click();
    browser.pause(2000);
    this.RuleSaveBtn.click();
    browser.pause(8000);
    browser.refresh();
    browser.pause(8000);
  }
}

const rulesPage = new MonitoringNotificationRulesPage();
export default rulesPage;

export class RulesRowObject {
  constructor(rowNum) {
    if ($$('#ruleId')[rowNum - 1]) {
      this.id = $$('#ruleId')[rowNum - 1];
      try {
        this.eFormName = $$('#ruleeFormName')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.trigger = $$('#ruleTrigger')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.event = $$('#ruleEvent')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.editBtn = $$('#updateRuleBtn')[rowNum - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#deleteRuleBtn')[rowNum - 1];
      } catch (e) {}
    }
  }
  id;
  eFormName;
  trigger;
  event;
  editBtn;
  deleteBtn;
}
