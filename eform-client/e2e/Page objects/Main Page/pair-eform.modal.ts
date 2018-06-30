import {PairingModalRowObject} from './pairingModal.row-object';
import {$, by, element, ElementFinder} from 'protractor';

export class PairEformModal {
  public pairEformRowObjects: PairingModalRowObject[] = [];
  public checkedPairEformRowObjects: PairingModalRowObject[] = [];
  public uncheckedPairEformRowObjects: PairingModalRowObject[] = [];
  public saveBtn: ElementFinder;
  public cancelBtn: ElementFinder;
  public pairedEformRowObjectsNames: string[] = [];

  async getPairingModalRowObj(rowNumber: number) {
    const rowObj = new PairingModalRowObject();
    rowObj.microtingId = await element(by.xpath(`//*[@id="pairingModalTableBody"]/tr[${rowNumber}]/td[1]`)).getText();
    rowObj.userDeviceName = await element(by.xpath(`//*[@id="pairingModalTableBody"]/tr[${rowNumber}]/td[2]`)).getText();
    rowObj.checkToPairChbx = await element(by.xpath(`//*[@id="pairingModalTableBody"]/tr[${rowNumber}]/td[3]/div[${rowNumber}]/div/input`));
    rowObj.paired = await rowObj.checkToPairChbx.isSelected();
    return rowObj;
  }

  async getAllPairingModalRowObjects() {
    const pairingModalRowObjNum = await element.all(by.xpath('//*[@id="pairingModalTableBody"]/tr')).count();
    for (let i = 1; i <= pairingModalRowObjNum; i++) {
      this.pairEformRowObjects.push(await this.getPairingModalRowObj(i));
    }
    this.checkedPairEformRowObjects = this.pairEformRowObjects.filter(obj => obj.paired === true);
    this.uncheckedPairEformRowObjects = this.pairEformRowObjects.filter(obj => obj.paired === false);
  }

  constructor() {
    this.saveBtn = $('#pairingModalSaveBtn');
    this.cancelBtn = $('#pairingModalCancelBtn');
  }

}
