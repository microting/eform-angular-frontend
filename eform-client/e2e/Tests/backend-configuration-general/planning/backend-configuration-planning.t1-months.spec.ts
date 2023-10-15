import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { expect } from 'chai';
import { generateRandmString } from '../../../Helpers/helper-functions';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';
import backendConfigurationAreaRulesPage, {
  AreaRuleCreateUpdate,
  AreaRulePlanningCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationAreaRules.page';
import { format } from 'date-fns';
import itemsPlanningPlanningPage from '../../../Page objects/ItemsPlanning/ItemsPlanningPlanningPage';
import applicationSettingsPage from '../../../Page objects/ApplicationSettings.page';

const property: PropertyCreateUpdate = {
  name: generateRandmString(),
  chrNumber: generateRandmString(),
  address: generateRandmString(),
  cvrNumber: '1111111',
  // selectedLanguages: [{ languageId: 1, languageName: 'Dansk' }],
};
const workerForCreate = {
  name: generateRandmString(),
  surname: generateRandmString(),
  language: 'Dansk',
  properties: [0],
};
const areaRuleForCreate: AreaRuleCreateUpdate = {
  name: generateRandmString(),
  eform: '2.3 Gyllekøling: Driftsstop',
};

describe('Backend Configuration Area Rules Planning Type1', function () {
  beforeEach(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.createProperty(property);
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.create(workerForCreate);
    await backendConfigurationPropertiesPage.goToProperties();
    let lastProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await lastProperty.editBindWithAreas([0]); // bind specific type1
    lastProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await lastProperty.openAreasViewModal(0); // go to area rule page
  });
  // it('should create new planning from default area rule at 2 months', async () => {
  //   const rowNum = await backendConfigurationAreaRulesPage.rowNum();
  //   expect(rowNum, 'have some non-default area rules').eq(0);
  //   await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
  //   expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
  //   const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   expect(areRule.name).eq(areaRuleForCreate.name);
  //   expect(areRule.eform).eq('2.3 Gyllekøling: Driftsstop');
  //   expect(areRule.rulePlanningStatus).eq(false);
  //   const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
  //   const areaRulePlanning: AreaRulePlanningCreateUpdate = {
  //   //   startDate: format(new Date(), 'yyyy/MM/dd'),
  //     workers: [{ workerNumber: 0 }],
  //     enableCompliance: true,
  //     repeatEvery: '2. måned',
  //     repeatType: 'Måned',
  //   };
  //   await areaRule.createUpdatePlanning(areaRulePlanning);
  //   // areaRulePlanning.startDate = format(
  //   //   sub(new Date(), { days: 1 }),
  //   //   'yyyy/MM/dd'
  //   // ); // fix test
  //   const areaRulePlanningCreated = await areaRule.readPlanning();
  //   // expect(areaRulePlanningCreated.startDate).eq(areaRulePlanning.startDate);
  //   expect(areaRulePlanningCreated.workers[0].name).eq(
  //     `${workerForCreate.name} ${workerForCreate.surname}`
  //   );
  //   // expect(
  //   //   await (await $(`#mat-checkbox-0`)).getValue(),
  //   //   `User ${areaRulePlanningCreated.workers[0]} not paired`
  //   // ).eq('true');
  //   expect(areaRulePlanningCreated.workers[0].checked).eq(true);
  //   expect(areaRulePlanningCreated.workers[0].status).eq('Klar til server');
  //   expect(areaRulePlanningCreated.enableCompliance).eq(areaRulePlanning.enableCompliance);
  //   await itemsPlanningPlanningPage.goToPlanningsPage();
  //   expect(
  //     await itemsPlanningPlanningPage.rowNum(),
  //     'items planning not create or create not correct'
  //   ).eq(1);
  //   const itemPlanning = await itemsPlanningPlanningPage.getLastPlanningRowObject();
  //   expect(itemPlanning.eFormName).eq('2.3 Gyllekøling: Driftsstop');
  //   expect(itemPlanning.name).eq(areaRule.name);
  //   expect(itemPlanning.folderName).eq(
  //     `${property.name} - 00. Logbøger`
  //   );
  //   expect(itemPlanning.repeatEvery).eq(2);
  //   expect(itemPlanning.repeatType).eq('Måned');
  //
  //   // compare itemPlanning.lastExecution with today's date
  //   const today = new Date();
  //   const todayDate = format(today, 'dd.MM.y');
  //   //const months = [1, 3, 5, 7, 9, 11];
  //   // if (months.includes(today.getMonth() + 1)) {
  //   //   const newDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  //   //   const newDateDate = format(newDate, 'dd.MM.y');
  //   //   expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
  //   // } else {
  //   const newDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
  //   const newDateDate = format(newDate, 'dd.MM.y');
  //   expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
  //   // }
  //   const lastExecution = itemPlanning.lastExecution.split(' ')[0];
  //   expect(lastExecution).eq(todayDate);
  //
  //   const workers = await itemPlanning.readPairing();
  //   expect([
  //     {
  //       workerName: `${workerForCreate.name} ${workerForCreate.surname}`,
  //       workerValue: true,
  //     },
  //   ]).deep.eq(workers);
  //   // browser.back();
  //   // await areaRule.createUpdatePlanning({status: false});
  // });
  // it('should create new planning from default area rule at 3 months', async () => {
  //   const rowNum = await backendConfigurationAreaRulesPage.rowNum();
  //   expect(rowNum, 'have some non-default area rules').eq(0);
  //   await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
  //   expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
  //   const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
  //   const areaRulePlanning: AreaRulePlanningCreateUpdate = {
  //     //   startDate: format(new Date(), 'yyyy/MM/dd'),
  //     workers: [{ workerNumber: 0 }],
  //     enableCompliance: true,
  //     repeatEvery: '3. måned',
  //     repeatType: 'Måned',
  //   };
  //   await areaRule.createUpdatePlanning(areaRulePlanning);
  //   // areaRulePlanning.startDate = format(
  //   //   sub(new Date(), { days: 1 }),
  //   //   'yyyy/MM/dd'
  //   // ); // fix test
  //   const areaRulePlanningCreated = await areaRule.readPlanning();
  //   // expect(areaRulePlanningCreated.startDate).eq(areaRulePlanning.startDate);
  //   expect(areaRulePlanningCreated.workers[0].name).eq(
  //     `${workerForCreate.name} ${workerForCreate.surname}`
  //   );
  //   // expect(
  //   //   await (await $(`#mat-checkbox-0`)).getValue(),
  //   //   `User ${areaRulePlanningCreated.workers[0]} not paired`
  //   // ).eq('true');
  //   expect(areaRulePlanningCreated.workers[0].checked).eq(true);
  //   expect(areaRulePlanningCreated.workers[0].status).eq('Klar til server');
  //   expect(areaRulePlanningCreated.enableCompliance).eq(areaRulePlanning.enableCompliance);
  //   await itemsPlanningPlanningPage.goToPlanningsPage();
  //   expect(
  //     await itemsPlanningPlanningPage.rowNum(),
  //     'items planning not create or create not correct'
  //   ).eq(1);
  //   const itemPlanning = await itemsPlanningPlanningPage.getLastPlanningRowObject();
  //   expect(itemPlanning.eFormName).eq('2.3 Gyllekøling: Driftsstop');
  //   expect(itemPlanning.name).eq(areaRule.name);
  //   expect(itemPlanning.folderName).eq(
  //     `${property.name} - 00. Logbøger`
  //   );
  //   expect(itemPlanning.repeatEvery).eq(3);
  //   expect(itemPlanning.repeatType).eq('Måned');
  //
  //   const today = new Date();
  //   const todayDate = format(today, 'dd.MM.y');
  //   let months = [1, 4, 7, 10];
  //   // if (months.includes(today.getMonth() + 1)) {
  //   //   const newDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  //   //   const newDateDate = format(newDate, 'dd.MM.y');
  //   //   expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
  //   // } else {
  //   //   months = [2, 5, 8, 11];
  //   //   if (months.includes(today.getMonth() + 1)) {
  //   //     const newDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  //   //     const newDateDate = format(newDate, 'dd.MM.y');
  //   //     expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
  //   //   } else {
  //   const newDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
  //   const newDateDate = format(newDate, 'dd.MM.y');
  //   expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
  //   //   }
  //   // }
  //   const lastExecution = itemPlanning.lastExecution.split(' ')[0];
  //   expect(lastExecution).eq(todayDate);
  //
  //   const workers = await itemPlanning.readPairing();
  //   expect([
  //     {
  //       workerName: `${workerForCreate.name} ${workerForCreate.surname}`,
  //       workerValue: true,
  //     },
  //   ]).deep.eq(workers);
  //   // browser.back();
  //   // await areaRule.createUpdatePlanning({status: false});
  // });
  it('should create new planning from default area rule at 6 months', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
      //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '6. måned',
      repeatType: 'Måned',
    };
    await areaRule.createUpdatePlanning(areaRulePlanning);
    // areaRulePlanning.startDate = format(
    //   sub(new Date(), { days: 1 }),
    //   'yyyy/MM/dd'
    // ); // fix test
    const areaRulePlanningCreated = await areaRule.readPlanning();
    // expect(areaRulePlanningCreated.startDate).eq(areaRulePlanning.startDate);
    expect(areaRulePlanningCreated.workers[0].name).eq(
      `${workerForCreate.name} ${workerForCreate.surname}`
    );
    // expect(
    //   await (await $(`#mat-checkbox-0`)).getValue(),
    //   `User ${areaRulePlanningCreated.workers[0]} not paired`
    // ).eq('true');
    expect(areaRulePlanningCreated.workers[0].checked).eq(true);
    expect(areaRulePlanningCreated.workers[0].status).eq('Klar til server');
    expect(areaRulePlanningCreated.enableCompliance).eq(areaRulePlanning.enableCompliance);
    await itemsPlanningPlanningPage.goToPlanningsPage();
    expect(
      await itemsPlanningPlanningPage.rowNum(),
      'items planning not create or create not correct'
    ).eq(1);
    const itemPlanning = await itemsPlanningPlanningPage.getLastPlanningRowObject();
    expect(itemPlanning.eFormName).eq('2.3 Gyllekøling: Driftsstop');
    expect(itemPlanning.name).eq(areaRule.name);
    expect(itemPlanning.folderName).eq(
      `${property.name} - 00. Logbøger`
    );
    expect(itemPlanning.repeatEvery).eq(6);
    expect(itemPlanning.repeatType).eq('Måned');

    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    // if (today.getMonth() + 1 < 6) {
    //   const newDate = new Date(today.getFullYear(), 6, 1);
    //   const newDateDate = format(newDate, 'dd.MM.y');
    //   expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
    // } else {
    const newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // add 6 months to the newDate date
    const newDate2 = new Date(newDate.getTime());
    const currentDay = newDate2.getDate();

    // Set the month
    newDate2.setMonth(newDate2.getMonth() + 6);

    // Check if the new month has fewer days than the current day
    if (newDate2.getDate() < currentDay) {
      // Set the day to the last day of the previous month
      newDate2.setDate(0);
    }
    const newDateDate = format(newDate2, 'dd.MM.y');
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
    //}
    const lastExecution = itemPlanning.lastExecution.split(' ')[0];
    expect(lastExecution).eq(todayDate);

    const workers = await itemPlanning.readPairing();
    expect([
      {
        workerName: `${workerForCreate.name} ${workerForCreate.surname}`,
        workerValue: true,
      },
    ]).deep.eq(workers);
    // browser.back();
    // await areaRule.createUpdatePlanning({status: false});
  });
  it('should create new planning from default area rule at 12 months', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
      //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '12 (1 år)',
      repeatType: 'Måned',
    };
    await areaRule.createUpdatePlanning(areaRulePlanning);
    // areaRulePlanning.startDate = format(
    //   sub(new Date(), { days: 1 }),
    //   'yyyy/MM/dd'
    // ); // fix test
    const areaRulePlanningCreated = await areaRule.readPlanning();
    // expect(areaRulePlanningCreated.startDate).eq(areaRulePlanning.startDate);
    expect(areaRulePlanningCreated.workers[0].name).eq(
      `${workerForCreate.name} ${workerForCreate.surname}`
    );
    // expect(
    //   await (await $(`#mat-checkbox-0`)).getValue(),
    //   `User ${areaRulePlanningCreated.workers[0]} not paired`
    // ).eq('true');
    expect(areaRulePlanningCreated.workers[0].checked).eq(true);
    expect(areaRulePlanningCreated.workers[0].status).eq('Klar til server');
    expect(areaRulePlanningCreated.enableCompliance).eq(areaRulePlanning.enableCompliance);
    await itemsPlanningPlanningPage.goToPlanningsPage();
    expect(
      await itemsPlanningPlanningPage.rowNum(),
      'items planning not create or create not correct'
    ).eq(1);
    const itemPlanning = await itemsPlanningPlanningPage.getLastPlanningRowObject();
    expect(itemPlanning.eFormName).eq('2.3 Gyllekøling: Driftsstop');
    expect(itemPlanning.name).eq(areaRule.name);
    expect(itemPlanning.folderName).eq(
      `${property.name} - 00. Logbøger`
    );
    expect(itemPlanning.repeatEvery).eq(12);
    expect(itemPlanning.repeatType).eq('Måned');

    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    const newDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    const newDateDate = format(newDate, 'dd.MM.y');
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
    const lastExecution = itemPlanning.lastExecution.split(' ')[0];
    expect(lastExecution).eq(todayDate);
    const workers = await itemPlanning.readPairing();
    expect([
      {
        workerName: `${workerForCreate.name} ${workerForCreate.surname}`,
        workerValue: true,
      },
    ]).deep.eq(workers);
    // browser.back();
    // await areaRule.createUpdatePlanning({status: false});
  });it('should create new planning from default area rule at 24 months', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
      //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '24 (2 år)',
      repeatType: 'Måned',
    };
    await areaRule.createUpdatePlanning(areaRulePlanning);
    // areaRulePlanning.startDate = format(
    //   sub(new Date(), { days: 1 }),
    //   'yyyy/MM/dd'
    // ); // fix test
    const areaRulePlanningCreated = await areaRule.readPlanning();
    // expect(areaRulePlanningCreated.startDate).eq(areaRulePlanning.startDate);
    expect(areaRulePlanningCreated.workers[0].name).eq(
      `${workerForCreate.name} ${workerForCreate.surname}`
    );
    // expect(
    //   await (await $(`#mat-checkbox-0`)).getValue(),
    //   `User ${areaRulePlanningCreated.workers[0]} not paired`
    // ).eq('true');
    expect(areaRulePlanningCreated.workers[0].checked).eq(true);
    expect(areaRulePlanningCreated.workers[0].status).eq('Klar til server');
    expect(areaRulePlanningCreated.enableCompliance).eq(areaRulePlanning.enableCompliance);
    await itemsPlanningPlanningPage.goToPlanningsPage();
    expect(
      await itemsPlanningPlanningPage.rowNum(),
      'items planning not create or create not correct'
    ).eq(1);
    const itemPlanning = await itemsPlanningPlanningPage.getLastPlanningRowObject();
    expect(itemPlanning.eFormName).eq('2.3 Gyllekøling: Driftsstop');
    expect(itemPlanning.name).eq(areaRule.name);
    expect(itemPlanning.folderName).eq(
      `${property.name} - 00. Logbøger`
    );
    expect(itemPlanning.repeatEvery).eq(24);
    expect(itemPlanning.repeatType).eq('Måned');

    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    const newDate = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    const newDateDate = format(newDate, 'dd.MM.y');
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(newDateDate);
    const lastExecution = itemPlanning.lastExecution.split(' ')[0];
    expect(lastExecution).eq(todayDate);
    const workers = await itemPlanning.readPairing();
    expect([
      {
        workerName: `${workerForCreate.name} ${workerForCreate.surname}`,
        workerValue: true,
      },
    ]).deep.eq(workers);
    // browser.back();
    // await areaRule.createUpdatePlanning({status: false});
  });
  afterEach(async () => {
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.clearTable();
    await applicationSettingsPage.Navbar.logout();
  });
});
