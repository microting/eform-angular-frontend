import loginPage from '../../../Login.page';

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 0-indexed
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Utility to get Monday of a week given a base date
const getMonday = (baseDate: Date): Date => {
  const dayOfWeek = baseDate.getDay(); // 0 (Sun) to 6 (Sat)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diffToMonday);
  return monday;
};

const getSunday = (monday: Date): Date => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
};

// Utility to generate a full week from a given Monday
const getWeekDates = (monday: Date): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
};

// Get reference point (today)

const today = new Date();

// Last week
const lastWeekBase = new Date(today);
lastWeekBase.setDate(today.getDate() - 7);
const lastWeekMonday = getMonday(lastWeekBase);
const lastWeekSunday = getSunday(lastWeekMonday);
const lastWeekDates = getWeekDates(lastWeekMonday);

// This week
const thisWeekMonday = getMonday(today);
const thisWeekSunday = getSunday(thisWeekMonday);
const thisWeekDates = getWeekDates(thisWeekMonday);

// Next week
const nextWeekBase = new Date(today);
nextWeekBase.setDate(today.getDate() + 7);
const nextWeekMonday = getMonday(nextWeekBase);
const nextWeekSunday = getSunday(nextWeekMonday);
const nextWeekDates = getWeekDates(nextWeekMonday);

// 2 weeks in the future
const futureWeekBase = new Date(today);
futureWeekBase.setDate(today.getDate() + 14);
const futureWeekMonday = getMonday(futureWeekBase);
const futureWeekSunday = getSunday(futureWeekMonday);
const futureWeekDates = getWeekDates(futureWeekMonday);

const filters = [
  {
    dateRange: {
      yearFrom: lastWeekMonday.getFullYear(),
      monthFrom: lastWeekMonday.getMonth() + 1, // getMonth() returns 0-indexed month
      dayFrom: lastWeekMonday.getDate(),
      yearTo: lastWeekSunday.getFullYear(),
      monthTo: lastWeekSunday.getMonth() + 1,
      dayTo: lastWeekSunday.getDate(),
    },
  },
];

const filtersNextWeek = [
  {
    dateRange: {
      yearFrom: nextWeekMonday.getFullYear(),
      monthFrom: nextWeekMonday.getMonth() + 1,
      dayFrom: nextWeekMonday.getDate(),
      yearTo: nextWeekSunday.getFullYear(),
      monthTo: nextWeekSunday.getMonth() + 1,
      dayTo: nextWeekSunday.getDate(),
    },
  },
];

const filtersFutureWeek = [
  {
    dateRange: {
      yearFrom: futureWeekMonday.getFullYear(),
      monthFrom: futureWeekMonday.getMonth() + 1,
      dayFrom: futureWeekMonday.getDate(),
      yearTo: futureWeekSunday.getFullYear(),
      monthTo: futureWeekSunday.getMonth() + 1,
      dayTo: futureWeekSunday.getDate(),
    },
  },
];

const secondUpdatePlanTexts = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert89:27', flexToDate: '97:27', flexIncludingToday: '89:27', nettoHours: '', todaysFlex: '-8:00', paidOutFlex: 0, calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: '07:50 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert82:17', flexToDate: '89:27', flexIncludingToday: '82:17', nettoHours: '', todaysFlex: '-7:10', paidOutFlex: 0, calculatedHours: '7.166666666666667', plannedStartOfShift1: '07:50', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: '07:15 - 16:00 / 01:00', secondShift: '17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert72:02', flexToDate: '82:17', flexIncludingToday: '72:02', nettoHours: '', todaysFlex: '-10:15', paidOutFlex: 0, calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:30', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert65:02', flexToDate: '72:02', flexIncludingToday: '65:02', nettoHours: '', todaysFlex: '-7:00', paidOutFlex: 0, calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:50', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert58:22', flexToDate: '65:02', flexIncludingToday: '58:22', nettoHours: '', todaysFlex: '-6:40', paidOutFlex: 0, calculatedHours: '6.666666666666667', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:50', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:50', secondShift: '18:00 - 20:00 / 00:50', plannedHours: '8:00', flexBalanceToDate: 'swap_vert52:02', flexToDate: '58:22', flexIncludingToday: '52:02', nettoHours: '', todaysFlex: '-6:20', paidOutFlex: 0, calculatedHours: '6.333333333333333', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:50', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:50' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert44:32', flexToDate: '52:02', flexIncludingToday: '44:32', nettoHours: '', todaysFlex: '-7:30', paidOutFlex: 0, calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const secondUpdateActualTexts = [
  { date: nextWeekDates[0], start1StartedAt: '07:30', stop1StoppedAt: '15:30', pause1Id: '00:25', start2StartedAt: '', stop2StoppedAt: '', pause2Id: '', plannedHours: '8:00', flexBalanceToDate: 'swap_vert97.03', flexToDate: '97.45', flexIncludingToday: '97.03', nettoHours: '7.58', todaysFlex: '-0.42', paidOutFlex: 0, calculatedHours: '8' },
  { date: nextWeekDates[1], start1StartedAt: '07:50', stop1StoppedAt: '16:00', pause1Id: '01:00', start2StartedAt: '', stop2StoppedAt: '', pause2Id: '', plannedHours: '8:00', flexBalanceToDate: 'swap_vert97.03', flexToDate: '97.03', flexIncludingToday: '97.03', nettoHours: '7.17', todaysFlex: '0.00', paidOutFlex: 0, calculatedHours: '7.166666666666667' },
  { date: nextWeekDates[2], start1StartedAt: '07:15', stop1StoppedAt: '16:00', pause1Id: '01:00', start2StartedAt: '17:00', stop2StoppedAt: '20:00', pause2Id: '00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert97.03', flexToDate: '97.03', flexIncludingToday: '97.03', nettoHours: '10.25', todaysFlex: '0.00', paidOutFlex: 0, calculatedHours: '10.25' },
  { date: nextWeekDates[3], start1StartedAt: '06:00', stop1StoppedAt: '12:00', pause1Id: '00:30', start2StartedAt: '18:00', stop2StoppedAt: '20:00', pause2Id: '00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert97.03', flexToDate: '97.03', flexIncludingToday: '97.03', nettoHours: '7.00', todaysFlex: '0.00', paidOutFlex: 0, calculatedHours: '7' },
  { date: nextWeekDates[4], start1StartedAt: '06:00', stop1StoppedAt: '12:00' , pause1Id: '01:50' , start2StartedAt: '18:00' , stop2StoppedAt: '20:00' , pause2Id: '01:50' , plannedHours: '8.0' , flexBalanceToDate: 'swap_vert94.70' , flexToDate: '97.03' , flexIncludingToday: '94.70' , nettoHours: '4.33' , todaysFlex: '-2.33' , paidOutFlex : 0, calculatedHours : 6.666666666666667 },
  { date : nextWeekDates[5] , start1StartedAt : '' , stop1StoppedAt : '' , pause1Id : '' , start2StartedAt : '' , stop2StoppedAt : '' , pause2Id : '' , plannedHours : '' , flexBalanceToDate : 'swap_vert88.36' , flexToDate : '94.70' , flexIncludingToday : '88.36' , nettoHours : '0.00' , todaysFlex : '-6.33' , paidOutFlex : 0 , calculatedHours : 6.333333333333333 },
  { date : lastWeekDates[6] , start1StartedAt : '06:00' , stop1StoppedAt : '14:00' , pause1Id : '00:30' , start2StartedAt : '' , stop2StoppedAt : '' , pause2Id : '' , plannedHours : '8:00' , flexBalanceToDate : 'swap_vert88.36' , flexToDate : '88.36' , flexIncludingToday : '88.36' , nettoHours : '7.50' , todaysFlex : '0.00' , paidOutFlex : 0 , calculatedHours : '7.5' }
];

describe('Dashboard edit values', () => {
  beforeEach(() => {
    cy.task('log', '[Folder b - Dashboard Edit B] ========== BeforeEach: Setting up test ==========');
    cy.task('log', '[Folder b - Dashboard Edit B] Visiting homepage and logging in');
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.task('log', '[Folder b - Dashboard Edit B] Login completed');
  });



  it('should edit time registration in last week', () => {
    cy.task('log', '[Folder b - Dashboard Edit B] ========== Test: Edit time registration in last week ==========');
    cy.task('log', '[Folder b - Dashboard Edit B] Clicking Timeregistrering menu');
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.task('log', '[Folder b - Dashboard Edit B] Setting up intercept for index-update');
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.task('log', '[Folder b - Dashboard Edit B] Clicking Dashboard menu');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.task('log', '[Folder b - Dashboard Edit B] Clicking backwards button');
    cy.get('#backwards').click();
    cy.task('log', '[Folder b - Dashboard Edit B] Waiting for index-update API call (60s timeout)');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Edit B] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Edit B] Index updated successfully');
    // cy.get('#plannedHours0').should('include.text', '21:00');

    cy.task('log', '[Folder b - Dashboard Edit B] Starting loop to edit actual time registrations (7 days)');
    for (let i = 0; i < secondUpdatePlanTexts.length; i++) {
      cy.task('log', `[Folder b - Dashboard Edit B] Processing day ${i}: date=${secondUpdatePlanTexts[i].date}`);

      let cellId = `#cell3_${i}`;
      cy.task('log', `[Folder b - Dashboard Edit B] Clicking cell3_${i} to open dialog`);
      cy.get(cellId).scrollIntoView();
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Edit B] Setting actual times: start=${secondUpdateActualTexts[i].start1StartedAt}, stop=${secondUpdateActualTexts[i].stop1StoppedAt}`);

      if (secondUpdateActualTexts[i].start1StartedAt !== '' && secondUpdateActualTexts[i].start1StartedAt !== '00:00') {
        cy.get('[data-testid="start1StartedAt"]').click();
        // eslint-disable-next-line max-len
        let degrees0 = 360 / 12 * parseInt(secondUpdateActualTexts[i].start1StartedAt.split(':')[0]);
        let minuteDegrees0 = 360 / 60 * parseInt(secondUpdateActualTexts[i].start1StartedAt.split(':')[1]);
        if (degrees0 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees0 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (degrees0 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees0 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees0 > 0) {
          cy.get('[style="transform: rotateZ(' + minuteDegrees0 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        cy.get('.timepicker-button span').contains('Ok').click();
      }
      cy.get('[data-testid="start1StartedAt"]').should('have.value', secondUpdateActualTexts[i].start1StartedAt);

      if (secondUpdateActualTexts[i].stop1StoppedAt !== '' && secondUpdateActualTexts[i].stop1StoppedAt !== '00:00') {
        cy.get('[data-testid="stop1StoppedAt"]').click();
        // eslint-disable-next-line max-len
        let degrees1 = 360 / 12 * parseInt(secondUpdateActualTexts[i].stop1StoppedAt.split(':')[0]);
        let minuteDegrees1 = 360 / 60 * parseInt(secondUpdateActualTexts[i].stop1StoppedAt.split(':')[1]);
        if (degrees1 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees1 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (degrees1 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees1 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees1 > 0) {
          cy.get('[style="transform: rotateZ(' + minuteDegrees1 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        if (minuteDegrees1 === 0) {
          cy.get('[style="transform: rotateZ(360deg) translateX(-50%);"] > span').click();
        }
        cy.get('.timepicker-button span').contains('Ok').click();
      }
      cy.get('[data-testid="stop1StoppedAt"]').should('have.value', secondUpdateActualTexts[i].stop1StoppedAt);

      if (secondUpdateActualTexts[i].pause1Id !== '' && secondUpdateActualTexts[i].pause1Id !== '00:00') {
        cy.get('[data-testid="pause1Id"]').click();
        // eslint-disable-next-line max-len
        let degrees2 = 360 / 12 * parseInt(secondUpdateActualTexts[i].pause1Id.split(':')[0]);
        let minuteDegrees2 = 360 / 60 * parseInt(secondUpdateActualTexts[i].pause1Id.split(':')[1]);
        if (degrees2 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees2 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (degrees2 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees2 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees2 > 0) {
          cy.get('[style="transform: rotateZ(' + minuteDegrees2 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        if (minuteDegrees2 === 0) {
          cy.get('[style="transform: rotateZ(360deg) translateX(-50%);"] > span').click();
        }
        cy.get('.timepicker-button span').contains('Ok').click();
        cy.get('[data-testid="pause1Id"]').should('have.value', secondUpdateActualTexts[i].pause1Id);
      } else {
        cy.get('[data-testid="pause1Id"]').should('have.value', '');
      }

      if (secondUpdateActualTexts[i].start2StartedAt !== '' && secondUpdateActualTexts[i].start2StartedAt !== '00:00') {
        cy.get('[data-testid="start2StartedAt"]').click();
        // eslint-disable-next-line max-len
        let degrees3 = 360 / 12 * parseInt(secondUpdateActualTexts[i].start2StartedAt.split(':')[0]);
        let minuteDegrees3 = 360 / 60 * parseInt(secondUpdateActualTexts[i].start2StartedAt.split(':')[1]);
        if (degrees3 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees3 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (!degrees3 || isNaN(degrees3) || degrees3 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees3 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees3 > 0) {
          cy.get('[style="transform: rotateZ(' + minuteDegrees3 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        if (!minuteDegrees3 || isNaN(minuteDegrees3) || minuteDegrees3 === 0) {
          cy.get('[style="transform: rotateZ(360deg) translateX(-50%);"] > span').click();
        }
        cy.get('.timepicker-button span').contains('Ok').click();
      }
      cy.get('[data-testid="start2StartedAt"]').should('have.value', secondUpdateActualTexts[i].start2StartedAt);

      if (secondUpdateActualTexts[i].stop2StoppedAt !== '' && secondUpdateActualTexts[i].stop2StoppedAt !== '00:00' ) {
        cy.get('[data-testid="stop2StoppedAt"]').click();
        // eslint-disable-next-line max-len
        let degrees4 = 360 / 12 * parseInt(secondUpdateActualTexts[i].stop2StoppedAt.split(':')[0]);
        let minuteDegrees4 = 360 / 60 * parseInt(secondUpdateActualTexts[i].stop2StoppedAt.split(':')[1]);
        if (degrees4 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees4 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (degrees4 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees4 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees4 > 0) {
          cy.get('[style="transform: rotateZ(' + minuteDegrees4 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        if (minuteDegrees4 === 0) {
          cy.get('[style="transform: rotateZ(360deg) translateX(-50%);"] > span').click();
        }
        cy.get('.timepicker-button span').contains('Ok').click();
      }
      cy.get('[data-testid="stop2StoppedAt"]').should('have.value', secondUpdateActualTexts[i].stop2StoppedAt);

      if (secondUpdateActualTexts[i].pause2Id !== '' && secondUpdateActualTexts[i].pause2Id !== '00:00') {
        cy.get('[data-testid="pause2Id"]').click();
        // eslint-disable-next-line max-len
        let degrees5 = 360 / 12 * parseInt(secondUpdateActualTexts[i].pause2Id.split(':')[0]);
        let minuteDegrees5 = 360 / 60 * parseInt(secondUpdateActualTexts[i].pause2Id.split(':')[1]);
        if (degrees5 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees5 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (degrees5 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees5 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees5 > 0) {
          cy.get('[style="transform: rotateZ(' + minuteDegrees5 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        if (minuteDegrees5 === 0) {
          cy.get('[style="transform: rotateZ(360deg) translateX(-50%);"] > span').click();
        }
        cy.get('.timepicker-button span').contains('Ok').click();
        cy.get('[data-testid="pause2Id"]').should('have.value', secondUpdateActualTexts[i].pause2Id);
      } else {
        cy.get('[data-testid="pause2Id"]').should('have.value', '');
      }
      cy.task('log', `[Folder b - Dashboard Edit B] Verifying calculated values`);
      cy.get('#flexToDate').should('have.value', secondUpdateActualTexts[i].flexToDate);
      cy.get('#flexIncludingToday').should('have.value', secondUpdateActualTexts[i].flexIncludingToday);
      cy.get('#nettoHours').should('have.value', secondUpdateActualTexts[i].nettoHours);
      cy.get('#todaysFlex').should('have.value', secondUpdateActualTexts[i].todaysFlex);
      cy.get('#paidOutFlex').should('have.value', secondUpdateActualTexts[i].paidOutFlex);


      cy.get('#planHours').should('have.value', secondUpdateActualTexts[i].calculatedHours);
      cy.task('log', '[Folder b - Dashboard Edit B] Setting up intercept for update-day');
      cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('update-day');
      cy.task('log', '[Folder b - Dashboard Edit B] Clicking Save button');
      cy.get('#saveButton').click();
      cy.task('log', '[Folder b - Dashboard Edit B] Waiting for update-day API call (160s timeout)');
      cy.wait('@update-day', { timeout: 160000 });
      cy.task('log', '[Folder b - Dashboard Edit B] Waiting for index-update API call (160s timeout)');
      cy.wait('@index-update', { timeout: 160000 });
      // Wait for spinner after index update
      cy.get('body').then(($body) => {
        if ($body.find('.overlay-spinner').length > 0) {
          cy.task('log', '[Folder b - Dashboard Edit B] Spinner detected after index-update, waiting...');
          cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        }
      });
      cy.wait(1000);
      cy.task('log', `[Folder b - Dashboard Edit B] Verifying updated flexBalanceToDate: ${secondUpdateActualTexts[i].flexBalanceToDate}`);
      let flexBalanceToDateId = `#flexBalanceToDate3_${i}`;
      if (secondUpdateActualTexts[i].flexBalanceToDate !== '') {
        cy.get(flexBalanceToDateId).should('include.text', secondUpdateActualTexts[i].flexBalanceToDate);
      }
    }

    cy.task('log', '[Folder b - Dashboard Edit B] Test completed successfully');
  });
});
