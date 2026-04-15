import {PageWithNavbarPage} from 'cypress/e2e/PageWithNavbar.page';
import {selectDateOnNewDatePicker, selectValueInNgSelector} from 'cypress/e2e/helper-functions';

class ItemPlanningPage extends PageWithNavbarPage {

  goToPlanningPage() {
    this.planningsButton().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.itemPlanningButton().click();
      }
    });
    this.planningsButton().click();
    this.planningCreateBtn().should('be.visible').should('be.enabled');
  }

  public itemPlanningButton() {
    return cy.get('#items-planning-pn');
  }

  public planningCreateBtn() {
    return cy.get('#planningCreateBtn');
  }

  public planningManageTagsBtn() {
    return cy.get('#planningManageTagsBtn');
  }

  public planningsButton() {
    return cy.get('#items-planning-pn-plannings');
  }

  public deleteMultiplePluginsBtn() {
    return cy.get('#deleteMultiplePluginsBtn');
  }

  public planningsMultipleDeleteCancelBtn() {
    return cy.get('#planningsMultipleDeleteCancelBtn');
  }

  public planningsMultipleDeleteDeleteBtn() {
    return cy.get('#planningsMultipleDeleteDeleteBtn');
  }

  public selectAllPlanningsCheckbox() {
    return cy.get('th.mat-column-MtxGridCheckboxColumnDef mat-checkbox');
  }

  public importPlanningsBtn() {
    return cy.get('#importPlanningsBtn');
  }

  public createPlanningItemName(index: number) {
    return cy.get(`#createPlanningNameTranslation_${index}`);
  }

  public createPlanningSelector() {
    return cy.get('#createPlanningSelector');
  }

  public createPlanningItemDescription() {
    return cy.get('#createPlanningItemDescription');
  }

  public createRepeatEvery() {
    return cy.get('#createRepeatEvery');
  }

  public createFolderSelector() {
    return cy.get('#createFolderSelector');
  }

  public editFolderName() {
    return cy.get('#editFolderSelector');
  }

  public folderName() {
    return cy.get('#folderName');
  }

  public createRepeatUntil() {
    return cy.get('#createRepeatUntil');
  }

  public planningCreateSaveBtn() {
    return cy.get('#planningCreateSaveBtn');
  }

  public planningCreateCancelBtn() {
    return cy.get('#planningCreateCancelBtn');
  }

  public createPlanningTagsSelector() {
    return cy.get('#createPlanningTagsSelector');
  }

  public createStartFrom() {
    return cy.get('#createStartFrom');
  }

  public createItemNumber() {
    return cy.get('#createItemNumber');
  }

  public createItemLocationCode() {
    return cy.get('#createItemLocationCode');
  }

  public createItemBuildYear() {
    return cy.get('#createItemBuildYear');
  }

  public createItemType() {
    return cy.get('#createItemType');
  }

  // Edit page elements
  public editPlanningItemName(index: number) {
    return cy.get(`#editPlanningNameTranslation_${index}`);
  }

  // selector eForm
  public editPlanningSelector() {
    return cy.get('#editPlanningSelector');
  }

  public editPlanningTagsSelector() {
    return cy.get('#editPlanningTagsSelector');
  }

  public editItemNumber() {
    return cy.get('#editItemNumber');
  }

  public editPlanningDescription() {
    return cy.get('#editPlanningItemDescription');
  }

  public editRepeatEvery() {
    return cy.get('#editRepeatEvery');
  }

  public planningId() {
    return cy.get('#planningId');
  }

  public editRepeatType() {
    return cy.get('#editRepeatType');
  }

  public editRepeatUntil() {
    return cy.get('#editRepeatUntil');
  }

  public editStartFrom() {
    return cy.get('#editStartFrom');
  }

  public editItemLocationCode() {
    return cy.get('#editItemLocationCode');
  }

  public editItemBuildYear() {
    return cy.get('#editItemBuildYear');
  }

  public editItemType() {
    return cy.get('#editItemType');
  }

  public planningEditSaveBtn() {
    return cy.get('#planningEditSaveBtn');
  }

  public planningEditCancelBtn() {
    return cy.get('#planningEditCancelBtn');
  }

  public addItemBtn() {
    return cy.get('#addItemBtn');
  }

  public planningDeleteDeleteBtn() {
    return cy.get('#planningDeleteDeleteBtn');
  }

  public planningDeleteCancelBtn() {
    return cy.get('#planningDeleteCancelBtn');
  }

  public xlsxImportPlanningsInput() {
    return cy.get('#xlsxImportPlanningsInput');
  }

  public pushMessageEnabledCreate() {
    return cy.get('#pushMessageEnabledCreate');
  }

  public createDaysBeforeRedeploymentPushMessage() {
    return cy.get('#createDaysBeforeRedeploymentPushMessage');
  }

  public pushMessageEnabledEdit() {
    return cy.get('#pushMessageEnabledEdit');
  }

  public editDaysBeforeRedeploymentPushMessage() {
    return cy.get('#editDaysBeforeRedeploymentPushMessage');
  }

  public createRepeatType() {
    return cy.get('#createRepeatType');
  }

  public createDayOfMonth() {
    return cy.get('#createDayOfMonth');
  }

  public createDayOfWeek() {
    return cy.get('#createDayOfWeek');
  }

  public rowColumnId() {
    return cy.get('.mat-row .cdk-column-id');
  }

  public rowColumnTranslatedName() {
    return cy.get('.mat-row .cdk-column-translatedName');
  }

  public rowColumnEFormSdkFolderName() {
    return cy.get('.mat-row .cdk-column-folder-eFormSdkFolderName');
  }

  public rowColumnPlanningRelatedEformName() {
    return cy.get('.mat-row .cdk-column-planningRelatedEformName');
  }

  public rowColumnRepeatEvery() {
    return cy.get('.mat-row .cdk-column-reiteration-repeatEvery');
  }

  public rowColumnRepeatType() {
    return cy.get('.mat-row .cdk-column-reiteration-repeatType');
  }

  public headerColumnId() {
    return cy.get('.cdk-header-cell.cdk-column-id');
  }

  public headerColumnTranslatedName() {
    return cy.get('.cdk-header-cell.cdk-column-translatedName');
  }

  public headerColumnEFormSdkFolderName() {
    return cy.get('.cdk-header-cell.cdk-column-folder-eFormSdkFolderName');
  }

  public headerColumnPlanningRelatedEformName() {
    return cy.get('.cdk-header-cell.cdk-column-planningRelatedEformName');
  }

  public headerColumnRepeatEvery() {
    return cy.get('.cdk-header-cell.cdk-column-reiteration-repeatEvery');
  }

  public headerColumnRepeatType() {
    return cy.get('.cdk-header-cell.cdk-column-reiteration-repeatType');
  }

  public selectFolder(nameFolder: string, edit: boolean = false) {
    if (!edit) {
      this.createFolderSelector().click();
    } else {
      this.editFolderName().click();
    }
    const treeViewport = () => cy.get('app-eform-tree-view-picker');
    treeViewport().find('.collapse-button').click(); // expand all folders
    treeViewport().find('.folder-tree-name').filter(`:contains("${nameFolder}")`).click(); // select folder
    cy.wait(500);
  }

  public createPlanning(planning?: PlanningCreateUpdate, clickCancel = false) {
    this.openCreatePlanning(planning);
    this.closeCreatePlanning(clickCancel);
  }

  public openCreatePlanning(planning?: PlanningCreateUpdate) {
    this.planningCreateBtn().click();
    this.planningCreateCancelBtn().should('be.visible');
    if (planning) {
      if (planning.name) {
        for (let i = 0; i < planning.name.length; i++) {
          this.createPlanningItemName(i).should('be.visible').type(planning.name[i]);
        }
      }
      if (planning.description) {
        this.createPlanningItemDescription().should('be.visible').type(planning.description);
      }
      if (planning.folderName) {
        this.selectFolder(planning.folderName, false);
      }
      if (planning.eFormName) {
        selectValueInNgSelector(this.createPlanningSelector, planning.eFormName, true);
      }
      if (planning.tags) {
        for (let i = 0; i < planning.tags.length; i++) {
          selectValueInNgSelector(this.createPlanningTagsSelector, planning.tags[i], true);
        }
      }
      if (planning.repeatEvery) {
        this.createRepeatEvery().should('be.visible').type(planning.repeatEvery);
      }
      if (planning.repeatType) {
        selectValueInNgSelector(this.createRepeatType, planning.repeatType, true);
        switch (planning.repeatType) {
          case 'Måned': {
            this.createDayOfMonth().type(planning.dayOfMonth.toString());
            break;
          }
          case 'Uge': {
            selectValueInNgSelector(this.createDayOfWeek, planning.dayOfWeek, true);
            break;
          }
        }
      }
      if (planning.startFrom) {
        this.createStartFrom().should('be.visible').click();
        cy.wait(500);
        selectDateOnNewDatePicker(planning.startFrom.year, planning.startFrom.month, planning.startFrom.day);
      }
      if (planning.repeatUntil) {
        this.createRepeatUntil().should('be.visible').click();
        cy.wait(500);
        selectDateOnNewDatePicker(planning.repeatUntil.year, planning.repeatUntil.month, planning.repeatUntil.day);
      }
      if (planning.number) {
        this.createItemNumber().should('be.visible').type(planning.number);
      }
      if (planning.locationCode) {
        this.createItemLocationCode().should('be.visible').type(planning.locationCode);
      }
      if (planning.buildYear) {
        this.createItemBuildYear().should('be.visible').type(planning.buildYear);
      }
      if (planning.type) {
        this.createItemType().should('be.visible').type(planning.type);
      }
      if (planning.pushMessageEnabled !== undefined) {
        selectValueInNgSelector(this.pushMessageEnabledCreate, planning.pushMessageEnabled ? 'Aktiveret' : 'Deaktiveret', true);
      }
      if (planning.daysBeforeRedeploymentPushMessage) {
        selectValueInNgSelector(this.createDaysBeforeRedeploymentPushMessage, planning.daysBeforeRedeploymentPushMessage.toString(), true);
      }
    }
  }

  public closeCreatePlanning(clickCancel = false) {
    if (clickCancel) {
      this.planningCreateCancelBtn().click();
    } else {
      this.planningCreateSaveBtn().click();
    }
    cy.wait(500);
    this.planningCreateBtn().should('be.visible');
  }

  public multipleCreatePlanning(plannings: PlanningCreateUpdate[]) {
    for (let i = 0; i < plannings.length; i++) {
      this.createPlanning(plannings[i]);
    }
  }

  public editPlanning(planning?: PlanningCreateUpdate, clickCancel = false, index = 0) {
    this.openEditPlanning(planning, index);
    this.closeEditPlanning(clickCancel);
  }

  public openEditPlanning(planning?: PlanningCreateUpdate, index = 0) {
    cy.get('.mat-row .cdk-column-actions .updatePlanningBtn').eq(index).click();
    this.planningEditCancelBtn().should('be.visible');
    if (planning) {
      if (planning.name) {
        for (let i = 0; i < planning.name.length; i++) {
          this.editPlanningItemName(i).should('be.visible').clear().type(planning.name[i]);
        }
      }
      if (planning.description) {
        this.editPlanningDescription().should('be.visible').clear().type(planning.description);
      }
      if (planning.folderName) {
        this.selectFolder(planning.folderName, true);
      }
      if (planning.eFormName) {
        selectValueInNgSelector(this.editPlanningSelector, planning.eFormName, true);
      }
      if (planning.tags) {
        for (let i = 0; i < planning.tags.length; i++) {
          selectValueInNgSelector(this.editPlanningTagsSelector, planning.tags[i], true);
        }
      }
      if (planning.repeatEvery) {
        this.editRepeatEvery().should('be.visible').clear().type(planning.repeatEvery);
      }
      if (planning.repeatType) {
        selectValueInNgSelector(this.editRepeatType, planning.repeatType, true);
      }
      if (planning.startFrom) {
        this.editStartFrom().should('be.visible').click();
        cy.wait(500);
        selectDateOnNewDatePicker(planning.startFrom.year, planning.startFrom.month, planning.startFrom.day);
      }
      if (planning.repeatUntil) {
        this.editRepeatUntil().should('be.visible').click();
        cy.wait(500);
        selectDateOnNewDatePicker(planning.repeatUntil.year, planning.repeatUntil.month, planning.repeatUntil.day);
      }
      if (planning.number) {
        this.editItemNumber().should('be.visible').clear().type(planning.number);
      }
      if (planning.locationCode) {
        this.editItemLocationCode().should('be.visible').clear().type(planning.locationCode);
      }
      if (planning.buildYear) {
        this.editItemBuildYear().should('be.visible').clear().type(planning.buildYear);
      }
      if (planning.type) {
        this.editItemType().should('be.visible').clear().type(planning.type);
      }
      if (planning.pushMessageEnabled !== undefined) {
        selectValueInNgSelector(this.pushMessageEnabledEdit, planning.pushMessageEnabled ? 'Aktiveret' : 'Deaktiveret', true);
      }
      if (planning.daysBeforeRedeploymentPushMessage) {
        selectValueInNgSelector(this.editDaysBeforeRedeploymentPushMessage, planning.daysBeforeRedeploymentPushMessage.toString(), true);
      }
    }
  }

  public closeEditPlanning(clickCancel = false) {
    if (clickCancel) {
      this.planningEditCancelBtn().click();
    } else {
      this.planningEditSaveBtn().click();
    }
    cy.wait(500);
    this.planningCreateBtn().should('be.visible');
  }

  public clearTable() {
    cy.get('app-plannings-table .mat-row').its('length').then(length => {
      for (let i = 0; i < length; i++) {
        cy.get('app-plannings-table .mat-row button.mat-warn').first().click();
        this.planningDeleteDeleteBtn().click();
        cy.wait(500);
      }
    });
  }

  public deletePlanning(clickCancel = false, index = 0) {
    this.openDeletePlanning(index);
    this.closeDeletePlanning(clickCancel);
  }

  public openDeletePlanning(index = 0) {
    cy.get('app-plannings-table .mat-row button.mat-warn').eq(index).click();
    this.planningDeleteCancelBtn().should('be.visible');
  }

  public closeDeletePlanning(clickCancel = false) {
    if (clickCancel) {
      this.planningDeleteCancelBtn().click();
    } else {
      this.planningDeleteDeleteBtn().click();
    }
    cy.wait(500);
  }

  public multipleDeletePlannings(all = true, indexesForDelete: number[] = [], clickCancel = false) {
    this.openMultipleDelete(all, indexesForDelete);
    this.closeMultipleDelete(clickCancel);
  }

  public openMultipleDelete(all = true, indexesForDelete: number[] = []) {
    if (all) {
      cy.get('.mat-header-cell mat-checkbox input').check({force: true});
    } else {
      for (let i = 0; i < indexesForDelete.length; i++) {
        cy.get(`.mar-row`).eq(i).find('.cdk-column-MtxGridCheckboxColumnDef input').check({force: true});
      }
    }
    cy.wait(500);
    this.deleteMultiplePluginsBtn().should('be.enabled').click();
    cy.wait(500);
    this.planningsMultipleDeleteCancelBtn().should('be.visible');
  }

  public closeMultipleDelete(clickCancel = false) {
    if (clickCancel) {
      this.planningsMultipleDeleteCancelBtn().click();
    } else {
      this.planningsMultipleDeleteDeleteBtn().click();
    }
    cy.wait(500);
    this.planningCreateBtn().should('be.visible').should('be.enabled');
  }
}

const itemPlanningPage = new ItemPlanningPage();
export default itemPlanningPage;

export class PlanningCreateUpdate {
  public name: string[];
  public folderName: string;
  public eFormName: string;
  public tags?: string[];
  public repeatEvery?: string;
  public repeatType?: 'Dag' | 'Uge' | 'Måned';
  public dayOfWeek?: 'Mandag' | 'Tirsdag' | 'Onsdag' | 'Torsdag' | 'Fredag' | 'Lørdag' | 'Søndag';
  public dayOfMonth?: number;
  public startFrom?: { year: number; month: number; day: number; };
  public repeatUntil?: { year: number; month: number; day: number; };
  public number?: string;
  public description?: string;
  public locationCode?: string;
  public buildYear?: string;
  public type?: string;
  public pushMessageEnabled?: boolean;
  public daysBeforeRedeploymentPushMessage?: number;
}
