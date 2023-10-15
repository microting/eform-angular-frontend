import {PageWithNavbarPage} from '../../PageWithNavbar.page';

class BackendConfigurationTaskTrackerPage extends PageWithNavbarPage {

  backendConfigurationPnButton() {
    return cy.get('#backend-configuration-pn')
      .should('be.visible');
  }

  backendConfigurationPnTaskTrackerButton() {
    return cy.get('#backend-configuration-pn-task-tracker');
  }

  goToTaskTracker(waitAlias: string = '') {
    if (this.backendConfigurationPnTaskTrackerButton().should('be.not.visible')) {
      this.backendConfigurationPnButton().click();
    }
    this.backendConfigurationPnTaskTrackerButton().click();
    if(waitAlias) {
      cy.wait(waitAlias);
    } else {
      this.waitForSpinnerHide();
    }
  }

  propertyIdFilter() {
    return cy.get('#propertyIdFilter')
      .should('be.visible');
  }

  tagsFilter() {
    return cy.get('#tagsFilter')
      .should('be.visible');
  }

  workersFilter() {
    return cy.get('#workersFilter')
      .should('be.visible');
  }

  cancelSaveColumns() {
    return cy.get('#cancelSaveColumns')
      .should('be.visible')
      .should('be.enabled');
  }

  saveColumns() {
    return cy.get('#saveColumns')
      .should('be.visible')
      .should('be.enabled');
  }

  columnModalProperty() {
    return cy.get('#property')
      .should('be.visible')
      .should('be.enabled');
  }

  columnModalTask() {
    return cy.get('#task')
      .should('be.visible');
  }

  columnModalTags() {
    return cy.get('#tags')
      .should('be.visible');
  }

  columnModalWorkers() {
    return cy.get('#changeColumnsBtn')
      .should('be.visible');
  }

  columnModalStart() {
    return cy.get('#start')
      .should('be.visible');
  }

  columnModalRepeat() {
    return cy.get('#repeat')
      .should('be.visible');
  }

  columnModalDeadline() {
    return cy.get('#deadline')
      .should('be.visible');
  }

  public rowNum(): Cypress.Chainable<number> {
    return cy.get('.mat-row').should('have.length.gt', 0).then($rows => $rows.length);
  }

  getFirstRowObject() {
    const result = new TaskTrackerRowObject();
    return result.getRow(1);
  }

  public getRowObjectByNum(num: number): TaskTrackerRowObject {
    const rowObject = new TaskTrackerRowObject();
    return rowObject.getRow(num);
  }

/*  public getRowObjectByName(name: string): TaskTrackerRowObject {
    let task = null;
    this.rowNum().then(rows => {
      for (let i = 1; i <= rows; i++) {
        const rowObject = this.getRowObjectByNum(i);
        if (rowObject.taskName === name) {
          task = rowObject;
          break;
        }
      }
    });
    return task;
  }*/

  public getRowObjects(maxNum: number): TaskTrackerRowObject[] {
    const rowObjects: TaskTrackerRowObject[] = [];
    for (let i = 1; i <= maxNum; i++) {
      rowObjects.push(this.getRowObjectByNum(i));
    }
    return rowObjects;
  }
}

const backendConfigurationTaskTrackerPage = new BackendConfigurationTaskTrackerPage();
export default backendConfigurationTaskTrackerPage;

export class TaskTrackerRowObject {
  row: Cypress.Chainable<JQuery<HTMLElement>>;
/*  propertyName: string = '';
  taskName: string = '';
  tags: string[] = [];
  workerNames: string[] = [];
  startDate: string = ''; // date
  repeat: string = '';
  deadline: string = ''; // date
  nextDeployDay: number = 0;*/

  getRow(rowNum: number) {
    this.row = cy.get('.mat-row').eq(rowNum - 1);
    // if (this.row && this.row.should('exist')) {
    //   this.row.then((row) => {
    //     this.propertyName = row.find('.property').get((x, text) => {
    //
    //     });
    //   })
    //   this.row.find('.property').invoke('text').then(x => this.propertyName = x);
    //   cy.get('.mat-row').eq(rowNum - 1).find('.task').invoke('text').then(x => this.taskName = x);
    //   // this.row.find('.tags').invoke('text').then(x => this.tags = x.split(', '));
    //   cy.get('.mat-row').eq(rowNum - 1).find('.worker').invoke('text').then(x => this.workerNames = x.split(', '));
    //   cy.get('.mat-row').eq(rowNum - 1).find('.startTask').invoke('text').then(x => this.startDate = x);
    //   cy.get('.mat-row').eq(rowNum - 1).find('.repeat').invoke('text').then(x => this.repeat = x);
    //   cy.get('.mat-row').eq(rowNum - 1).find('.deadlineTask').invoke('text').then(x => this.deadline = x);
    //   cy.get('.mat-row').eq(rowNum - 1).find('.tasks.yellow').invoke('classNames').then((x: string[]) => {
    //     let classNameWithDay = x.find(y => y.includes('task-day-'));
    //     if (classNameWithDay) {
    //       this.nextDeployDay = +(/\d+/.exec(classNameWithDay)[0]);
    //     }
    //   });
    // }
    return this;
  }
}
