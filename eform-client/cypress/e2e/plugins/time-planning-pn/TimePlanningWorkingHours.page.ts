import {PageWithNavbarPage} from '../../PageWithNavbar.page';

class TimePlanningWorkingHoursPage extends PageWithNavbarPage {

  timePlanningPnBtn() {
    return cy.get('#time-planning-pn')
      .should('be.visible');
  }

  timePlanningPnWorkingHoursBtn() {
    return cy.get('#time-planning-pn-working-hours');
  }

  goToWorkingHours() {
    this.timePlanningPnWorkingHoursBtn().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.timePlanningPnBtn().click();
      }
    });
    this.timePlanningPnWorkingHoursBtn().click();
  }

  workingHoursExcel() {
    return cy.get('#workingHoursExcel')
      .should('be.visible');
  }

  workingHoursReload() {
    return cy.get('#workingHoursReload')
      .should('be.visible');
  }

  workingHoursSave() {
    return cy.get('#workingHoursSave')
      .should('be.visible');
  }

  workingHoursSite() {
    return cy.get('#workingHoursSite')
      .should('be.visible');
  }

  workingHoursRange() {
    return cy.get('#workingHoursRange')
      .should('be.visible');
  }
}

const timePlanningWorkingHoursPage = new TimePlanningWorkingHoursPage();
export default timePlanningWorkingHoursPage;
