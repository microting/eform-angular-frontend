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
  it('should create new planning from default area rule at 2 weeks', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    expect(areRule.name).eq(areaRuleForCreate.name);
    expect(areRule.eform).eq('2.3 Gyllekøling: Driftsstop');
    expect(areRule.rulePlanningStatus).eq(false);
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
    //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '2',
      repeatType: 'Uge',
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
    expect(itemPlanning.repeatEvery).eq(2);
    expect(itemPlanning.repeatType).eq('Uge');
    expect(itemPlanning.planningDayOfWeek).eq('Mandag');

    // compare itemPlanning.lastExecution with today's date
    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    const now = new Date();
    // const diff = now.getTime() - new Date(now.getFullYear(), 0, 1).getTime();
    // const multiplier = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000));
    // const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    //let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
    //
    // if (startOfWeek.getFullYear() !== now.getFullYear()) {
    //   startOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    // }

    let nextExecutionTime = new Date(now.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
    // if (nextExecutionTime < now) {
    //   nextExecutionTime = new Date(nextExecutionTime.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
    // }
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(format(nextExecutionTime, 'dd.MM.y'));
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
  it('should create new planning from default area rule at 3 weeks', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
      //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '3',
      repeatType: 'Uge',
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
    expect(itemPlanning.repeatEvery).eq(3);
    expect(itemPlanning.repeatType).eq('Uge');
    expect(itemPlanning.planningDayOfWeek).eq('Mandag');

    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    const now = new Date();
    // const diff = now.getTime() - new Date(now.getFullYear(), 0, 1).getTime();
    // const multiplier = Math.floor(diff / (3 * 7 * 24 * 60 * 60 * 1000));
    // const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    // let startOfWeek = new Date(now.getFullYear(), 0, startOfThisYear.getDate() - startOfThisYear.getDay() + 1)
    //
    // if (startOfWeek.getFullYear() !== now.getFullYear()) {
    //   startOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    // }
    //let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);

    let nextExecutionTime = new Date(now.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
    // if (nextExecutionTime < now) {
    //   nextExecutionTime = new Date(nextExecutionTime.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
    // }
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(format(nextExecutionTime, 'dd.MM.y'));
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
  it('should create new planning from default area rule at 6 weeks', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
      //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '6',
      repeatType: 'Uge',
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
    expect(itemPlanning.repeatType).eq('Uge');
    expect(itemPlanning.planningDayOfWeek).eq('Mandag');

    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    const now = new Date();
    // const diff = now.getTime() - new Date(now.getFullYear(), 0, 1).getTime();
    // const multiplier = Math.floor(diff / (6 * 7 * 24 * 60 * 60 * 1000));
    // const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    // let startOfWeek = new Date(now.getFullYear(), 0, startOfThisYear.getDate() - startOfThisYear.getDay() + 1)
    //
    // if (startOfWeek.getFullYear() !== now.getFullYear()) {
    //   startOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    // }
    //let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);

    let nextExecutionTime = new Date(now.getTime() + 6 * 7 * 24 * 60 * 60 * 1000);
    // if (nextExecutionTime < now) {
    //   nextExecutionTime = new Date(nextExecutionTime.getTime() + 6 * 7 * 24 * 60 * 60 * 1000);
    // }
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(format(nextExecutionTime, 'dd.MM.y'));
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
  it('should create new planning from default area rule at 12 weeks', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
      //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '12',
      repeatType: 'Uge',
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
    expect(itemPlanning.repeatType).eq('Uge');
    expect(itemPlanning.planningDayOfWeek).eq('Mandag');

    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    const now = new Date();
    // const diff = now.getTime() - new Date(now.getFullYear(), 0, 1).getTime();
    // const multiplier = Math.floor(diff / (12 * 7 * 24 * 60 * 60 * 1000));
    // const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    // let startOfWeek = new Date(now.getFullYear(), 0, startOfThisYear.getDate() - startOfThisYear.getDay() + 1)
    //
    // if (startOfWeek.getFullYear() !== now.getFullYear()) {
    //   startOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    // }
    //let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);

    let nextExecutionTime = new Date(now.getTime() + 12 * 7 * 24 * 60 * 60 * 1000);
    // if (nextExecutionTime < now) {
    //   nextExecutionTime = new Date(nextExecutionTime.getTime() + 12 * 7 * 24 * 60 * 60 * 1000);
    // }
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(format(nextExecutionTime, 'dd.MM.y'));
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
  });it('should create new planning from default area rule at 24 weeks', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areaRule = await backendConfigurationAreaRulesPage.getFirstAreaRuleRowObject();
    const areaRulePlanning: AreaRulePlanningCreateUpdate = {
      //   startDate: format(new Date(), 'yyyy/MM/dd'),
      workers: [{ workerNumber: 0 }],
      enableCompliance: true,
      repeatEvery: '24',
      repeatType: 'Uge',
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
    expect(itemPlanning.repeatType).eq('Uge');
    expect(itemPlanning.planningDayOfWeek).eq('Mandag');

    const today = new Date();
    const todayDate = format(today, 'dd.MM.y');
    const now = new Date();
    // const diff = now.getTime() - new Date(now.getFullYear(), 0, 1).getTime();
    // const multiplier = Math.floor(diff / (24 * 7 * 24 * 60 * 60 * 1000));
    // const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    // let startOfWeek = new Date(now.getFullYear(), 0, startOfThisYear.getDate() - startOfThisYear.getDay() + 1)

    // if (startOfWeek.getFullYear() !== now.getFullYear()) {
    //   startOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    // }
    //let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);

    let nextExecutionTime = new Date(now.getTime() + 24 * 7 * 24 * 60 * 60 * 1000);
    // if (nextExecutionTime < now) {
    //   nextExecutionTime = new Date(nextExecutionTime.getTime() + 24 * 7 * 24 * 60 * 60 * 1000);
    // }
    expect(itemPlanning.nextExecution.split(' ')[0]).eq(format(nextExecutionTime, 'dd.MM.y'));
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
