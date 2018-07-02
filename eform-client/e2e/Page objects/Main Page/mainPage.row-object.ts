import {browser, by, element, ElementFinder} from 'protractor';
import {getStringsFromXpath} from '../../Helper methods/other-helper-methods';

export class MainPageRowObject {
  id: number;
  createdAt: string;
  nameEForm: string;
  tags: string[];
  pairedNames: string[];
  pairingBtn: ElementFinder;
  tagEditBtn: ElementFinder;
  editColumnsBtn: ElementFinder;
  deleteEFormBtn: ElementFinder;
}

export async function getMainPageRowObject(rowNumber: number) {
  const _mainPageRowObj = new MainPageRowObject();
  _mainPageRowObj.id = +(await element(by.xpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[1]`)).getText());
  _mainPageRowObj.createdAt = await element(by.xpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[2]`)).getText();
  _mainPageRowObj.nameEForm = await element(by.xpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[3]`)).getText();
  const tagsString = await element(by.xpath(`//*[@id="mainPageEFormsTableBody"]//tr[${rowNumber}]/td[4]/div/div[1]`)).getText();
  _mainPageRowObj.tags = tagsString.split(' , ');
  _mainPageRowObj.tagEditBtn = element(by.xpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[4]/div/div[2]/a`));
  _mainPageRowObj.editColumnsBtn = element(by.xpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[6]/div/a`));
  _mainPageRowObj.pairingBtn = element(by.xpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[5]/button`));
  _mainPageRowObj.deleteEFormBtn = element(by.xpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[6]/div/button`));
  const pairedNamesArr: string[] = [];
  await getStringsFromXpath(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNumber}]/td[5]/span`, pairedNamesArr);
  _mainPageRowObj.pairedNames = pairedNamesArr;
  return _mainPageRowObj;
}
