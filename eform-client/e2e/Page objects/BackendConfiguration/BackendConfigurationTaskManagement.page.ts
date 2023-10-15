import Page from '../Page';
import backendConfigurationPropertiesPage from './BackendConfigurationProperties.page';
import {selectDateRangeOnDatePicker, selectValueInNgSelector} from '../../Helpers/helper-functions';

export class BackendConfigurationTaskManagementPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length;
  }

  public async backendConfigurationPnTaskManagement() {
    const ele = await $('#backend-configuration-pn-task-management');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async goToTaskManagement() {
    if (!$('#backend-configuration-pn-task-management').isDisplayed()) {
      await (
        await backendConfigurationPropertiesPage.backendConfigurationPnButton()
      ).click();
    }
    await (await this.backendConfigurationPnTaskManagement()).click();
    await (await this.createNewTaskBtn()).waitForClickable({ timeout: 90000 });
  }

  public async getFirstTaskRowObject(): Promise<TaskRowObject> {
    return await new TaskRowObject().getRow(1);
  }

  public async getLastTaskRowObject(): Promise<TaskRowObject> {
    return await new TaskRowObject().getRow(await this.rowNum());
  }

  public async getTaskRowObjectByIndex(
    index: number
  ): Promise<TaskRowObject> {
    return await new TaskRowObject().getRow(index);
  }

  public async propertyId() {
    const ele = await $('#propertyId');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaName() {
    const ele = await $('#areaName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async assignedTo() {
    const ele = await $('#assignedTo');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async addNewImages() {
    const ele = await $('#addNewImages');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async descriptionTask() {
    const ele = await $('#descriptionTask');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  // public async descriptionTaskInput() {
  //   const ele = await (await this.descriptionTask()).$('');
  //   await ele.waitForDisplayed({ timeout: 40000 });
  //   // await ele.waitForClickable({ timeout: 40000 });
  //   return ele;
  // }

  public async taskManagementCreateShowSaveBtn() {
    const ele = await $('#taskManagementCreateShowSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async taskManagementCreateShowSaveCancelBtn() {
    const ele = await $('#taskManagementCreateShowSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async showReportBtn() {
    const ele = await $('#showReportBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async wordBtn() {
    const ele = await $('#wordBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async excelBtn() {
    const ele = await $('#excelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyIdFilter() {
    const ele = await $('#propertyIdFilter');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async areaNameFilter() {
    const ele = await $('#areaNameFilter');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createdByFilter() {
    const ele = await $('#createdByFilter');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async lastAssignedToFilter() {
    const ele = await $('#lastAssignedToFilter');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async statusFilter() {
    const ele = await $('#statusFilter');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async dateFilter() {
    const ele = await $('#dateFilter');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async taskManagementDeleteBtn() {
    const ele = await $('#taskManagementDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async taskManagementDeleteCancelBtn() {
    const ele = await $('#taskManagementDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createNewTaskBtn() {
    const ele = await $('#createNewTaskBtn');
    await ele.waitForDisplayed({ timeout: 90000 });
    await ele.waitForClickable({ timeout: 90000 });
    return ele;
  }

  public async idTableHeader() {
    const ele = await $('thead > tr > th.id');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async caseInitiatedTableHeader() {
    const ele = await $('thead > tr > th.createdDate');
    await ele.waitForDisplayed({ timeout: 90000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async selectedAreaNameTableHeader() {
    const ele = await $('thead > tr > th.areaName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createdByNameTableHeader() {
    const ele = await $('thead > tr > th.createdByName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createdByTextTableHeader() {
    const ele = await $('thead > tr > th.createdByText');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async lastAssignedToNameTableHeader() {
    const ele = await $('thead > tr > th.lastAssignedTo');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async updatedAtTableHeader() {
    const ele = await $('thead > tr > th.lastUpdateDate');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async caseStatusesEnumTableHeader() {
    const ele = await $('thead > tr > th.status');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async clearTable() {
    await browser.pause(2000);
    const rowCount = await this.rowNum();
    let indexForDelete = 1;
    for (let i = 1; i <= rowCount; i++) {
      const task = await new TaskRowObject().getRow(indexForDelete);
      if (
        task &&
        task.deleteTaskBtn &&
        (await task.deleteTaskBtn.isDisplayed())
      ) {
        await task.delete();
      } else {
        indexForDelete += 1;
      }
    }
  }

  public async createTask(
    areaRule?: TaskCreateShow,
    clickCancel = false
  ) {
    await this.openCreateTaskModal(areaRule);
    await this.closeCreateTaskModal(clickCancel);
  }

  public async openCreateTaskModal(task?: TaskCreateShow) {
    await (await this.createNewTaskBtn()).click();
    await (await this.taskManagementCreateShowSaveCancelBtn()).waitForClickable({
      timeout: 40000,
    });
    if (task) {
      if (task.propertyName) {
        await selectValueInNgSelector(await this.propertyId(), task.propertyName)
      }
      if (task.areaName) {
        await selectValueInNgSelector(await this.areaName(), task.areaName)
      }
      if (task.assignedTo) {
        await selectValueInNgSelector(await this.assignedTo(), task.assignedTo)
      }
      if(task.description) {
        await (await this.descriptionTask()).setValue(task.description);
      }
    }
  }

  public async closeCreateTaskModal(clickCancel = false) {
    if (clickCancel) {
      await (await this.taskManagementCreateShowSaveCancelBtn()).click();
    } else {
      await (await this.taskManagementCreateShowSaveBtn()).click();
    }
    await (await this.createNewTaskBtn()).waitForClickable({ timeout: 90000 });
    await browser.pause(500);
  }

  public async changeFilters(filters: TaskManagementFilters) {
    if(filters) {
      if(filters.propertyName){
        await selectValueInNgSelector(await this.propertyIdFilter(), filters.propertyName);
      }
      if(filters.areaName){
        await selectValueInNgSelector(await this.areaNameFilter(), filters.areaName);
      }
      if(filters.createdBy){
        await selectValueInNgSelector(await this.createdByFilter(), filters.createdBy);
      }
      if(filters.lastAssignedTo){
        await selectValueInNgSelector(await this.lastAssignedToFilter(), filters.lastAssignedTo);
      }
      if(filters.status){
        await selectValueInNgSelector(await this.statusFilter(), filters.status);
      }
      if(filters.date){
        await (await this.dateFilter()).click();
        await selectDateRangeOnDatePicker(
          filters.date.yearFrom,
          filters.date.monthFrom,
          filters.date.dayFrom,
          filters.date.yearTo,
          filters.date.monthTo,
          filters.date.dayTo);
      }
      await (await this.showReportBtn()).click();
      await (await this.createNewTaskBtn()).waitForClickable({ timeout: 40000});
      await browser.pause(500);
    }
  }
}

const backendConfigurationTaskManagementPage = new BackendConfigurationTaskManagementPage();
export default backendConfigurationTaskManagementPage;

export class TaskRowObject {
  constructor() {}

  public row: WebdriverIO.Element;
  public id: string;
  public createdDate: string;
  public propertyName: string
  public area: string;
  public createdBy1: string;
  public createdBy2: string;
  public lastAssignedTo: string;
  public showTaskBtn: WebdriverIO.Element;
  public deleteTaskBtn?: WebdriverIO.Element;
  public description: string;
  public lastUpdatedDate: string;
  public lastUpdatedBy: string;
  public status: string;

  public async getRow(rowNum: number): Promise<TaskRowObject> {
    rowNum = rowNum - 1;
    this.id = await (await $$('td.id')[rowNum]).getText();
    this.createdDate = await (await $$('td.createdDate')[rowNum]).getText();
    this.propertyName = await (await $$('td.propertyName')[rowNum]).getText();
    this.area = await (await $$('td.areaName')[rowNum]).getText();
    this.createdBy1 = await (await $$('td.createdByName')[rowNum]).getText();
    this.createdBy2 = await (await $$('td.createdByText')[rowNum]).getText();
    this.lastAssignedTo = await (await $$('td.lastAssignedTo')[rowNum]).getText();
    this.showTaskBtn = await $$('button.taskManagementViewBtn')[rowNum];
    this.deleteTaskBtn = await $$('button.taskManagementDeleteTaskBtn')[rowNum];
    this.description = await (await $$('td.description')[rowNum]).getText();
    this.lastUpdatedDate = await (await $$('td.lastUpdateDate')[rowNum]).getText();
    this.lastUpdatedBy = await (await $$('td.lastUpdatedBy')[rowNum]).getText();
    this.status = await (await $$('td.status')[rowNum]).getText();
    return this;
  }

  public async delete(clickCancel = false) {
    if (this.deleteTaskBtn) {
      await this.openDeleteModal();
      await this.closeDeleteModal(clickCancel);
    }
  }

  public async openDeleteModal() {
    if (this.deleteTaskBtn) {
      await this.deleteTaskBtn.click();
      await (
        await backendConfigurationTaskManagementPage.taskManagementDeleteCancelBtn()
      ).waitForClickable({ timeout: 40000 });
    }
  }

  public async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationTaskManagementPage.taskManagementDeleteCancelBtn()
      ).click();
    } else {
      await (
        await backendConfigurationTaskManagementPage.taskManagementDeleteBtn()
      ).click();
    }
    await (
      await backendConfigurationTaskManagementPage.createNewTaskBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async openShowModal() {
    await this.showTaskBtn.click();
    await (
      await backendConfigurationTaskManagementPage.taskManagementCreateShowSaveCancelBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async closeShowModal(clickCancel = false, waitCreateBtn = true) {
    if (clickCancel) {
      await (
        await backendConfigurationTaskManagementPage.taskManagementCreateShowSaveCancelBtn()
      ).click();
    } else {
      await (
        await backendConfigurationTaskManagementPage.taskManagementCreateShowSaveBtn()
      ).waitForClickable({ timeout: 40000 });
      await (
        await backendConfigurationTaskManagementPage.taskManagementCreateShowSaveBtn()
      ).click();
    }
    await (
      await backendConfigurationTaskManagementPage.createNewTaskBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async readTask(): Promise<TaskCreateShow> {
    await this.openShowModal();
    const task = new TaskCreateShow();
    task.propertyName =
      await (
        await (await backendConfigurationTaskManagementPage.propertyId()).$(
          'input'
        )
      ).getValue();
    task.areaName =
      await (
        await (await backendConfigurationTaskManagementPage.areaName()).$(
          'input'
        )
      ).getValue();
    task.assignedTo =
      await (
        await (await backendConfigurationTaskManagementPage.assignedTo()).$(
          'input'
        )
      ).getValue();
    task.description =
      await (
        await (await backendConfigurationTaskManagementPage.descriptionTask()).$(
          'input'
        )
      ).getText();
    await this.closeShowModal(true);
    return task;
  }
}

export class TaskCreateShow {
  propertyName: string;
  areaName: string;
  assignedTo: string;
  description?: string;
}

export class TaskManagementFilters {
  propertyName: string;
  areaName?: string;
  createdBy?: string;
  lastAssignedTo?: string;
  status?: string;
  date?: {
    yearFrom: number,
    monthFrom: number,
    dayFrom: number,
    yearTo: number,
    monthTo: number,
    dayTo: number,
  };
}
