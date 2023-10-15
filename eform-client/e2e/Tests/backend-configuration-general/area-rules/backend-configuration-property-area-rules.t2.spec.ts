import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { expect } from 'chai';
import { generateRandmString } from '../../../Helpers/helper-functions';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';
import backendConfigurationAreaRulesPage, {
  AreaRuleCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationAreaRules.page';

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
  type: 'Åben',
  alarm: 'Ja',
};

describe('Backend Configuration Area Rules Type2', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.createProperty(property);
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.create(workerForCreate);
    await backendConfigurationPropertiesPage.goToProperties();
    let lastProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await lastProperty.editBindWithAreas([1]); // bind all specific types
    lastProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await lastProperty.openAreasViewModal(0); // go to area rule page
  });
  it('should create new area rule type 2', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    expect(rowNum, 'have some non-default area rules').eq(0);
    await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
    expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    expect(areRule.name).eq(areaRuleForCreate.name);
    expect(areRule.ruleType).eq(areaRuleForCreate.type);
    expect(areRule.ruleAlarm).eq(areaRuleForCreate.alarm);
    expect(areRule.rulePlanningStatus).eq(false);
  });
  it('should not edit created area rule type 2', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    const oldAreRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    const areaRuleForUpdate: AreaRuleCreateUpdate = {
      name: generateRandmString(),
      type: 'Lukket',
      alarm: 'Nej',
    };
    await oldAreRule.edit(areaRuleForUpdate, true);
    expect(rowNum).eq(await backendConfigurationAreaRulesPage.rowNum());
    const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    expect(areRule.name).eq(areaRuleForCreate.name);
    expect(areRule.ruleType).eq(areaRuleForCreate.type);
    expect(areRule.ruleAlarm).eq(areaRuleForCreate.alarm);
    expect(areRule.rulePlanningStatus).eq(false);
  });
  it('should edit created area rule type 2', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    let areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    const areaRuleForUpdate: AreaRuleCreateUpdate = {
      name: generateRandmString(),
      type: 'Lukket',
      alarm: 'Nej',
    };
    await areRule.edit(areaRuleForUpdate);
    expect(rowNum).eq(await backendConfigurationAreaRulesPage.rowNum());
    areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    expect(areRule.name).eq(areaRuleForUpdate.name);
    expect(areRule.ruleType).eq(areaRuleForUpdate.type);
    expect(areRule.ruleAlarm).eq(areaRuleForUpdate.alarm);
    expect(areRule.rulePlanningStatus).eq(false);
  });
  it('should not delete created area rule type 2', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    await areRule.delete(true);
    expect(rowNum).eq(await backendConfigurationAreaRulesPage.rowNum());
  });
  it('should delete created area rule type 2', async () => {
    const rowNum = await backendConfigurationAreaRulesPage.rowNum();
    const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
    await areRule.delete();
    expect(rowNum - 1).eq(await backendConfigurationAreaRulesPage.rowNum());
  });
  after(async () => {
    await backendConfigurationAreaRulesPage.clearTable();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.clearTable();
  });
});
