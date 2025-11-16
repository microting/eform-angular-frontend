import { PageWithNavbarPage } from './PageWithNavbar.page';
import { expect } from 'chai';

class WorkersPage extends PageWithNavbarPage {
  newWorkerBtn() {
    // @ts-ignore
    return cy.get('#workerCreateBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  workerSelector() {
    // @ts-ignore
    return cy.get('#workerSelector')
      .should('be.visible');
  }

  createFirstNameInput() {
    // @ts-ignore
    return cy.get('#firstName')
      .should('be.visible')
      .should('be.enabled');
  }

  createLastNameInput() {
    // @ts-ignore
    return cy.get('#lastName')
      .should('be.visible')
      .should('be.enabled');
  }

  saveCreateBtn() {
    // @ts-ignore
    return cy.get('#workerSaveBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  cancelCreateBtn() {
    // @ts-ignore
    return cy.get('#cancelCreateBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  editFirstNameInput() {
    // @ts-ignore
    return cy.get('#firstNameEdit')
      .should('be.visible')
      .should('be.enabled');
  }

  editLastNameInput() {
    // @ts-ignore
    return cy.get('#lastNameEdit')
      .should('be.visible')
      .should('be.enabled');
  }

  saveEditBtn() {
    // @ts-ignore
    return cy.get('#workerEditSaveBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  cancelEditBtn() {
    // @ts-ignore
    return cy.get('#cancelEditBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  saveDeleteBtn() {
    // @ts-ignore
    return cy.get('#saveDeleteBtn')
      .should('be.visible')
      .should('be.enabled');
  }

  // @ts-ignore
  public cancelDeleteBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    // @ts-ignore
    return cy.get('#cancelDeleteBtn').should('be.visible').should('be.enabled');
  }

  // @ts-ignore
  public rowNum(): Cypress.Chainable<number> {
    // @ts-ignore
    return cy.get('#tableBody > tr').should('have.length.gt', 0).then($rows => $rows.length);
  }

  public getWorker(num: number): WorkersRowObject {
    const worker = new WorkersRowObject();
    worker.getRow(num);
    return worker;
  }

  public createNewWorker(firstName: string, lastName: string, deviceUserName: string): void {
    // @ts-ignore
    cy.get('#workerCreateBtn').should('be.visible').click();
    // @ts-ignore
    cy.get('#firstName').should('be.visible');
    // Select device user from dropdown
    // @ts-ignore
    cy.get('#workerSelector').should('be.visible').click();
    cy.wait(500);
    // Find and click the device user in the dropdown
    // @ts-ignore
    cy.contains('.custom', deviceUserName).should('be.visible').click();
    cy.wait(500);
    // @ts-ignore
    cy.get('#firstName').should('be.visible').type(firstName);
    // @ts-ignore
    cy.get('#lastName').should('be.visible').type(lastName);
    cy.wait(500);
    // @ts-ignore
    cy.get('#workerSaveBtn').should('be.visible').click();
    // @ts-ignore
    cy.get('#spinner-animation').should('not.exist');
    // @ts-ignore
    cy.get('#workerCreateBtn').should('be.visible');
  }

  public editWorker(
    worker: WorkersRowObject,
    firstName = '',
    lastName = ''
  ): void {
    const index = worker.index - 1;
    worker.openRowMenu();
    cy.get(`#workerEditBtn${index}`).should('be.visible').click();
    // @ts-ignore
    cy.get('#firstNameEdit').should('be.visible');
    if (firstName !== '') {
      // @ts-ignore
      cy.get('#firstNameEdit').click().clear().type(firstName);
    }
    if (lastName !== '') {
      // @ts-ignore
      cy.get('#lastNameEdit').click().clear().type(lastName);
    }
    cy.wait(500);
    // @ts-ignore
    cy.get('#workerEditSaveBtn').should('be.visible').click();
    // @ts-ignore
    cy.get('#spinner-animation').should('not.exist');
    // @ts-ignore
    cy.get('#workerCreateBtn').should('be.visible');
  }
}

const workersPage = new WorkersPage();
export default workersPage;

export class WorkersRowObject {
  index: number;
  siteId: number;
  firstName: string;
  lastName: string;
  // @ts-ignore
  editBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  // @ts-ignore
  deleteBtn: Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum: number) {
    this.index = rowNum;
    // @ts-ignore
    if (cy.get('#workerUID').eq(rowNum - 1).should('exist')) {
      // @ts-ignore
      this.siteId = +(cy.get('#workerUID').eq(rowNum - 1).invoke('text'));
      // @ts-ignore
      this.firstName = cy.get('#workerFirstName').eq(rowNum - 1).invoke('text').catch(() => '');
      // @ts-ignore
      this.lastName = cy.get('#workerLastName').eq(rowNum - 1).invoke('text').catch(() => '');
      // @ts-ignore
      this.editBtn = cy.get('#workerEditBtn').eq(rowNum - 1);
      // @ts-ignore
      this.deleteBtn = cy.get('#workerDeleteBtn').eq(rowNum - 1);
    }
    return this;
  }

  openRowMenu() {
    const index = this.index - 1;
    cy.get(`#action-items-${index} #actionMenu`).should('be.visible').click();
    cy.wait(200);
  }
}
