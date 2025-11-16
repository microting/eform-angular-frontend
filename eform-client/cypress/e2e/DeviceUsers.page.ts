import { PageWithNavbarPage } from './PageWithNavbar.page';
import { expect } from 'chai';

class DeviceUsersPage extends PageWithNavbarPage{
  newDeviceUserBtn() {
    // @ts-ignore
    return cy.get('#newDeviceUserBtn')
      .should('be.visible')
      .should('be.enabled');
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

  getFirstRowObject() {
    const result = new DeviceUsersRowObject();
    return result.getRow(1);
  }

  saveCreateBtn() {
    // @ts-ignore
    return cy.get('#saveCreateBtn')
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
    return cy.get('#firstName')
      .should('be.visible')
      .should('be.enabled');
  }

  editLastNameInput() {
    // @ts-ignore
    return cy.get('#lastName')
      .should('be.visible')
      .should('be.enabled');
  }

  saveEditBtn() {
    // @ts-ignore
    return cy.get('#saveEditBtn')
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
    return cy.wait(500).then(() => {
      return cy.get('tbody').then($tbody => {
        return $tbody.find('tr').length;
      });
    });
  }

  public getDeviceUser(num: number): DeviceUsersRowObject {
    const deviceUser = new DeviceUsersRowObject();
    deviceUser.getRow(num);
    return deviceUser;
  }

  public getDeviceUserByName(name: string): DeviceUsersRowObject {
    let deviceUser = null;
    this.rowNum().then(rows => {
      for (let i = 1; i <= rows; i++) {
        const currentUser = this.getDeviceUser(i);
        if (currentUser.firstName === name) {
          deviceUser = currentUser;
          break;
        }
      }
    });
    return deviceUser;
  }

  public getDeviceUsersList(maxNum: number): DeviceUsersRowObject[] {
    const users: DeviceUsersRowObject[] = [];
    for (let i = 1; i <= maxNum; i++) {
      users.push(this.getDeviceUser(i));
    }
    return users;
  }

  public createNewDeviceUser(firstName: string, lastName: string): void {
    // @ts-ignore
    cy.get('#newDeviceUserBtn').should('be.visible').click();
    // @ts-ignore
    cy.get('#createFirstNameInput').should('be.visible').type(firstName);
    // @ts-ignore
    cy.get('#createLastNameInput').should('be.visible').type(lastName);
    // @ts-ignore
    cy.get('#saveCreateBtn').should('be.visible').click();
    // @ts-ignore
    cy.get('#spinner-animation').should('not.exist');
    // @ts-ignore
    cy.get('#newDeviceUserBtn').should('be.visible');
  }

  public createDeviceUserFromScratch(name: string, surname: string): void {
    this.Navbar.goToDeviceUsersPage();
    // @ts-ignore
    cy.get('#newDeviceUserBtn').should('be.visible');
    this.rowNum().then(rowsBefore => {
      this.createNewDeviceUser(name, surname);
      this.rowNum().then(rowsAfter => {
        expect(rowsAfter).to.eq(rowsBefore + 1);
        const lastDeviceUser = this.getDeviceUser(rowsAfter);
        expect(lastDeviceUser.firstName).to.eq(name);
        expect(lastDeviceUser.lastName).to.eq(surname);
      });
    });
  }

  public editDeviceUser(
    deviceUser: DeviceUsersRowObject,
    name = '',
    surname = ''
  ): void {
    const index = deviceUser.index - 1;
    deviceUser.openRowMenu();
    cy.get(`#editDeviceUserBtn${index}`).should('be.visible').click();
    // @ts-ignore
    cy.get('#firstName').should('be.visible');
    if (name !== '') {
      // @ts-ignore
      cy.get('#firstName').click().clear().type(name);
    }
    if (surname !== '') {
      // @ts-ignore
      cy.get('#lastName').click().clear().type(surname);
    }
    // @ts-ignore
    cy.get('#saveEditBtn').should('be.visible').click();
    // @ts-ignore
    cy.get('#newDeviceUserBtn').should('be.visible');
  }
}

const deviceUsersPage = new DeviceUsersPage();
export default deviceUsersPage;

export class DeviceUsersRowObject {
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
    if (cy.get('#deviceUserId').eq(rowNum - 1).should('exist')) {
      // @ts-ignore
      this.siteId = +(cy.get('#deviceUserId').eq(rowNum - 1).invoke('text'));
      // @ts-ignore
      this.firstName = cy.get('#deviceUserFirstName').eq(rowNum - 1).invoke('text').catch(() => '');
      // @ts-ignore
      this.lastName = cy.get('#deviceUserLastName').eq(rowNum - 1).invoke('text').catch(() => '');
      // @ts-ignore
      this.editBtn = cy.get('#editDeviceUserBtn').eq(rowNum - 1);
      // @ts-ignore
      this.deleteBtn = cy.get('#deleteDeviceUserBtn').eq(rowNum - 1);
    }
    return this;
  }

  openRowMenu() {
    const index = this.index - 1;
    cy.get(`#action-items-${index} #actionMenu`).should('be.visible').click();
    cy.wait(200);
  }

  delete() {
    const index = this.index - 1;
    this.openRowMenu();
    cy.get(`#deleteDeviceUserBtn${index}`).should('be.visible').click();
    deviceUsersPage.saveDeleteBtn().should('be.visible').click();
    // @ts-ignore
    cy.get('#spinner-animation').should('not.exist', { timeout: 40000 });
    deviceUsersPage.newDeviceUserBtn().should('be.visible');
  }
}
