import {$, browser, by, element, ElementFinder} from 'protractor';
import xmlData from '../../xmlData';
import data from '../../data';

export class CreateEformModal {

  // Elements
  tagSelector: ElementFinder;
  addTagBtn: ElementFinder;
  addTagInput: ElementFinder;
  xmlTextArea: ElementFinder;
  cancelBtn: ElementFinder;
  saveEFormBtn: ElementFinder;
  closeTagInputBtn: ElementFinder;

  // actions
  selectTag(tagName) {
    const tag = element(by.xpath(`//*[@id="createEFormMultiSelector"]//span[text()="${tagName}"]`));
    tag.click();
  };
  enterXML(name) {
    let text = xmlData.xmlTest1.text;
    text = text.replace(data.MainPage.wordToReplaceInXML,
      name + Math.floor(Math.random() * data.MainPage.auxiliaryNumberForReplacing) + 1);
    this.xmlTextArea.clear();
    // browser.executeScript(this.xmlTextArea)
    // let sampletext = 'SAMPLE_TEXT--';
    // browser.executeScript('document.getElementById(\'eFormXml\').value = arguments[0]', text);
    // browser.executeScript('document.getElementById(\'eFormXml\').setAttribute(\'ng-reflect-model\', arguments[0])', text);
    // browser.executeScript('document.getElementById(\'eFormXml\').setAttribute(\'value\', arguments[0])', text);
    this.xmlTextArea.sendKeys(text);
  }

  constructor() {
    this.addTagBtn = $('#addTagBtn');
    this.xmlTextArea = $('#eFormXml');
    this.addTagInput = $('#addTagInput');
    this.tagSelector = $('#createEFormMultiSelector');
    this.cancelBtn = $('#createEFormCancelBtn');
    this.saveEFormBtn = $('#createEFormSaveEFormBtn');
    this.closeTagInputBtn = $('#closeTagInputBtn');
  }

}
