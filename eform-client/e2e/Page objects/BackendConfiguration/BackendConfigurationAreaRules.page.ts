import Page from '../Page';
import {selectDateOnDatePicker, selectValueInNgSelector} from '../../Helpers/helper-functions';

export class BackendConfigurationAreaRulesPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#mainTable tbody > tr')).length;
  }

  public async ruleCreateBtn() {
    const ele = await $('#ruleCreateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createAreaRulesString() {
    const ele = await $('#createAreaRulesString');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaRulesGenerateBtn() {
    const ele = await $('#areaRulesGenerateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaRuleCreateSaveCancelBtn() {
    const ele = await $('#areaRuleCreateSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaRuleCreateSaveBtn() {
    const ele = await $('#areaRuleCreateSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createRuleType(i: number) {
    return $(`#createRuleType${i}`);
  }

  public async createRuleAlarm(i: number) {
    return $(`#createRuleAlarm${i}`);
  }

  public async createAreaDayOfWeek(i: number) {
    return $(`#createAreaDayOfWeek${i}`);
  }

  public async newAreaRulesDayOfWeek() {
    return $(`#newAreaRulesDayOfWeek`);
  }

  public async createAreasDayOfWeek() {
    return $(`#createAreasDayOfWeek`);
  }

  public async createRuleEformId(i: number) {
    return $(`#createRuleEformId${i}`);
  }

  public async areaRuleDeleteDeleteBtn() {
    const ele = await $('#areaRuleDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaRuleDeleteCancelBtn() {
    const ele = await $('#areaRuleDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaRuleEditSaveBtn() {
    const ele = await $('#areaRuleEditSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaRuleEditSaveCancelBtn() {
    const ele = await $('#areaRuleEditSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editRuleName(i: number) {
    const ele = await $(`#editRuleName${i}`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editRuleEformId() {
    return $('#editRuleEformId');
  }

  public async editRuleType() {
    return $('#editRuleType');
  }

  public async editRuleAlarm() {
    return $('#editRuleAlarm');
  }

  public async editAreaRuleDayOfWeek() {
    return $('#editAreaRuleDayOfWeek');
  }

  public async updateAreaRulePlanningSaveBtn() {
    const ele = await $(`#updateAreaRulePlanningSaveBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async updateAreaRulePlanningSaveCancelBtn() {
    const ele = await $(`#updateAreaRulePlanningSaveCancelBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async planAreaRuleStatusToggle() {
    return $(`#planAreaRuleStatusToggle-input`);
  }

  public async planAreaRuleNotificationsToggle() {
    return $(`#planAreaRuleNotificationsToggle-input`);
  }

  public async planAreaRuleComplianceEnableToggle() {
    return $(`#planAreaRuleComplianceEnableToggle-input`);
  }

  public async planRepeatEvery() {
    return $(`#planRepeatEvery`);
  }

  public async planRepeatType() {
    return $(`#planRepeatType`);
  }

  public async planStartFrom() {
    return $(`#planStartFrom`);
  }

  public async checkboxCreateAssignment(i: number) {
    //return $(`#mat-checkbox-${i}`);
    return $(`#checkboxCreateAssignment${i}-input`);
  }

  public async updateEntityList() {
    const ele = await $(`.updateEntityList`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entityListSaveBtn() {
    const ele = await $(`#entityListSaveBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entityListSaveCancelBtn() {
    const ele = await $(`#entityListSaveCancelBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async addSingleEntitySelectableItem() {
    const ele = await $(`#addSingleEntitySelectableItem`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entityItemEditNameBox() {
    const ele = await $(`#entityItemEditNameBox`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entityItemSaveBtn() {
    const ele = await $(`#entityItemSaveBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entityItemCancelBtn() {
    const ele = await $(`#entityItemCancelBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createEntityItemName(i: number) {
    const ele = await $$(`#createEntityItemName`)[i];
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entityItemEditBtn(i: number) {
    const ele = await $$(`#entityItemEditBtn`)[i];
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entityItemDeleteBtn(i: number) {
    const ele = await $$(`#entityItemDeleteBtn`)[i];
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async getCountEntityListItems(): Promise<number> {
    await browser.pause(500);
    return $$(`#createEntityItemName`).length;
  }

  public async getFirstAreaRuleRowObject(): Promise<AreaRuleRowObject> {
    return await new AreaRuleRowObject().getRow(1);
  }

  public async getLastAreaRuleRowObject(): Promise<AreaRuleRowObject> {
    return await new AreaRuleRowObject().getRow(await this.rowNum());
  }

  public async getAreaRuleRowObjectByIndex(
    index: number
  ): Promise<AreaRuleRowObject> {
    return await new AreaRuleRowObject().getRow(index);
  }

  public async clearTable() {
    await browser.pause(2000);
    const rowCount = await this.rowNum();
    let indexForDelete = 1;
    for (let i = 1; i <= rowCount; i++) {
      const areaRule = await new AreaRuleRowObject().getRow(indexForDelete);
      if (
        areaRule &&
        areaRule.deleteRuleBtn &&
        (await areaRule.deleteRuleBtn.isDisplayed())
      ) {
        await areaRule.delete();
      } else {
        indexForDelete += 1;
      }
    }
  }

  public async createAreaRule(
    areaRule?: AreaRuleCreateUpdate,
    clickCancel = false
  ) {
    await this.openCreateAreaRuleModal(areaRule);
    await this.closeCreateAreaRuleModal(clickCancel);
  }

  public async editEntityList(itemsForCreate?: string[], clickCancel = false) {
    await this.openEntityListModal(itemsForCreate);
    await this.closeEntityListModal(clickCancel);
  }

  public async openEntityListModal(newItems?: string[]) {
    await (await this.updateEntityList()).click()
    await (await this.entityListSaveCancelBtn()).waitForDisplayed({ timeout: 40000 })
    if(newItems) {
      const count = await this.getCountEntityListItems();
      for (let i = 0; i < newItems.length; i++) {
        await (await this.addSingleEntitySelectableItem()).click();
      }
      for (let i = 0; i < newItems.length; i++) {
        await this.editEntityItem(count+i, newItems[i]);
      }
    }
  }

  public async closeEntityListModal(clickCancel = false) {
    if(clickCancel) {
      await (await this.entityListSaveCancelBtn()).click();
    } else {
      await (await this.entityListSaveBtn()).click();
    }
    await (await this.updateEntityList()).waitForClickable({ timeout: 40000 })
  }

  public async editEntityItem(index: number, newName: string, clickCancel = false) {
    await (await this.entityItemEditBtn(index)).click();
    await (await this.entityItemCancelBtn()).waitForDisplayed();
    await (await this.entityItemEditNameBox()).setValue(newName);
    if(clickCancel){
      await (await this.entityItemCancelBtn()).click();
    } else {
      await (await this.entityItemSaveBtn()).click();
    }
    await (await this.entityListSaveCancelBtn()).waitForDisplayed({ timeout: 40000 })
  }

  public async deleteEntityItem(index: number) {
    await (await this.entityItemDeleteBtn(index)).click();
  }

  public async openCreateAreaRuleModal(areaRule?: AreaRuleCreateUpdate) {
    await (await this.ruleCreateBtn()).click();
    await (await this.areaRuleCreateSaveCancelBtn()).waitForClickable({
      timeout: 40000,
    });
    if (areaRule) {
      if (areaRule.name) {
        if (areaRule.dayOfWeek) {
          await selectValueInNgSelector(await this.createAreasDayOfWeek(), areaRule.dayOfWeek)
        }
        await (await this.createAreaRulesString()).setValue(areaRule.name);
        await browser.pause(500);
        await (await this.areaRulesGenerateBtn()).click();
        await browser.pause(500);
        if (areaRule.type) {
          await selectValueInNgSelector(await this.createRuleType(0), areaRule.type)
        }
        if (areaRule.alarm) {
          await selectValueInNgSelector(await this.createRuleAlarm(0), areaRule.alarm);
        }
        // if (areaRule.dayOfWeek) {
        //   await (await (await this.createAreaDayOfWeek(0)).$('input')).setValue(
        //     areaRule.dayOfWeek
        //   );
        //   const value = await (await this.createAreaDayOfWeek(0)).$(
        //     `.ng-option=${areaRule.dayOfWeek}`
        //   );
        //   value.waitForDisplayed({ timeout: 40000 });
        //   await value.click();
        // }
        if (areaRule.eform) {
          await selectValueInNgSelector(await this.createRuleEformId(0), areaRule.eform, true);
        }
      }
    }
  }

  public async closeCreateAreaRuleModal(clickCancel = false) {
    if (clickCancel) {
      await (await this.areaRuleCreateSaveCancelBtn()).click();
    } else {
      await (await this.areaRuleCreateSaveBtn()).click();
    }
    await (await this.ruleCreateBtn()).waitForClickable({ timeout: 40000 });
  }
}

const backendConfigurationAreaRulesPage = new BackendConfigurationAreaRulesPage();
export default backendConfigurationAreaRulesPage;

export class AreaRuleRowObject {
  constructor() {}

  //public row: WebdriverIO.Element;
  public name: string;
  public eform?: string;
  public rulePlanningStatus: boolean;
  public ruleType?: string;
  public ruleAlarm?: string;
  public ruleWeekDay?: string;
  public showAreaRulePlanningBtn: WebdriverIO.Element;
  public editRuleBtn?: WebdriverIO.Element;
  public deleteRuleBtn?: WebdriverIO.Element;

  public async getRow(rowNum: number): Promise<AreaRuleRowObject> {
    rowNum = rowNum - 1;
    this.name = await (await $('#ruleName-'+rowNum)).getText();
    this.rulePlanningStatus =
      (await (await $$('.rulePlanningStatus')[rowNum]).getText()) === 'Til';
    this.showAreaRulePlanningBtn = await $(
      '#showAreaRulePlanningBtn-'+rowNum
    );
    try {
      const ele1 = await $('#ruleEformName-'+rowNum);
      const ele2 = await $('#ruleEformName-'+rowNum);
      const ele3 = await $('#ruleEformName-'+rowNum);
      if (ele1 && (await ele1.isDisplayed())) {
        this.eform = await ele1.getText();
      } else if (ele2 && (await ele2.isDisplayed())) {
        this.eform = await ele2.getText();
      } else if (ele3 && (await ele3.isDisplayed())) {
        this.eform = await ele3.getText();
      }
    } catch (e) {}
    try {
      const ele = await (await $$('td.ruleType')[rowNum]).$('mtx-grid-cell > span');
      //console.log('ele', JSON.stringify(ele));
      //if (ele && (await ele.isDisplayed())) {
        this.ruleType = await ele.getText();
      //}
    } catch (e) {
    }
    try {
      const ele = await (await $$('td.alarm')[rowNum]).$('mtx-grid-cell > span');
      //if (ele && (await ele.isDisplayed())) {
        this.ruleAlarm = await ele.getText();
      //}
    } catch (e) {}
    try {
      const ele = await (await $$('td.ruleWeekDay')[rowNum]).$('mtx-grid-cell > span');
      //if (ele && (await ele.isDisplayed())) {
        this.ruleWeekDay = await ele.getText();
      //}
    } catch (e) {}
    try {
      this.editRuleBtn = await $('#showEditRuleBtn-'+rowNum);
    } catch (e) {}
    try {
      this.deleteRuleBtn = await $('#deleteRuleBtn-'+rowNum);
    } catch (e) {}
    return this;
  }

  public async delete(clickCancel = false, waitCreateBtn = true) {
    if (this.deleteRuleBtn) {
      await this.openDeleteModal();
      await this.closeDeleteModal(clickCancel, waitCreateBtn);
    }
  }

  public async openDeleteModal() {
    if (this.deleteRuleBtn) {
      await this.deleteRuleBtn.click();
      await (
        await backendConfigurationAreaRulesPage.areaRuleDeleteCancelBtn()
      ).waitForClickable({ timeout: 40000 });
    }
  }

  public async closeDeleteModal(clickCancel = false, waitCreateBtn = true) {
    if (clickCancel) {
      await (
        await backendConfigurationAreaRulesPage.areaRuleDeleteCancelBtn()
      ).click();
    } else {
      await (
        await backendConfigurationAreaRulesPage.areaRuleDeleteDeleteBtn()
      ).click();
    }
    if (waitCreateBtn) {
      await (
        await backendConfigurationAreaRulesPage.ruleCreateBtn()
      ).waitForClickable({ timeout: 40000 });
    } else {
      await browser.pause(500);
    }
  }

  public async edit(
    areaRule: AreaRuleCreateUpdate,
    clickCancel = false,
    waitCreateBtn = true
  ) {
    await this.openEditModal(areaRule);
    await this.closeEditModal(clickCancel, waitCreateBtn);
  }

  public async openEditModal(areaRule: AreaRuleCreateUpdate) {
    await this.editRuleBtn.click();
    await browser.pause(500);
    await (
      await backendConfigurationAreaRulesPage.areaRuleEditSaveCancelBtn()
    ).waitForClickable({ timeout: 40000 });
    if (areaRule) {
      if (areaRule.name) {
        await (
          await backendConfigurationAreaRulesPage.editRuleName(0)
        ).setValue(areaRule.name);
        await browser.pause(500);
      }
      if (areaRule.type) {
        await (
          await (await backendConfigurationAreaRulesPage.editRuleType()).$(
            'input'
          )
        ).setValue(areaRule.type);
        await browser.pause(500);
        const value = await (
          await $('ng-dropdown-panel')
        ).$(`.ng-option=${areaRule.type}`);
        value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
      }
      if (areaRule.alarm) {
        await (
          await (await backendConfigurationAreaRulesPage.editRuleAlarm()).$(
            'input'
          )
        ).setValue(areaRule.alarm);
        await browser.pause(500);
        const value = await (
          await $('ng-dropdown-panel')
        ).$(`.ng-option=${areaRule.alarm}`);
        value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
      }
      if (areaRule.dayOfWeek) {
        await (
          await (
            await backendConfigurationAreaRulesPage.editAreaRuleDayOfWeek()
          ).$('input')
        ).setValue(areaRule.dayOfWeek);
        await browser.pause(500);
        const value = await (
          await $('ng-dropdown-panel')
        ).$(`.ng-option=${areaRule.dayOfWeek}`);
        value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
      }
      if (areaRule.eform) {
        await (
          await (await backendConfigurationAreaRulesPage.editRuleEformId()).$(
            'input'
          )
        ).setValue(areaRule.eform);
        await browser.pause(500);
        const value = await (
          await $('ng-dropdown-panel')
        ).$(`.ng-option=${areaRule.eform}`);
        value.waitForDisplayed({ timeout: 40000 });
        value.waitForClickable({ timeout: 40000 });
        await value.click();
      }
    }
  }

  public async closeEditModal(clickCancel = false, waitCreateBtn = true) {
    if (clickCancel) {
      await (
        await backendConfigurationAreaRulesPage.areaRuleEditSaveCancelBtn()
      ).click();
    } else {
      await (
        await backendConfigurationAreaRulesPage.areaRuleEditSaveBtn()
      ).waitForClickable({ timeout: 40000 });
      await (
        await backendConfigurationAreaRulesPage.areaRuleEditSaveBtn()
      ).click();
    }
    if (waitCreateBtn) {
      await (
        await backendConfigurationAreaRulesPage.ruleCreateBtn()
      ).waitForClickable({ timeout: 40000 });
    } else {
      await browser.pause(500);
    }
  }

  public async createUpdatePlanning(
    areaRulePlanningCreateUpdate?: AreaRulePlanningCreateUpdate,
    clickCancel = false,
    waitCreateBtn = true
  ) {
    await this.openPlanningModal(areaRulePlanningCreateUpdate);
    await this.closePlanningModal(clickCancel, waitCreateBtn);
  }

  public async openPlanningModal(
    areaRulePlanningCreateUpdate?: AreaRulePlanningCreateUpdate
  ) {
    await this.showAreaRulePlanningBtn.click();
    await (
      await backendConfigurationAreaRulesPage.updateAreaRulePlanningSaveCancelBtn()
    ).waitForClickable({ timeout: 40000 });
    if (areaRulePlanningCreateUpdate) {
      if (areaRulePlanningCreateUpdate.status !== undefined) {
        await (
          await backendConfigurationAreaRulesPage.planAreaRuleStatusToggle()
        ).click();
      }
      if (areaRulePlanningCreateUpdate.repeatType) {
        await selectValueInNgSelector(await backendConfigurationAreaRulesPage.planRepeatType(), areaRulePlanningCreateUpdate.repeatType);
      }
      if (areaRulePlanningCreateUpdate.repeatEvery) {
        await selectValueInNgSelector(await backendConfigurationAreaRulesPage.planRepeatEvery(), areaRulePlanningCreateUpdate.repeatEvery);
      }

      if (areaRulePlanningCreateUpdate.notification !== undefined) {
        await (
          await backendConfigurationAreaRulesPage.planAreaRuleNotificationsToggle()
        ).click();
      }
      if (areaRulePlanningCreateUpdate.enableCompliance !== undefined) {
        if(await (
          await backendConfigurationAreaRulesPage.planAreaRuleComplianceEnableToggle()
        ).getAttribute('aria-checked') !== areaRulePlanningCreateUpdate.enableCompliance.toString()) {
          await (
            await $('label[for=planAreaRuleComplianceEnableToggle-input]')
          ).click();
        }
      }
      if (areaRulePlanningCreateUpdate.startDate) {
        await (await backendConfigurationAreaRulesPage.planStartFrom()).click();
        await selectDateOnDatePicker(
          areaRulePlanningCreateUpdate.startDate.year,
          areaRulePlanningCreateUpdate.startDate.month,
          areaRulePlanningCreateUpdate.startDate.day);
      }
      if (areaRulePlanningCreateUpdate.workers) {
        for (let i = 0; i < areaRulePlanningCreateUpdate.workers.length; i++) {
          await (
            await (
              await backendConfigurationAreaRulesPage.checkboxCreateAssignment(
                areaRulePlanningCreateUpdate.workers[i].workerNumber
              )
            ).$('..')
          ).click();
        }
      }
    }
  }

  public async closePlanningModal(clickCancel = false, waitCreateBtn = true) {
    if (clickCancel) {
      await (
        await backendConfigurationAreaRulesPage.updateAreaRulePlanningSaveCancelBtn()
      ).click();
    } else {
      await (
        await backendConfigurationAreaRulesPage.updateAreaRulePlanningSaveBtn()
      ).waitForClickable({ timeout: 40000 });
      await (
        await backendConfigurationAreaRulesPage.updateAreaRulePlanningSaveBtn()
      ).click();
    }
    if (waitCreateBtn) {
      await (
        await backendConfigurationAreaRulesPage.ruleCreateBtn()
      ).waitForClickable({ timeout: 40000 });
    } else {
      await browser.pause(500);
    }
  }

  public async readPlanning(
    waitCreateBtn = true
  ): Promise<AreaRulePlanningCreateUpdate> {
    await this.openPlanningModal();
    const plan = new AreaRulePlanningCreateUpdate();
    plan.status =
      (await (
        await backendConfigurationAreaRulesPage.planAreaRuleStatusToggle()
      ).getAttribute('aria-checked')) === 'true';
    if (
      await (
        await backendConfigurationAreaRulesPage.planAreaRuleNotificationsToggle()
      ).isExisting()
    ) {
      plan.notification =
        (await (
          await backendConfigurationAreaRulesPage.planAreaRuleNotificationsToggle()
        ).getAttribute('aria-checked')) === 'true';
    }
    if (
      await (
        await backendConfigurationAreaRulesPage.planAreaRuleComplianceEnableToggle()
      ).isExisting()
    ) {
      plan.enableCompliance =
        (await (
          await backendConfigurationAreaRulesPage.planAreaRuleComplianceEnableToggle()
        ).getAttribute('aria-checked')) === 'true';
    }
    if (
      await (
        await backendConfigurationAreaRulesPage.planRepeatEvery()
      ).isExisting()
    ) {
      plan.repeatEvery = await (
        await (await backendConfigurationAreaRulesPage.planRepeatEvery()).$(
          'input'
        )
      ).getValue();
    }
    if (
      await (
        await backendConfigurationAreaRulesPage.planRepeatType()
      ).isExisting()
    ) {
      plan.repeatType = await (
        await (await backendConfigurationAreaRulesPage.planRepeatType()).$(
          'input'
        )
      ).getValue();
    }
    if (
      await (
        await backendConfigurationAreaRulesPage.planStartFrom()
      ).isExisting()
    ) {
      plan.startDate = await (
        await backendConfigurationAreaRulesPage.planStartFrom()
      ).getValue();
    }
    plan.workers = [];
    const masWorkers = await $$('#pairingModalTableBody > tr');
    for (let i = 0; i < masWorkers.length; i++) {
      const workerName = await (await masWorkers[i].$$('td')[1]).getText();
      const status = await $('#pairingModalTableBody status-bar-compact div span').getAttribute('title');
      const workerChecked =
        (await (
          await backendConfigurationAreaRulesPage.checkboxCreateAssignment(i)
        ).getValue()) === 'true';
      plan.workers = [
        ...plan.workers,
        { name: workerName, checked: workerChecked, status: status },
      ];
    }
    await this.closePlanningModal(true, waitCreateBtn);
    return plan;
  }
}

export class AreaRuleCreateUpdate {
  name?: string;
  eform?: string;
  type?: string;
  alarm?: string;
  dayOfWeek?: string;
}

export class AreaRulePlanningCreateUpdate {
  enableCompliance?: boolean;
  status?: boolean;
  notification?: boolean;
  repeatEvery?: string;
  repeatType?: string;
  startDate?: {
    year: number,
    month: number,
    day: number,
  };
  workers?: { workerNumber?: number; name?: string; checked?: boolean, status?: string }[];
}
