import Page from '../Page';
import { parse, format } from 'date-fns';

export class WorkflowCasesPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBody > tr')).length;
  }

  public async idTableHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('thead > tr > th.mat-column-id');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async dateOfIncidentHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('thead > tr > th.mat-column-dateOfIncident');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async incidentTypeHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('thead > tr > th.mat-column-incidentType');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async incidentPlaceHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('thead > tr > th.mat-column-incidentPlace');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async photosExistsHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('#photosExistsHeader');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async descriptionHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('thead > tr > th.mat-column-description');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async deadlineHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('#deadlineHeader');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async actionPlanHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('thead > tr > th.mat-column-actionPlan');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async searchInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#searchInput');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async saveEditBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#saveEditBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async cancelEditBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#cancelEditBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async toBeSolvedByEdit(): Promise<WebdriverIO.Element> {
    const ele = await $('#toBeSolvedByEdit');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async statusEdit(): Promise<WebdriverIO.Element> {
    const ele = await $('#statusEdit');
    // ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async workflowCaseDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#workflowCaseDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async workflowCaseDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#workflowCaseDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async workflowPnCases(): Promise<WebdriverIO.Element> {
    const ele = await $('#workflow-pn-cases');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async workflowPn(): Promise<WebdriverIO.Element> {
    const ele = await $('#workflow-pn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async deadlineFormInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#deadline');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async dateOfIncidentFormInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#dateOfIncident');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async descriptionEdit(): Promise<WebdriverIO.Element> {
    const ele = await $('#descriptionEdit');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    // ele = $('#descriptionEdit .pell-content');
    return ele;
  }

  public async actionPlanEdit(): Promise<WebdriverIO.Element> {
    const ele = await $('#actionPlanEdit');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    // ele = $('#actionPlanEdit .pell-content');
    return ele;
  }

  public async goToWorkflowCasesPage() {
    await (await this.workflowPn()).click();
    await (await this.workflowPnCases()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.searchInput()).waitForClickable({ timeout: 90000 });
  }

  public async getFirstWorkflowCase(): Promise<WorkflowCaseRowObject> {
    return this.getWorkflowCaseByNumber(1);
  }

  public async getWorkflowCaseByNumber(number: number): Promise<WorkflowCaseRowObject> {
    const obj = new WorkflowCaseRowObject();
    return await obj.getRow(number);
  }
}

const workflowCasesPage = new WorkflowCasesPage();
export default workflowCasesPage;

export class WorkflowCaseRowObject {
  constructor() {
  }

  public id: number;
  public dateOfIncident: string;
  // public updateAt: Date;
  public incidentType: string;
  public incidentPlace: string;
  // public photo: boolean;
  public description: string;
  public deadline: string;
  public actionPlan: string;
  public toBeSolvedBy: string;
  public status: string;
  public updateBtn: WebdriverIO.Element;
  public deleteBtn: WebdriverIO.Element;

  public static async closeEdit(clickCancel = false) {
    if (!clickCancel) {
      await (await workflowCasesPage.saveEditBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      await (await workflowCasesPage.cancelEditBtn()).click();
    }
    await browser.pause(500);
    await (await workflowCasesPage.searchInput()).waitForDisplayed();
    await browser.pause(500);
  }

  public static async closeDelete(clickCancel = false) {
    if (!clickCancel) {
      await (await workflowCasesPage.workflowCaseDeleteDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      await (await workflowCasesPage.workflowCaseDeleteCancelBtn()).click();
    }
    await browser.pause(500);
    await (await workflowCasesPage.searchInput()).waitForDisplayed();
    await browser.pause(500);
  }
  async getRow(rowNum: number): Promise<WorkflowCaseRowObject> {
    const row = (await $$('table tr.mat-row'))[rowNum - 1];
    rowNum = rowNum - 1;
    if (row) {
      this.id = +await (await $$('tbody > tr > td.mat-column-id'))[rowNum].getText();
      let date = await (await $$('tbody > tr > td.mat-column-dateOfIncident'))[rowNum].getText();
      this.dateOfIncident = date; // parse(date, 'dd.MM.yyyy HH:mm:ss', new Date());
      // date = row.$('#workflowCaseUpdatedAt').getText();
      // this.updateAt = parse(date, 'dd.MM.yyyy HH:mm:ss', new Date());
      this.incidentType = await (await $$('tbody > tr > td.mat-column-incidentType'))[rowNum].getText();
      this.incidentPlace = await (await $$('tbody > tr > td.mat-column-incidentPlace'))[rowNum].getText();
      // this.photo = row.$('#workflowCasePhotosExists').getText() === 'true';
      this.description = await (await $$('tbody > tr > td.mat-column-description'))[rowNum].getText();
      //date =
      this.deadline = await (await $$('tbody > tr > td.mat-column-deadline'))[rowNum].getText(); // parse(date, 'dd.MM.yyyy HH:mm:ss', new Date());
      this.actionPlan = await (await $$('tbody > tr > td.mat-column-actionPlan'))[rowNum].getText();
      this.toBeSolvedBy = await (await $$('tbody > tr > td.mat-column-solvedBy'))[rowNum].getText();
      this.status = await (await $$('tbody > tr > td.mat-column-status'))[rowNum].getText();
      this.updateBtn = (await $$('#editWorkflowCaseBtn'))[rowNum];
      this.deleteBtn = await $$('#deleteBtn')[rowNum];
    }
    return this;
  }


  public async openDelete() {
    await this.deleteBtn.waitForClickable({ timeout: 20000 });
    await this.deleteBtn.click();
    await (await workflowCasesPage.workflowCaseDeleteCancelBtn()).waitForDisplayed({
      timeout: 20000,
    });
  }

  public async openEdit(updateModel: WorkflowCaseForEdit) {
    await this.updateBtn.click();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
    await (await workflowCasesPage.cancelEditBtn()).waitForDisplayed({
      timeout: 20000,
    });
    if (updateModel) {
      const ngOption = await $('.ng-option-label');
      if (updateModel.status) {
        await (await workflowCasesPage.statusEdit()).$('input').setValue(updateModel.status);
        // spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
        // ngOption.waitForDisplayed({ timeout: 20000 });
        await browser.pause(1000);
        const ele = await (
          await $('ng-dropdown-panel')
        ).$(`.ng-option=${updateModel.status}`);
        //const ele = await $(`//*[@id="statusEdit"]//*[text()="${updateModel.status}"]`);
        await ele.waitForDisplayed({timeout: 20000});
        await ele.click();

        // workflowCasesPage.statusEdit
        //   .$('.ng-dropdown-panel')
        //   .$(`.ng-option-label`)
        //   .click();
      }
      // if (updateModel.toBeSolvedBy) {
      //   workflowCasesPage.toBeSolvedByEdit
      //     .$('input')
      //     .setValue(updateModel.toBeSolvedBy);
      //   spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
      //   ngOption.waitForDisplayed({ timeout: 20000 });
      //   workflowCasesPage.toBeSolvedByEdit
      //     .$('.ng-dropdown-panel')
      //     .$(`.ng-option=${updateModel.toBeSolvedBy}`)
      //     .click();
      // }
      if (updateModel.deadline) {
        await (await workflowCasesPage.deadlineFormInput()).setValue(
          format(updateModel.deadline, 'MM.dd.yyyy')
        );
      }
      if (updateModel.dateOfIncident) {
        await (await workflowCasesPage.dateOfIncidentFormInput()).setValue(
          format(updateModel.dateOfIncident, 'MM.dd.yyyy')
        );
      }
      if (updateModel.description) {
        await (await workflowCasesPage.descriptionEdit()).setValue(updateModel.description);
      }
      if (updateModel.actionPlan) {
        await (await workflowCasesPage.actionPlanEdit()).setValue(updateModel.actionPlan);
      }
    }
  }

  async update(updateModel: WorkflowCaseForEdit, clickCancel = false) {
    await this.openEdit(updateModel);
    await WorkflowCaseRowObject.closeEdit(clickCancel);
  }

  async delete(clickCancel = false) {
    await this.openDelete();
    await WorkflowCaseRowObject.closeDelete(clickCancel);
  }
}

export class WorkflowCaseForEdit {
  public dateOfIncident: Date;
  // public incidentPlace: string;
  public description: string;
  public deadline: Date;
  public actionPlan: string;
  // public toBeSolvedBy: string;
  public status: string;
}
