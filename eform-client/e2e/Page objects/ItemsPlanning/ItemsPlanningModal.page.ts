import Page from '../Page';
import itemsPlanningPlanningPage, {
  PlanningCreateUpdate,
} from './ItemsPlanningPlanningPage';
import {selectDateOnDatePicker, selectValueInNgSelector} from '../../Helpers/helper-functions';

export class ItemsPlanningModalPage extends Page {
  constructor() {
    super();
  }

  // Create page elements
  public async createPlanningItemName(
    index: number
  ): Promise<WebdriverIO.Element> {
    const ele = await $(`#createPlanningNameTranslation_${index}`);
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async createPlanningSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#createPlanningSelector');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async createPlanningItemDescription(): Promise<WebdriverIO.Element> {
    const ele = await $('#createPlanningItemDescription');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async createRepeatEvery(): Promise<WebdriverIO.Element> {
    const ele = await $('#createRepeatEvery');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  // @ts-ignore
  public async selectFolder(nameFolder: string) {
    await browser.pause(1000);
    if (await (await this.createFolderName()).isExisting()) {
      await (await this.createFolderName()).click();
    } else {
      await (await this.editFolderName()).click();
    }
    await browser.pause(1000);
    const treeViewport = await $('app-eform-tree-view-picker');
    await treeViewport.waitForDisplayed({ timeout: 20000 });
    await (await $(`.folder-tree-name=${nameFolder}`)).click();
    await treeViewport.waitForDisplayed({ timeout: 2000, reverse: true });
  }

  public async createFolderName(): Promise<WebdriverIO.Element> {
    const ele = await $('#createFolderSelector');
    // ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async editFolderName(): Promise<WebdriverIO.Element> {
    const ele = await $('#editFolderSelector');
    // ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async createRepeatUntil(): Promise<WebdriverIO.Element> {
    const ele = await $('#createRepeatUntil');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async planningCreateSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#planningCreateSaveBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async planningCreateCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#planningCreateCancelBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async createPlanningTagsSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#createPlanningTagsSelector');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async createStartFrom(): Promise<WebdriverIO.Element> {
    const ele = await $('#createStartFrom');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async createItemNumber(): Promise<WebdriverIO.Element> {
    const ele = await $('#createItemNumber');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async createItemLocationCode(): Promise<WebdriverIO.Element> {
    const ele = await $('#createItemLocationCode');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async createItemBuildYear(): Promise<WebdriverIO.Element> {
    const ele = await $('#createItemBuildYear');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async createItemType(): Promise<WebdriverIO.Element> {
    const ele = await $('#createItemType');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }
  // Edit page elements
  public async editPlanningItemName(
    index: number
  ): Promise<WebdriverIO.Element> {
    const ele = await $(`#editPlanningNameTranslation_${index}`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async editPlanningSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#editPlanningSelector');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async editPlanningTagsSelector(): Promise<WebdriverIO.Element> {
    // ele.waitForDisplayed({timeout: 20000});
    // ele.waitForClickable({timeout: 20000});
    return $('#editPlanningTagsSelector');
  }
  public async editItemNumber(): Promise<WebdriverIO.Element> {
    const ele = await $('#editItemNumber');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async editPlanningDescription(): Promise<WebdriverIO.Element> {
    const ele = await $('#editPlanningItemDescription');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async editRepeatEvery(): Promise<WebdriverIO.Element> {
    const ele = await $('#editRepeatEvery');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async planningId(): Promise<WebdriverIO.Element> {
    const ele = await $('#planningId');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editRepeatType(): Promise<WebdriverIO.Element> {
    const ele = await $('#editRepeatType');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async editRepeatUntil(): Promise<WebdriverIO.Element> {
    const ele = await $('#editRepeatUntil');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async editStartFrom(): Promise<WebdriverIO.Element> {
    const ele = await $('#editStartFrom');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async editItemLocationCode(): Promise<WebdriverIO.Element> {
    const ele = await $('#editItemLocationCode');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async editItemBuildYear(): Promise<WebdriverIO.Element> {
    const ele = await $('#editItemBuildYear');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async editItemType(): Promise<WebdriverIO.Element> {
    const ele = await $('#editItemType');
    await ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async planningEditSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#planningEditSaveBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async planningEditCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#planningEditCancelBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  // Add item elements
  public async addItemBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#addItemBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  // Delete page elements
  public async planningDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#planningDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async planningDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const cancelBtn = await $('#planningDeleteCancelBtn');
    await cancelBtn.waitForDisplayed({ timeout: 20000 });
    await cancelBtn.waitForClickable({ timeout: 20000 });
    return cancelBtn;
  }

  public async xlsxImportPlanningsInput(): Promise<WebdriverIO.Element> {
    return $('#xlsxImportPlanningsInput');
  }

  public async pushMessageEnabledCreate(): Promise<WebdriverIO.Element> {
    const ele = await $('#pushMessageEnabledCreate');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async createDaysBeforeRedeploymentPushMessage(): Promise<WebdriverIO.Element> {
    const ele = await $('#createDaysBeforeRedeploymentPushMessage');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async pushMessageEnabledEdit(): Promise<WebdriverIO.Element> {
    const ele = await $('#pushMessageEnabledEdit');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editDaysBeforeRedeploymentPushMessage(): Promise<WebdriverIO.Element> {
    const ele = await $('#editDaysBeforeRedeploymentPushMessage');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async createRepeatType(): Promise<WebdriverIO.Element> {
    const ele = await $('#createRepeatType');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async createPlanning(
    planning: PlanningCreateUpdate,
    clickCancel = false
  ) {
    await (await itemsPlanningPlanningPage.planningCreateBtn()).click();
    await (await this.planningCreateSaveBtn()).waitForDisplayed();
    var spinner = await $('#spinner-animation');
    await spinner.waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(1000);
    for (let i = 0; i < planning.name.length; i++) {
      await (await this.createPlanningItemName(i)).setValue(planning.name[i]);
    }
    if (planning.description) {
      await (await this.createPlanningItemDescription()).setValue(
        planning.description
      );
    }
    // if (planning.eFormName) {
    await selectValueInNgSelector(await this.createPlanningSelector(), planning.eFormName);
    // }
    if (planning.tags && planning.tags.length > 0) {
      for (let i = 0; i < planning.tags.length; i++) {
        await (await this.createPlanningTagsSelector()).addValue(
          planning.tags[i]
        );
        await browser.keys(['Return']);
      }
    }
    if (planning.repeatEvery) {
      await (await $('input.createRepeatEvery')).setValue(planning.repeatEvery);
    }
    if (planning.repeatType) {
      await selectValueInNgSelector(await this.createRepeatType(), planning.repeatType);
    }
    if (planning.startFrom) {
      await (await this.createStartFrom()).click();
      await selectDateOnDatePicker(
        planning.startFrom.year,
        planning.startFrom.month,
        planning.startFrom.day
      );
    }
    if (planning.repeatUntil) {
      await (await this.createRepeatUntil()).click();
      await selectDateOnDatePicker(
        planning.repeatUntil.year,
        planning.repeatUntil.month,
        planning.repeatUntil.day
      );
    }
    if (planning.number) {
      await (await this.createItemNumber()).setValue(planning.number);
    }
    if (planning.locationCode) {
      await (await this.createItemLocationCode()).setValue(
        planning.locationCode
      );
    }
    if (planning.buildYear) {
      await (await this.createItemBuildYear()).setValue(planning.buildYear);
    }
    if (planning.type) {
      await (await this.createItemType()).setValue(planning.type);
    }
    if (planning.pushMessageEnabled != null) {
      const status = planning.pushMessageEnabled ? 'Aktiveret' : 'Deaktiveret';
      await selectValueInNgSelector(await this.pushMessageEnabledCreate(), status);
      await selectValueInNgSelector(
        await this.createDaysBeforeRedeploymentPushMessage(), planning.daysBeforeRedeploymentPushMessage.toString());
    }
    if (planning.folderName) {
      await this.selectFolder(planning.folderName);
    }
    if (!clickCancel) {
      await (await this.planningCreateSaveBtn()).click();
    } else {
      await (await this.planningCreateCancelBtn()).click();
    }
    await (await itemsPlanningPlanningPage.planningCreateBtn()).waitForDisplayed();
  }

  public async addNewItem() {
    await (await this.addItemBtn()).click();
  }
}

const itemsPlanningModalPage = new ItemsPlanningModalPage();
export default itemsPlanningModalPage;

export class PlanningItemRowObject {
  constructor() {}

  public name;
  public description;
  public number;
  public locationCode;
  public deleteBtn;

  async getRow(rowNum: number): Promise<PlanningItemRowObject> {
    this.name = $$('#createItemName')[rowNum - 1].getText();
    this.description = $$('#createItemDescription')[rowNum - 1].getText();
    this.number = $$('#createItemNumber')[rowNum - 1].getText();
    this.locationCode = $$('#createItemLocationCode')[rowNum - 1].getText();
    this.deleteBtn = $$('#deleteItemBtn')[rowNum - 1];

    return this;
  }

  public async deleteItem() {
    await this.deleteBtn.click();
    await browser.pause(500);
  }
}
