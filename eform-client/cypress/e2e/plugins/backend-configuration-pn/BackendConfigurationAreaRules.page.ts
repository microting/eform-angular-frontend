import {PageWithNavbarPage} from '../../PageWithNavbar.page';
import backendConfigurationPropertyWorkersPage from './BackendConfigurationPropertyWorkers.page';
import {selectValueInNgSelector} from '../../helper-functions';

class BackendConfigurationAreaRulesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public rowNum() {
    return cy.get('#mainTable .mat-row').its('length');
  }

  public ruleCreateBtn() {
    return cy.get('#ruleCreateBtn').should('be.visible').should('be.enabled');
  }

  public createAreaRulesString() {
    return cy.get('#createAreaRulesString').should('be.visible');
  }

  public areaRulesGenerateBtn() {
    return cy.get('#areaRulesGenerateBtn').should('be.visible').should('be.enabled');
  }

  public areaRuleCreateSaveCancelBtn() {
    return cy.get('#areaRuleCreateSaveCancelBtn').should('be.visible').should('be.enabled');
  }

  public areaRuleCreateSaveBtn() {
    return cy.get('#areaRuleCreateSaveBtn').should('be.visible').should('be.enabled');
  }

  public createRuleType(i: number) {
    return cy.get(`#createRuleType${i}`).should('be.visible');
  }

  public createRuleAlarm(i: number) {
    return cy.get(`#createRuleAlarm${i}`).should('be.visible');
  }

  public createAreaDayOfWeek(i: number) {
    return cy.get(`#createAreaDayOfWeek${i}`).should('be.visible');
  }

  public newAreaRulesDayOfWeek() {
    return cy.get(`#newAreaRulesDayOfWeek`).should('be.visible');
  }

  public createAreasDayOfWeek() {
    return cy.get(`#createAreasDayOfWeek`).should('be.visible');
  }

  public createRuleEformId(i: number) {
    return cy.get(`#createRuleEformId${i}`).should('be.visible');
  }

  public areaRuleDeleteDeleteBtn() {
    return cy.get('#areaRuleDeleteDeleteBtn').should('be.visible').should('be.enabled');
  }

  public areaRuleDeleteCancelBtn() {
    return cy.get('#areaRuleDeleteCancelBtn').should('be.visible').should('be.enabled');
  }

  public areaRuleEditSaveBtn() {
    return cy.get('#areaRuleEditSaveBtn').should('be.visible');
  }

  public areaRuleEditSaveCancelBtn() {
    return cy.get('#areaRuleEditSaveCancelBtn').should('be.visible').should('be.enabled');
  }

  public editRuleName(i: number) {
    return cy.get(`#editRuleName${i}`).should('be.visible');
  }

  public editRuleEformId() {
    return cy.get('#editRuleEformId');
  }

  public editRuleType() {
    return cy.get('#editRuleType');
  }

  public editRuleAlarm() {
    return cy.get('#editRuleAlarm');
  }

  public editAreaRuleDayOfWeek() {
    return cy.get('#editAreaRuleDayOfWeek');
  }

  public updateAreaRulePlanningSaveBtn() {
    return cy.get('#updateAreaRulePlanningSaveBtn').should('be.visible').click();
  }

  public updateAreaRulePlanningSaveCancelBtn() {
    return cy.get('#updateAreaRulePlanningSaveCancelBtn').should('be.visible').click();
  }

  public planAreaRuleStatusToggle() {
    return cy.get('#planAreaRuleStatusToggle-input');
  }

  public planAreaRuleNotificationsToggle() {
    return cy.get('#planAreaRuleNotificationsToggle-input');
  }

  public planAreaRuleComplianceEnableToggle() {
    return cy.get('#planAreaRuleComplianceEnableToggle-input');
  }

  public planRepeatEvery() {
    return cy.get('#planRepeatEvery');
  }

  public planRepeatType() {
    return cy.get('#planRepeatType');
  }

  public planStartFrom() {
    return cy.get('#planStartFrom');
  }

  public checkboxCreateAssignment(i: number) {
    return cy.get(`#checkboxCreateAssignment${i}-input`);
  }

  public updateEntityList() {
    return cy.get('.updateEntityList').should('be.visible').click();
  }

  public entityListSaveBtn() {
    return cy.get('#entityListSaveBtn').should('be.visible').click();
  }

  public entityListSaveCancelBtn() {
    return cy.get('#entityListSaveCancelBtn').should('be.visible').should('be.enabled').click();
  }

  public addSingleEntitySelectableItem() {
    return cy.get('#addSingleEntitySelectableItem').should('be.visible').click();
  }

  public entityItemEditNameBox() {
    return cy.get('#entityItemEditNameBox').should('be.visible');
  }

  public entityItemSaveBtn() {
    return cy.get('#entityItemSaveBtn').should('be.visible').click();
  }

  public entityItemCancelBtn() {
    return cy.get('#entityItemCancelBtn').should('be.visible').should('be.enabled').click();
  }

  public createEntityItemName(i: number) {
    return cy.get(`#createEntityItemName`).eq(i).should('be.visible').type('Entity Name');
  }

  public entityItemEditBtn(i) {
    return cy.get('#entityItemEditBtn')
      .eq(i)
      .should('be.visible')
      .should('be.enabled');
  }

  public entityItemDeleteBtn(i) {
    return cy.get('#entityItemDeleteBtn')
      .eq(i)
      .should('be.visible')
      .should('be.enabled');
  }

  public getCountEntityListItems() {
    cy.wait(500);
    return cy.get('#createEntityItemName').its('length');
  }

  public getFirstAreaRuleRowObject() {
    return new AreaRuleRowObject().getRow(1);
  }

/*  public getLastAreaRuleRowObject() {
    return new AreaRuleRowObject().getRow(this.rowNum());
  }*/

  public getAreaRuleRowObjectByIndex(index) {
    return new AreaRuleRowObject().getRow(index);
  }

  public getFirstRowObject(): AreaRuleRowObject {
    return this.getAreaRuleRowObjectByIndex(1);
  }

  clearTable() {
    cy.log('**CLEAR AREA RULES TABLE**')
    this.rowNum().then(rowNum => {
      for (let i = rowNum; i > 0; i--) {
        this.getFirstRowObject().delete();
        cy.wait(500)
      }
    });
  }

  public createAreaRule(areaRule, clickCancel = false) {
    this.openCreateAreaRuleModal(areaRule);
    this.closeCreateAreaRuleModal(clickCancel);
  }

  public openCreateAreaRuleModal(areaRule?: AreaRuleCreateUpdate) {
    this.ruleCreateBtn().click();
    this.areaRuleCreateSaveCancelBtn().should('be.visible').should('be.enabled');
    if (areaRule) {
      if (areaRule.name) {
        if (areaRule.dayOfWeek) {
          selectValueInNgSelector('[id^=createAreasDayOfWeek]', areaRule.dayOfWeek);
        }
        this.createAreaRulesString().type(areaRule.name);
        this.areaRulesGenerateBtn().click();
        if (areaRule.type) {
          selectValueInNgSelector('[id^=createRuleType]', areaRule.type);
        }
        if (areaRule.alarm) {
          selectValueInNgSelector('[id^=createRuleAlarm]', areaRule.alarm);
        }
        if (areaRule.eform) {
          selectValueInNgSelector('[id^=createRuleEformId]', areaRule.eform, true);
        }
      }
    }
  }

  public closeCreateAreaRuleModal(clickCancel = false) {
    if (clickCancel) {
      this.areaRuleCreateSaveCancelBtn().click();
    } else {
      this.areaRuleCreateSaveBtn().click();
    }
    this.ruleCreateBtn().should('be.visible').should('be.enabled');
  }
}

const backendConfigurationAreaRulesPage = new BackendConfigurationAreaRulesPage();
export default backendConfigurationAreaRulesPage;

export class AreaRuleRowObject {
  row: Cypress.Chainable<JQuery<HTMLElement>>;
  showAreaRulePlanningBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  editRuleBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  deleteRuleBtn: Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum: number) {
    const row = () => cy.get('.mat-row').eq(rowNum - 1);
    this.row = row();
    this.showAreaRulePlanningBtn = row().find('[id^=showAreaRulePlanningBtn]').should('be.visible').should('be.enabled');
    this.editRuleBtn = row().find('[id^=showEditRuleBtn]').should('be.visible').should('be.enabled');
    this.deleteRuleBtn = row().find('[id^=deleteRuleBtn]').should('be.visible').should('be.enabled');
    return this;
  }

  // find first row with text
  getRowByName(s: string) {
    const row = () => cy.get('.mat-row')
      .contains(s) // div
      .parent() // met-cell
      .parent(); // mat-row
    this.row = row();
    this.showAreaRulePlanningBtn = row().find('[id^=showAreaRulePlanningBtn]').should('be.visible').should('be.enabled');
    this.editRuleBtn = row().find('[id^=editDeviceUserBtn]').should('be.visible').should('be.enabled');
    this.deleteRuleBtn = row().find('[id^=deleteDeviceUserBtn]').should('be.visible').should('be.enabled');
    return this;
  }

  delete(clickCancel = false, waitCreateBtn = true) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel, waitCreateBtn);
  }

  openDeleteModal() {
    this.deleteRuleBtn.click();
    backendConfigurationAreaRulesPage.areaRuleDeleteCancelBtn().should('be.visible');
  }

  closeDeleteModal(clickCancel = false, waitCreateBtn = true) {
    if (clickCancel) {
      backendConfigurationAreaRulesPage.areaRuleDeleteCancelBtn().click();
    } else {
      backendConfigurationAreaRulesPage.areaRuleDeleteDeleteBtn().click();
    }
    if (waitCreateBtn) {
      backendConfigurationAreaRulesPage.ruleCreateBtn().should('be.visible');
    } else {
      cy.wait(500);
    }
  }
}

export class AreaRuleCreateUpdate {
  name?: string;
  eform?: string;
  type?: string;
  alarm?: string;
  dayOfWeek?: string;
}
