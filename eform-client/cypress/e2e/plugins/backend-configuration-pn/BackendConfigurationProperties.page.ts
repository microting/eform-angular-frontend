import {PageWithNavbarPage} from '../../PageWithNavbar.page';
import backendConfigurationAreaRulesPage from './BackendConfigurationAreaRules.page';

class BackendConfigurationPropertiesPage extends PageWithNavbarPage {

  backendConfigurationPnButton() {
    return cy.get('#backend-configuration-pn')
      .should('be.visible');
  }

  backendConfigurationPnPropertiesButton() {
    return cy.get('#backend-configuration-pn-properties');
  }

  goToProperties() {
    this.backendConfigurationPnPropertiesButton().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.backendConfigurationPnButton().click();
      }
    });
    this.backendConfigurationPnPropertiesButton().click();
    cy.get('app-properties-container').should('be.visible');
    // this.waitForSpinnerHide();
  }

  propertyCreateBtn() {
    return cy.get('#propertyCreateBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  createPropertyName() {
    return cy.get('#createPropertyName')
      .should('be.visible');
  }

  createCHRNumber() {
    return cy.get('#createCHRNumber')
      .should('be.visible');
  }

  createCVRNumber() {
    return cy.get('#createCVRNumber')
      .should('be.visible');
  }

  createPropertyAddress() {
    return cy.get('#createPropertyAddress')
      .should('be.visible');
  }

  checkboxCreatePropertySelectLanguage(languageId: number) {
    return cy.get(`#checkboxCreatePropertySelectLanguage${languageId}`)
      .should('be.visible')
      .should('be.enabled');
  }

  propertyCreateSaveBtn() {
    return cy.get('#propertyCreateSaveBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  propertyCreateSaveCancelBtn() {
    return cy.get('#propertyCreateSaveCancelBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  public propertyDeleteDeleteBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#propertyDeleteDeleteBtn').should('be.visible').should('be.enabled');
  }

  public propertyDeleteCancelBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#propertyDeleteCancelBtn').should('be.visible').should('be.enabled');
  }

  public editPropertyName(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#editPropertyName').should('be.visible');
  }

  public editCHRNumber(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#editCHRNumber').should('be.visible');
  }

  public editCVRNumber(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#editCVRNumber').should('be.visible');
  }

  public editPropertyAddress(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#editPropertyAddress').should('be.visible');
  }

  public checkboxEditPropertySelectLanguage(languageId: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`#checkboxEditPropertySelectLanguage${languageId}`);
  }

  public propertyEditSaveBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#propertyEditSaveBtn').should('be.visible');
  }

  public propertyEditSaveCancelBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#propertyEditSaveCancelBtn').should('be.visible').should('be.enabled');
  }

  public editPropertyAreasViewSaveBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#editPropertyAreasViewSaveBtn').should('be.visible');
  }

  public editPropertyAreasViewCloseBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#editPropertyAreasViewCloseBtn').should('be.visible');
  }

  public propertyAreasViewCloseBtn() {
    return cy.get('#propertyAreasViewCloseBtn')
      .should('be.visible')
      .should('be.enabled');
  };

  public propertyCreateWorkorderFlowEnableToggle() {
    return cy.get(`[for='propertyCreateWorkorderFlowEnableToggle-input']`);
  };

  public propertyEditWorkorderFlowEnableToggleInput() {
    return cy.get('#propertyEditWorkorderFlowEnableToggle')
      .should('be.visible');
  };

  public propertyEditWorkorderFlowEnableToggle() {
    return cy.get(`[for='propertyEditWorkorderFlowEnableToggle']`);
  };

  public configurePropertyAreasBtn() {
    return cy.get('#configurePropertyAreasBtn')
      .should('be.visible')
      .should('be.enabled');
  };

  public navigateToPropertyArea(i) {
    return cy.get(`#navigateToPropertyArea`).eq(i)
      .should('be.visible')
      .should('be.enabled');
  };

  public rowNum(): Cypress.Chainable<number> {
    return cy.get('app-properties-table .mat-row').its('length');
  }

  createProperty(property: PropertyCreateUpdate, clickCancel = false) {
    this.openCreatePropertyModal(property);
    this.closeCreatePropertyModal(clickCancel);
  }

  openCreatePropertyModal(property: PropertyCreateUpdate) {
    this.propertyCreateBtn().click();
    this.propertyCreateSaveCancelBtn().should('be.visible').should('be.enabled');
    if (property) {
      if (property.cvrNumber) {
        this.createCVRNumber().should('be.visible').type(property.cvrNumber);
      }
      if (property.name) {
        this.createPropertyName().should('be.visible').type(property.name);
      }
      if (property.chrNumber) {
        this.createCHRNumber().should('be.visible').type(property.chrNumber);
      }
      if (property.address) {
        this.createPropertyAddress().should('be.visible').type(property.address);
      }
      /*if (property.selectedLanguages) {
        for (let i = 0; i < property.selectedLanguages.length; i++) {
          let languageId = 0;
          if (property.selectedLanguages[i].languageId) {
            languageId = property.selectedLanguages[i].languageId;
          } else {
            languageId = applicationLanguages.find(
              (x) => x.text === property.selectedLanguages[i].languageName
            ).id;
          }
          cy.get(`#checkboxCreatePropertySelectLanguage-${languageId}`).parent().click();
        }
      }*/
      if (property.workOrderFlow === true) {
        this.propertyCreateWorkorderFlowEnableToggle().click();
        cy.wait(500);
      }
    }
  }

  closeCreatePropertyModal(clickCancel = false) {
    if (clickCancel) {
      this.propertyCreateSaveCancelBtn().click();
    } else {
      cy.intercept('POST', '/api/backend-configuration-pn/properties/index').as('createProperty');
      this.propertyCreateSaveBtn().click();
      cy.wait('@createProperty', { timeout: 60000 });
    }
    cy.wait(500);
    this.propertyCreateBtn().should('be.visible').should('be.enabled');
  }

  getFirstRowObject() {
    const result = new PropertyRowObject();
    return result.getRow(1);
  }

  public getRowObjectByNum(num: number): PropertyRowObject {
    const rowObject = new PropertyRowObject();
    return rowObject.getRow(num);
  }

  public getRowObjectByName(name: string): PropertyRowObject {
    return new PropertyRowObject().getRowByPropertyName(name);
  }

  public getRowObjects(maxNum: number): PropertyRowObject[] {
    const rowObjects: PropertyRowObject[] = [];
    for (let i = 1; i <= maxNum; i++) {
      rowObjects.push(this.getRowObjectByNum(i));
    }
    return rowObjects;
  }

  clearTable() {
    cy.log('**CLEAR PROPERTIES TABLE**');
    cy.get('app-properties-table').should('be.visible');
    cy.get('app-properties-table .mat-row').then(rows => {
      const rowNum = rows.length;
      cy.log(rowNum.toString());

      for (let i = rowNum; i > 0; i--) {
        this.getFirstRowObject().delete();
        cy.wait(500);
      }
    });
  }
}

const backendConfigurationPropertiesPage = new BackendConfigurationPropertiesPage();
export default backendConfigurationPropertiesPage;

export class PropertyRowObject {
  row: Cypress.Chainable<JQuery<HTMLElement>>;
  viewAreasBtn: () => Cypress.Chainable<JQuery<HTMLElement>>;
  editPropertyBtn: () => Cypress.Chainable<JQuery<HTMLElement>>;
  deleteBtn: () => Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum: number) {
    const row = () => cy.get('.mat-row').eq(rowNum - 1);
    this.row = row();
    this.viewAreasBtn = () => row().find('[id^=showPropertyAreasBtn]').should('be.visible').should('be.enabled');
    this.editPropertyBtn = () => row().find('[id^=editPropertyBtn]').should('be.visible').should('be.enabled');
    this.deleteBtn = () => row().find('[id^=deletePropertyBtn]').should('be.visible').should('be.enabled');
    return this;
  }

  // find first row with text
  getRowByPropertyName(propertyName: string) {
    const row = () => cy.get('.mat-row')
      .contains(propertyName) // div
      .parent() // met-cell
      .parent(); // mat-row
    this.row = row();
    this.viewAreasBtn = () => row().find('[id^=showPropertyAreasBtn]').should('be.visible').should('be.enabled');
    this.editPropertyBtn = () => row().find('[id^=editPropertyBtn]').should('be.visible').should('be.enabled');
    this.deleteBtn = () => row().find('[id^=deletePropertyBtn]').should('be.visible').should('be.enabled');
    return this;
  }

  goToAreas() {
    this.viewAreasBtn().click();
    backendConfigurationPropertiesPage.configurePropertyAreasBtn().should('be.visible');
  }

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }

  openDeleteModal() {
    this.deleteBtn().click();
    backendConfigurationPropertiesPage.propertyDeleteCancelBtn().should('be.visible');
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      backendConfigurationPropertiesPage.propertyDeleteCancelBtn().click();
    } else {
      cy.intercept('DELETE', '**/api/backend-configuration-pn/properties*').as('deleteProperty');
      backendConfigurationPropertiesPage.propertyDeleteDeleteBtn().click();
      cy.wait('@deleteProperty', {timeout: 10000});
    }
    backendConfigurationPropertiesPage.propertyCreateBtn().should('be.enabled');
  }

  bindAreasByName(areasName: string[] = [], clickCancel = false, returnToProperties = false) {
    this.openBindAreasModal();
    for (let i = 0; i < areasName.length; i++) {
      const row = () => cy.get('mat-dialog-container .mat-row').contains(areasName[i]).parent().scrollIntoView();
      row().find('mat-checkbox').click();
    }
    this.closeBindAreasModal(clickCancel, returnToProperties);
  }

  bindAreasByNumberInTable(areasName: number[] = [], clickCancel = false, returnToProperties = false) {
    this.openBindAreasModal();
    for (let i = 0; i < areasName.length; i++) {
      const row = () => cy.get('mat-dialog-container .mat-row').its(areasName[i]).scrollIntoView();
      row().find('mat-checkbox').click();
    }
    this.closeBindAreasModal(clickCancel, returnToProperties);
  }

  bindAllAreas(clickCancel = false, returnToProperties = false) {
    this.openBindAreasModal();
    const row = () => cy.get('mat-dialog-container .mat-row').parent().parent().parent().scrollIntoView();
    row().find('mat-checkbox').click({force: true});
    this.closeBindAreasModal(clickCancel, returnToProperties);
  }

  openBindAreasModal() {
    backendConfigurationPropertiesPage.configurePropertyAreasBtn().click();
    backendConfigurationPropertiesPage.editPropertyAreasViewCloseBtn().should('be.visible');
  }

  closeBindAreasModal(clickCancel = false, returnToProperties = false) {
    if (clickCancel) {
      backendConfigurationPropertiesPage.editPropertyAreasViewCloseBtn().click();
    } else {
      cy.intercept('PUT', '/api/backend-configuration-pn/property-areas').as('bindAreas');
      //cy.intercept('GET', '/api/backend-configuration-pn/property-areas').as('getProperties');
      backendConfigurationPropertiesPage.editPropertyAreasViewSaveBtn().click();
      cy.wait('@bindAreas', {timeout: 60000});
      //cy.wait('@getProperties', {timeout: 60000});
    }
    backendConfigurationPropertiesPage.configurePropertyAreasBtn().should('be.visible');
    if (returnToProperties) {
      backendConfigurationPropertiesPage.goToProperties();
    }
  }

  goToPropertyAreaByName(nameBindArea: string, needGoToPropertyAreasPage = false) {
    if (needGoToPropertyAreasPage) {
      this.goToAreas();
    }
    const row = cy.get('.mat-row').contains(nameBindArea);
    //const row = () => cy.get('.mat-row').contains(nameBindArea).scrollIntoView();
    row.parent().parent().scrollIntoView();
    const navigateBtn = row.get('.cdk-column-book > div').find('#navigateToPropertyArea');
    navigateBtn.click();
    backendConfigurationAreaRulesPage.ruleCreateBtn().should('be.visible');
  }
}

export class PropertyCreateUpdate {
  name?: string;
  chrNumber?: string;
  cvrNumber?: string;
  address?: string;
  workOrderFlow?: boolean;
}
