import itemsPlanningModalPage from './ItemsPlanningModal.page';
import { PageWithNavbarPage } from '../PageWithNavbar.page';
import {
  generateRandmString,
  selectDateOnDatePicker, selectValueInNgSelector,
} from '../../Helpers/helper-functions';
import {format, set} from 'date-fns';
import {customDaLocale} from '../../../src/app/common/const';

export class ItemsPlanningPlanningPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length;
  }

  public async planningDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const el = await itemsPlanningModalPage.planningDeleteDeleteBtn();
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 40000 });
    return el;
  }

  public async planningDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const el = await itemsPlanningModalPage.planningDeleteCancelBtn();
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 40000 });
    return el;
  }

  public async clickIdTableHeader() {
    await (await $('th.planningId')).click();
    await browser.pause(500);
  }

  public async clickNameTableHeader() {
    await (await $('th.planningName')).click();
    await browser.pause(500);
  }

  public async clickDescriptionTableHeader() {
    await (await $('th.planningDescription')).click();
    await browser.pause(500);
  }

  public async itemPlanningButton() {
    const el = await $('#items-planning-pn');
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 40000 });
    return el;
  }

  public async planningCreateBtn() {
    const el = await $('#planningCreateBtn');
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 90000 });
    return el;
  }

  public async planningManageTagsBtn() {
    const el = await $('#planningManageTagsBtn');
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 40000 });
    return el;
  }

  public async planningsButton() {
    const el = await $('#items-planning-pn-plannings');
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 40000 });
    return el;
  }

  public async planningId() {
    const el = await $('#planningId');
    await el.waitForDisplayed({ timeout: 40000 });
    return el;
  }
  public async deleteMultiplePluginsBtn() {
    const ele = await $('#deleteMultiplePluginsBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async planningsMultipleDeleteCancelBtn() {
    const ele = await $('#planningsMultipleDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async planningsMultipleDeleteDeleteBtn() {
    const ele = await $('#planningsMultipleDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async selectAllPlanningsCheckbox() {
    const ele = await $('th.mat-column-MtxGridCheckboxColumnDef mat-checkbox');
    // ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async selectAllPlanningsCheckboxForClick() {
    return (await this.selectAllPlanningsCheckbox()).$('..');
  }

  public async importPlanningsBtn() {
    const ele = await $('#importPlanningsBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async goToPlanningsPage() {
    await (await this.itemPlanningButton()).click();
    await (await this.planningsButton()).click();
    await this.planningCreateBtn();
  }

  public async getPlaningByName(namePlanning: string) {
    for (let i = 1; i < (await this.rowNum()) + 1; i++) {
      const planningObj = new PlanningRowObject();
      const planning = await planningObj.getRow(i);
      if (planning.name === namePlanning) {
        return planning;
      }
    }
    return null;
  }

  public async createDummyPlannings(
    template,
    folderName,
    createCount = 3
  ): Promise<PlanningCreateUpdate[]> {
    const masResult = new Array<PlanningCreateUpdate>();
    for (let i = 0; i < createCount; i++) {
      const planningData: PlanningCreateUpdate = {
        name: [
          generateRandmString(),
          generateRandmString(),
          generateRandmString(),
        ],
        eFormName: template,
        description: generateRandmString(),
        repeatEvery: '1',
        repeatType: 'Dag',
        repeatUntil: { year: 2020, day: 15, month: 5 },
        folderName: folderName,
      };
      masResult.push(planningData);
      await itemsPlanningModalPage.createPlanning(planningData);
    }
    return masResult;
  }

  public async clearTable(deleteWithMultipleDelete: boolean = true) {
    if (deleteWithMultipleDelete) {
      await this.selectAllPlanningsForDelete();
      await this.multipleDelete();
    } else {
      await browser.pause(2000);
      const rowCount = await this.rowNum();
      for (let i = 1; i <= rowCount; i++) {
        await (await this.getFirstPlanningRowObject()).delete();
      }
    }
  }

  async getAllPlannings(countFirstElements = 0): Promise<PlanningRowObject[]> {
    await browser.pause(1000);
    const resultMas = new Array<PlanningRowObject>();
    if (countFirstElements === 0) {
      countFirstElements = await this.rowNum();
    }
    for (let i = 1; i < countFirstElements + 1; i++) {
      resultMas.push(await new PlanningRowObject().getRow(i));
    }
    return resultMas;
  }

  async getLastPlanningRowObject(): Promise<PlanningRowObject> {
    return await new PlanningRowObject().getRow(await this.rowNum());
  }

  async getFirstPlanningRowObject(): Promise<PlanningRowObject> {
    return await new PlanningRowObject().getRow(1);
  }

  async getPlanningByIndex(i: number): Promise<PlanningRowObject> {
    return await new PlanningRowObject().getRow(i);
  }

  async openMultipleDelete() {
    if (await (await this.deleteMultiplePluginsBtn()).isClickable()) {
      await (await this.deleteMultiplePluginsBtn()).click();
    }
  }

  async closeMultipleDelete(clickCancel = false) {
    if (clickCancel) {
      await (await this.planningsMultipleDeleteCancelBtn()).click();
    } else {
      await (await this.planningsMultipleDeleteDeleteBtn()).click();
    }
    await (await this.planningCreateBtn()).waitForDisplayed({ timeout: 40000 });
  }

  async multipleDelete(clickCancel = false) {
    await this.openMultipleDelete();
    await this.closeMultipleDelete(clickCancel);
  }

  async selectAllPlanningsForDelete(valueCheckbox = true, pickOne = false) {
    if (!pickOne) {
      if (
        (await (await this.selectAllPlanningsCheckbox()).getValue()) !==
        valueCheckbox.toString()
      ) {
        await (await this.selectAllPlanningsCheckboxForClick()).click();
      }
    } else {
      const plannings = await this.getAllPlannings();
      for (let i = 0; i < plannings.length; i++) {
        await plannings[i].clickOnCheckboxForMultipleDelete();
      }
    }
  }
}

const itemsPlanningPlanningPage = new ItemsPlanningPlanningPage();
export default itemsPlanningPlanningPage;

export class PlanningRowObject {
  constructor() {}

  public row: WebdriverIO.Element;
  public id: number;
  public name: string;
  public description: string;
  public folderName: string;
  public eFormName: string;
  public tags: string[];
  public repeatEvery: number;
  public repeatType: string;
  public repeatUntil: Date;
  public planningDayOfWeek: string;
  public nextExecution: string;
  public lastExecution: string;
  public updateBtn: WebdriverIO.Element;
  public deleteBtn: WebdriverIO.Element;
  public pairingBtn: WebdriverIO.Element;
  public checkboxDelete: WebdriverIO.Element;
  public checkboxDeleteForClick: WebdriverIO.Element;

  public static async closeEdit(clickCancel = false) {
    if (!clickCancel) {
      await (await itemsPlanningModalPage.planningEditSaveBtn()).click();
      await itemsPlanningModalPage.waitForSpinnerHide();
    } else {
      await (await itemsPlanningModalPage.planningEditCancelBtn()).click();
    }
    await browser.pause(500);
    await (await itemsPlanningPlanningPage.planningCreateBtn()).waitForDisplayed();
  }

  public static async planningCreateBtn() {
    const el = await $('#planningCreateBtn');
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 90000 });
    return el;
  }

  public static async closeDelete(clickCancel = false) {
    if (!clickCancel) {
      await (await itemsPlanningPlanningPage.planningDeleteDeleteBtn()).click();
    } else {
      await (await itemsPlanningPlanningPage.planningDeleteCancelBtn()).click();
    }
    await browser.pause(500);
    await (await this.planningCreateBtn()).waitForDisplayed({ timeout: 40000 });
  }

  async getRow(rowNum: number): Promise<PlanningRowObject> {
    rowNum = rowNum - 1;
    this.row = await $$('tbody > tr')[rowNum];
    if (this.row) {
      this.checkboxDelete = await this.row.$('.cdk-column-MtxGridCheckboxColumnDef mat-checkbox');
      this.checkboxDeleteForClick = await this.row.$('.cdk-column-MtxGridCheckboxColumnDef mat-checkbox label');
      this.id = +(await (await this.row.$('.cdk-column-id span')).getText());
      this.name = (await (await this.row.$('.cdk-column-translatedName span')).getText());
      this.description = (await (await this.row.$('.cdk-column-description span')).getText());
      this.folderName = (await (await this.row.$('.cdk-column-folder-eFormSdkFolderName span')).getText());
      this.eFormName = (await (await this.row.$('.cdk-column-planningRelatedEformName span')).getText());

      const tags = (await (await this.row.$('.cdk-column-tags')).getText()).split('discount');
      if(tags.length > 0) {
        tags[tags.length - 1] = tags[tags.length - 1].replace('edit', '');
        this.tags = tags.filter(x => x); // delete empty strings
      }

      this.repeatEvery = +(await (await this.row.$('.cdk-column-reiteration-repeatEvery span')).getText());
      this.repeatType = (await (await this.row.$('.cdk-column-reiteration-repeatType span')).getText());
      this.planningDayOfWeek = (await (await this.row.$('.cdk-column-reiteration-dayOfWeek span')).getText());
      this.lastExecution = (await (await this.row.$('.cdk-column-lastExecutedTime span')).getText());
      this.nextExecution = (await (await this.row.$('.cdk-column-nextExecutionTime span')).getText());
      // const date = row.$('#planningRepeatUntil').getText();
      // this.repeatUntil = parse(date, 'dd.MM.yyyy HH:mm:ss', new Date());
      this.pairingBtn = await this.row.$$('.cdk-column-actions button')[0];
      this.updateBtn = await this.row.$$('.cdk-column-actions button')[1];
      this.deleteBtn = await this.row.$$('.cdk-column-actions button')[2];
    }
    return this;
  }

  public async openDelete() {
    await this.deleteBtn.waitForClickable({ timeout: 40000 });
    await this.deleteBtn.click();
    (
      await itemsPlanningPlanningPage.planningDeleteDeleteBtn()
    ).waitForDisplayed({
      timeout: 40000,
    });
  }

  public async openEdit() {
    await this.updateBtn.click();
    await (await itemsPlanningModalPage.planningEditSaveBtn()).waitForDisplayed(
      {
        timeout: 40000,
      }
    );
  }

  async update(
    planning: PlanningCreateUpdate,
    clearTags = false,
    clickCancel = false
  ) {
    await this.openEdit();
    if (planning.name && planning.name.length > 0) {
      for (let i = 0; i < planning.name.length; i++) {
        if (
          (await (
            await itemsPlanningModalPage.editPlanningItemName(i)
          ).getValue()) !== planning.name[i]
        ) {
          await (await itemsPlanningModalPage.editPlanningItemName(i)).setValue(
            planning.name[i]
          );
        }
      }
    }
    if (
      planning.folderName &&
      (await (
        await (await itemsPlanningModalPage.editFolderName()).$(
          '#editFolderSelectorInput'
        )
      ).getValue()) !== planning.folderName
    ) {
      await itemsPlanningModalPage.selectFolder(planning.folderName);
    }
    if (
      planning.eFormName &&
      (await (
        await (await itemsPlanningModalPage.editPlanningSelector()).$(
          '.ng-value'
        )
      ).getText()) !== planning.eFormName
    ) {
      await selectValueInNgSelector(await itemsPlanningModalPage.editPlanningSelector(), planning.eFormName);
    }
    if (clearTags) {
      const clearButton = await (
        await itemsPlanningModalPage.editPlanningTagsSelector()
      ).$('span.ng-clear');
      if (await clearButton.isExisting()) {
        await clearButton.click();
      }
    }
    if (planning.tags && planning.tags.length > 0) {
      for (let i = 0; i < planning.tags.length; i++) {
        await (
          await itemsPlanningModalPage.editPlanningTagsSelector()
        ).addValue(planning.tags[i]);
        await browser.keys(['Return']);
      }
    }
    if (
      planning.repeatEvery &&
      (await (await itemsPlanningModalPage.editRepeatEvery()).getValue()) !==
        planning.repeatEvery
    ) {
      await (await itemsPlanningModalPage.editRepeatEvery()).setValue(
        planning.repeatEvery
      );
    }
    if (
      planning.repeatType &&
      (await (
        await (await itemsPlanningModalPage.editRepeatType()).$(
          '.ng-value-label'
        )
      ).getText()) !== planning.repeatType
    ) {
      await selectValueInNgSelector(await itemsPlanningModalPage.editRepeatType(), planning.repeatType);
    }
    if (
      planning.repeatUntil &&
      (await (await itemsPlanningModalPage.editRepeatUntil()).getValue()) !==
      format(set(new Date(), {
        year: planning.repeatUntil.year,
        month: planning.repeatUntil.month - 1,
        date: planning.repeatUntil.day,
      }), 'P', {locale: customDaLocale})
    ) {
      await (await itemsPlanningModalPage.editRepeatUntil()).click();
      await selectDateOnDatePicker(
        planning.repeatUntil.year,
        planning.repeatUntil.month,
        planning.repeatUntil.day
      );
    }
    if (
      planning.startFrom &&
      (await (await itemsPlanningModalPage.editStartFrom()).getValue()) !==
      format(set(new Date(), {
        year: planning.startFrom.year,
        month: planning.startFrom.month - 1,
        date: planning.startFrom.day,
      }), 'P', {locale: customDaLocale})
    ) {
      await (await itemsPlanningModalPage.editStartFrom()).click();
      await selectDateOnDatePicker(
        planning.startFrom.year,
        planning.startFrom.month,
        planning.startFrom.day
      );
    }
    if (
      planning.number &&
      (await (await itemsPlanningModalPage.editItemNumber()).getValue()) !==
        planning.number
    ) {
      await (await itemsPlanningModalPage.editItemNumber()).setValue(
        planning.number
      );
    }
    if (
      planning.description &&
      (await (
        await itemsPlanningModalPage.editPlanningDescription()
      ).getValue()) !== planning.description
    ) {
      await (await itemsPlanningModalPage.editPlanningDescription()).setValue(
        planning.description
      );
    }
    if (
      planning.locationCode &&
      (await (
        await itemsPlanningModalPage.editItemLocationCode()
      ).getValue()) !== planning.locationCode
    ) {
      await (await itemsPlanningModalPage.editItemLocationCode()).setValue(
        planning.locationCode
      );
    }
    if (
      planning.buildYear &&
      (await (await itemsPlanningModalPage.editItemBuildYear()).getValue()) !==
        planning.buildYear
    ) {
      await (await itemsPlanningModalPage.editItemBuildYear()).setValue(
        planning.buildYear
      );
    }
    if (
      planning.type &&
      (await (await itemsPlanningModalPage.editItemType()).getValue()) !==
        planning.type
    ) {
      await (await itemsPlanningModalPage.editItemType()).setValue(
        planning.type
      );
    }
    if (planning.pushMessageEnabled != null) {
      const status = planning.pushMessageEnabled ? 'Aktiveret' : 'Deaktiveret';
      await selectValueInNgSelector(await itemsPlanningModalPage.pushMessageEnabledEdit(), status);
      await selectValueInNgSelector(
        await itemsPlanningModalPage.editDaysBeforeRedeploymentPushMessage(), planning.daysBeforeRedeploymentPushMessage.toString());
    }
    await PlanningRowObject.closeEdit(clickCancel);
  }

  async delete(clickCancel = false) {
    await this.openDelete();
    await PlanningRowObject.closeDelete(clickCancel);
  }

  async clickOnCheckboxForMultipleDelete(valueCheckbox = true) {
    if ((await this.checkboxDelete.getValue()) !== valueCheckbox.toString()) {
      await this.checkboxDeleteForClick.click();
    }
  }

  async readPairing(): Promise<{ workerName: string; workerValue: boolean }[]> {
    await this.pairingBtn.click();
    await browser.pause(500);
    const changeAssignmentsCancel = await $('#changeAssignmentsCancel');
    await changeAssignmentsCancel.waitForClickable({
      timeout: 40000,
    });
    let pairings: { workerName: string; workerValue: boolean }[] = [];
    const pairingRows = await $$('#pairingModalTableBody tr.mat-row');
    for (let i = 0; i < pairingRows.length; i++) {
      const workerName = await (await pairingRows[i].$('.mat-column-siteName span')).getText();
      const workerValue = (await (await pairingRows[i].$('.mat-column-select .mat-checkbox-input')).getAttribute('aria-checked')) === 'true'
      pairings = [...pairings, { workerName, workerValue }];
    }
    await changeAssignmentsCancel.click();
    return pairings;
  }
}

export class PlanningCreateUpdate {
  public name: string[];
  public folderName: string;
  public eFormName: string;
  public tags?: string[];
  public repeatEvery?: string;
  public repeatType?: string;
  public startFrom?: { month: number; day: number; year: number };
  public repeatUntil?: { month: number; day: number; year: number };
  public number?: string;
  public description?: string;
  public locationCode?: string;
  public buildYear?: string;
  public type?: string;
  public pushMessageEnabled?: boolean;
  public daysBeforeRedeploymentPushMessage?: number;
}
