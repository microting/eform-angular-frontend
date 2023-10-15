import { PageWithNavbarPage } from '../PageWithNavbar.page';
import itemsPlanningPlanningPage from './ItemsPlanningPlanningPage';
import { DeviceUsersRowObject } from '../DeviceUsers.page';

export class ItemsPlanningPairingPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async pairingBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#items-planning-pn-pairing');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async goToPairingPage() {
    await (await itemsPlanningPlanningPage.itemPlanningButton()).click();
    await (await this.pairingBtn()).click();
    await (await this.savePairingGridBtn()).waitForDisplayed();
  }

  public async countPlanningRow(): Promise<number> {
    await browser.pause(500);
    return (await $$('#planningName')).length;
  }

  public async savePairingGridBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#savePairingGridBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async updatePairingsSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#updatePairingsSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async updatePairingsSaveCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#updatePairingsSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async savePairing(clickCancel = false) {
    await browser.pause(5000);
    await (await this.savePairingGridBtn()).click();
    if (clickCancel) {
      await (await this.updatePairingsSaveCancelBtn()).click();
    } else {
      await (await this.updatePairingsSaveBtn()).click();
    }
    await this.savePairingGridBtn();
  }

  public async countDeviceUserCol(): Promise<number> {
    await browser.pause(500);
    const count = (await $$('.mat-header-cell')).length;
    return count > 0 ? count - 1 : 0;
  }

  public async planningRowByPlanningName(
    planningName: string
  ): Promise<PairingRowObject> {
    for (let i = 1; i < (await this.countPlanningRow()) + 1; i++) {
      const pairObj = new PairingRowObject();
      const element = await pairObj.getRow(i);
      if (element.planningName === planningName) {
        return element;
      }
    }
    return null;
  }

  async getDeviceUserByIndex(index: number): Promise<PairingColObject> {
    if (index > 0 && index <= (await this.countDeviceUserCol())) {
      const obj = new PairingColObject();
      return await obj.getRow(index);
    }
    return null;
  }

  async getPlanningByIndex(index: number): Promise<PairingRowObject> {
    if (index > 0 && index <= (await this.countPlanningRow())) {
      const obj = new PairingRowObject();
      return await obj.getRow(index);
    }
    return null;
  }

  public async indexColDeviceUserInTableByName(
    deviceUserName: string
  ): Promise<number> {
    for (let i = 0; i < (await this.countDeviceUserCol()); i++) {
      const deviceUser = await this.getDeviceUserByIndex(i);
      if (deviceUser.deviceUserName === deviceUserName) {
        return i;
      }
    }
    return -1;
  }
}

const itemsPlanningPairingPage = new ItemsPlanningPairingPage();
export default itemsPlanningPairingPage;

export class PairingRowObject {
  constructor() {}

  public planningName: string;
  public pairRow: WebdriverIO.Element;
  public pairRowForClick: WebdriverIO.Element;
  public pairCheckboxes: WebdriverIO.Element[];
  public pairCheckboxesForClick: WebdriverIO.Element[];
  public row: WebdriverIO.Element;

  async getRow(rowNum: number): Promise<PairingRowObject> {
    this.row = (await $$('tbody tr'))[rowNum - 1];
    if (this.row) {
      this.planningName = await (await this.row.$('#planningName')).getText();
      this.pairRow = await this.row.$(`#planningRowCheckbox${rowNum - 1}`);
      this.pairRowForClick = await this.pairRow.$('label');
      this.pairCheckboxes = [];
      browser.pause(1000);
      for (
        let i = 0;
        i < (await itemsPlanningPairingPage.countDeviceUserCol()) - 1;
        i++
      ) {
        this.pairCheckboxes = [...this.pairCheckboxes, await $(`#deviceUserCheckbox${rowNum - 1}_planning${i}`)];
      }
      this.pairCheckboxesForClick = [];
      for (let i = 0; i < this.pairCheckboxes.length; i++) {
        this.pairCheckboxesForClick = [...this.pairCheckboxesForClick, await this.pairCheckboxes[i].$('label')];
      }
    } else {
      return null;
    }
    return this;
  }

  public async pairWhichAllDeviceUsers(
    pair: boolean,
    clickOnPairRow = false,
    clickCancel = false
  ) {
    if (clickOnPairRow) {
      await this.pairRowForClick.click();
      if ((await (await this.pairRow.$('input')).getProperty('checked')) !== pair) {
        await this.pairRowForClick.click();
      }
    } else {
      for (let i = 0; i < this.pairCheckboxesForClick.length; i++) {
        if ((await (await this.pairCheckboxes[i].$('input')).getProperty('checked')) !== pair) {
          await this.pairCheckboxesForClick[i].click();
        }
      }
    }
    await itemsPlanningPairingPage.savePairing(clickCancel);
  }

  public async pairWithOneDeviceUser(
    pair: boolean,
    indexDeviceForPair: number,
    clickCancel = false
  ) {
    // if (
    //   (await this.pairCheckboxes[indexDeviceForPair].getValue()) !==
    //   pair.toString()
    // ) {
      await this.pairCheckboxesForClick[indexDeviceForPair].click();
    // }
    await browser.pause(1000);
    await itemsPlanningPairingPage.savePairing(clickCancel);
  }

  public async isPair(deviceUser: DeviceUsersRowObject): Promise<boolean> {
    const index = await itemsPlanningPairingPage.indexColDeviceUserInTableByName(
      `${deviceUser.firstName} ${deviceUser.lastName}`
    );
    return Boolean(await (await this.pairCheckboxes[index - 1].$('input')).getProperty('checked')) as boolean;
  }
}

export class PairingColObject {
  constructor() {}

  public deviceUserName: string;
  public pairCol: WebdriverIO.Element;
  public pairColForClick: WebdriverIO.Element;
  public pairCheckboxesForClick: WebdriverIO.Element[];
  public pairCheckboxes: WebdriverIO.Element[];

  async getRow(rowNum: number): Promise<PairingColObject> {
    const ele = await (await $$('.mat-header-cell'))[rowNum];
    await ele.waitForDisplayed({ timeout: 20000 });
    if (await ele.isExisting()) {
      this.deviceUserName = await (await ele.$('.mat-checkbox-label')).getText();
      this.pairCol = await ele.$('mat-checkbox');
      this.pairColForClick = await this.pairCol.$('label');
      this.pairCheckboxesForClick = [];
      this.pairCheckboxes = [];
      for (
        let i = 0;
        i < (await itemsPlanningPairingPage.countPlanningRow());
        i++
      ) {
        this.pairCheckboxes.push(
          await $(`#deviceUserCheckbox${i}_planning${rowNum - 1}`)
        );
      }
      for (let i = 0; i < this.pairCheckboxes.length; i++) {
        this.pairCheckboxesForClick.push(await this.pairCheckboxes[i].$('label'));
      }
    }
    return this;
  }
  public async pairWhichAllPlannings(
    pair: boolean,
    clickOnPairRow = false,
    clickCancel = false
  ) {
    if (clickOnPairRow) {
      await this.pairColForClick.click();
      if ((await (await this.pairCol.$('input')).getProperty('checked')) !== pair) {
        await this.pairColForClick.click();
      }
    } else {
      for (let i = 0; i < this.pairCheckboxesForClick.length; i++) {
        if ((await (await this.pairCheckboxes[i].$('input')).getProperty('checked')) !== pair) {
          await this.pairCheckboxesForClick[i].click();
        }
      }
    }
    await itemsPlanningPairingPage.savePairing(clickCancel);
  }
}
