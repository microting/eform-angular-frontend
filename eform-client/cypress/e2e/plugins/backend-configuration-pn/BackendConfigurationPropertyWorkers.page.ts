import {PageWithNavbarPage} from '../../PageWithNavbar.page';
import {selectLanguage, selectValueInNgSelector} from '../../helper-functions';

class BackendConfigurationPropertyWorkersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  backendConfigurationPnButton() {
    return cy.get('#backend-configuration-pn')
      .should('be.visible');
  }

  public backendConfigurationPnPropertyWorkers() {
    return cy.get('#backend-configuration-pn-property-workers');
  };

  public backendConfigurationPropertiesPage() {
    return cy.get('button')
      .contains('Backend configuration')
      .click();
  };

  goToPropertyWorkers() {
    this.backendConfigurationPnPropertyWorkers().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.backendConfigurationPnButton().click();
      }
    });
    this.backendConfigurationPnPropertyWorkers().click();
  }

  public createFirstNameInput() {
    return cy.get('#firstName').should('be.visible').should('be.enabled');
  };

  public newDeviceUserBtn() {
    return cy.get('#newDeviceUserBtn').should('be.visible').should('be.enabled');
  };

  public createLastNameInput() {
    return cy.get('#lastName').should('be.visible').should('be.enabled');
  };

  public getFirstRowObject() {
    return new WorkerRowObject().getRow(1);
  };

  public getLastRowObject() {
    return cy.get('tbody > tr:last-of-type');
  };

  public saveCreateBtn() {
    return cy.get('#saveCreateBtn').should('be.visible').should('be.enabled');
  };

  public cancelCreateBtn() {
    return cy.get('#cancelCreateBtn').should('be.visible').should('be.enabled');
  };

  public editFirstNameInput() {
    return cy.get('#firstName').should('be.visible').should('be.enabled');
  };

  public editLastNameInput() {
    return cy.get('#lastName').should('be.visible').should('be.enabled');
  };

  public saveEditBtn() {
    return cy.get('#saveEditBtn').should('be.visible').should('be.enabled');
  };

  public cancelEditBtn() {
    return cy.get('#cancelEditBtn').should('be.visible').should('be.enabled');
  };

  public saveDeleteBtn() {
    return cy.get('#saveDeleteBtn').should('be.visible').should('be.enabled');
  };

  public cancelDeleteBtn() {
    return cy.get('#cancelDeleteBtn').should('be.visible').should('be.enabled');
  };

  public profileLanguageSelector() {
    return cy.get('#profileLanguageSelector');
  };

  public TaskManagementEnableToggleInput() {
    return cy.get('#taskManagementEnabledToggle').should('be.visible').should('be.enabled');
  };

  public profileLanguageSelectorCreate() {
    return cy.get('#profileLanguageSelectorCreate');
  };

  public checkboxEditAssignment(i: number) {
    return cy.get(`#checkboxCreateAssignment${i}-input`);
  };

  public checkboxCreateAssignment(i: number) {
    return cy.get(`#checkboxCreateAssignment${i}`);
  };

  public rowNum() {
    return cy.get('.mat-row').its('length');
  };

  public getDeviceUser(num) {
    return cy.get(`.mat-row:nth-child(${num})`);
  };

  create(propertyWorker, clickCancel = false) {
    this.openCreateModal(propertyWorker);
    this.closeCreateModal(clickCancel);
  }

  openCreateModal(propertyWorker) {
    this.newDeviceUserBtn().should('be.visible').click();
    cy.wait(500);
    this.cancelCreateBtn().should('be.visible');
    if (propertyWorker) {
      if (propertyWorker.name) {
        this.createFirstNameInput().should('be.visible').clear().type(propertyWorker.name);
      }
      if (propertyWorker.surname) {
        this.createLastNameInput().should('be.visible').clear().type(propertyWorker.surname);
      }
      if (propertyWorker.language) {
        selectLanguage('#profileLanguageSelector', propertyWorker.language);
      }
      if (propertyWorker.properties) {
        cy.wait(500);
        for (let i = 0; i < propertyWorker.properties.length; i++) {
          const row = () => cy.get('.mat-row').contains(propertyWorker.properties[i]).parent().parent().parent().scrollIntoView();
          row().find('[id^=checkboxCreateAssignment]mat-checkbox').click();
          cy.wait(500);
        }
      }
      if (propertyWorker.workOrderFlow === true) {
        this.TaskManagementEnableToggleInput().should('be.visible').click();
        cy.wait(500);
      }
    }
  }

  closeCreateModal(clickCancel = false) {
    if (clickCancel) {
      this.cancelCreateBtn().should('be.visible').click();
    } else {
      cy.intercept('PUT', '/api/backend-configuration-pn/properties/assignment/create-device-user').as('createDeviceUser');
      this.saveCreateBtn().should('be.visible').click();
      cy.wait('@createDeviceUser', {timeout: 10000}).then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
      });
    }
    this.newDeviceUserBtn().should('be.visible');
  }

  clearTable() {
    cy.log('**CLEAR WORKERS TABLE**')
    this.rowNum().then(rowNum => {
      for (let i = rowNum; i > 0; i--) {
        this.getFirstRowObject().delete();
        cy.wait(500)
      }
    });
  }
}

const backendConfigurationPropertyWorkersPage = new BackendConfigurationPropertyWorkersPage();
export default backendConfigurationPropertyWorkersPage;

export class WorkerRowObject {
  row: Cypress.Chainable<JQuery<HTMLElement>>;
  editAssignmentsBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  editDeviceUserBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  deleteBtn: Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum: number) {
    const row = () => cy.get('.mat-row').eq(rowNum - 1);
    this.row = row();
    this.editAssignmentsBtn = row().find('[id^=editAssignmentsBtn]').should('be.visible').should('be.enabled');
    this.editDeviceUserBtn = row().find('[id^=editDeviceUserBtn]').should('be.visible').should('be.enabled');
    this.deleteBtn = row().find('[id^=deleteDeviceUserBtn]').should('be.visible').should('be.enabled');
    return this;
  }

  // find first row with text
  getRowByName(deviceUserName: string) {
    const row = () => cy.get('.mat-row')
      .contains(deviceUserName) // div
      .parent() // met-cell
      .parent(); // mat-row
    this.row = row();
    this.editAssignmentsBtn = row().find('[id^=editAssignmentsBtn]').should('be.visible').should('be.enabled');
    this.editDeviceUserBtn = row().find('[id^=editDeviceUserBtn]').should('be.visible').should('be.enabled');
    this.deleteBtn = row().find('[id^=deleteDeviceUserBtn]').should('be.visible').should('be.enabled');
    return this;
  }

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }

  openDeleteModal() {
    this.deleteBtn.click();
    backendConfigurationPropertyWorkersPage.cancelDeleteBtn().should('be.visible');
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      backendConfigurationPropertyWorkersPage.cancelDeleteBtn().click();
    } else {
      cy.intercept('DELETE', '**/api/device-users/delete/*').as('deleteDeviceUser');
      cy.intercept('GET', '**/api/backend-configuration-pn/properties/assignment*').as('getAssignments');
      backendConfigurationPropertyWorkersPage.saveDeleteBtn().click();
      cy.wait('@deleteDeviceUser', {timeout: 10000});
      cy.wait('@getAssignments', {timeout: 10000});
    }
    backendConfigurationPropertyWorkersPage.newDeviceUserBtn().should('be.visible');
  }
}

export class PropertyWorker {
  name?: string;
  surname?: string;
  language?: string;
  properties?: string[];
  workOrderFlow?: boolean;
}
