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
import selectableLists from '../../../Page objects/SelectableLists.page';

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
};

describe('Backend Configuration Area Rules Type3', function () {
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
  // it('should create new area rule type 3', async () => {
  //   const rowNum = await backendConfigurationAreaRulesPage.rowNum();
  //   expect(rowNum, 'have some non-default area rules').eq(0);
  //   await backendConfigurationAreaRulesPage.createAreaRule(areaRuleForCreate);
  //   expect(rowNum + 1).eq(await backendConfigurationAreaRulesPage.rowNum());
  //   const areaRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   expect(areaRule.name).eq(areaRuleForCreate.name);
  //   expect(areaRule.eform).eq('05. Stald_klargøring');
  //   expect(areaRule.rulePlanningStatus).eq(false);
  // });
  it('should not create items entity list', async () => {
    const entityList = [generateRandmString(), generateRandmString()];
    await backendConfigurationAreaRulesPage.editEntityList(entityList, true);
    await backendConfigurationAreaRulesPage.openEntityListModal();
    expect(await backendConfigurationAreaRulesPage.getCountEntityListItems()).eq(0);
    await backendConfigurationAreaRulesPage.closeEntityListModal(true);
  });
  it('should create items entity list', async () => {
    const entityList = [generateRandmString(), generateRandmString()];
    await backendConfigurationAreaRulesPage.editEntityList(entityList);
    await backendConfigurationAreaRulesPage.openEntityListModal();
    expect(await backendConfigurationAreaRulesPage.getCountEntityListItems()).eq(2);
    await backendConfigurationAreaRulesPage.closeEntityListModal(true);

    await backendConfigurationPropertiesPage.goToProperties();
    const lastProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await lastProperty.openAreasViewModal(0); // go to area rule page
  });
  // it('should not edit created area rule type 3', async () => {
  //   const rowNum = await backendConfigurationAreaRulesPage.rowNum();
  //   const oldAreRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   const areaRuleForUpdate: AreaRuleCreateUpdate = {
  //     name: generateRandmString(),
  //     eform: '22. Sigtetest',
  //   };
  //   await oldAreRule.edit(areaRuleForUpdate, true);
  //   expect(rowNum).eq(await backendConfigurationAreaRulesPage.rowNum());
  //   const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   expect(areRule.name).eq(areaRuleForCreate.name);
  //   expect(areRule.eform).eq('05. Stald_klargøring');
  //   expect(areRule.rulePlanningStatus).eq(false);
  // });
  // it('should edit created area rule type 3', async () => {
  //   const rowNum = await backendConfigurationAreaRulesPage.rowNum();
  //   let areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   const areaRuleForUpdate: AreaRuleCreateUpdate = {
  //     name: generateRandmString(),
  //     eform: '22. Sigtetest',
  //   };
  //   await areRule.edit(areaRuleForUpdate);
  //   expect(rowNum).eq(await backendConfigurationAreaRulesPage.rowNum());
  //   areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   expect(areRule.name).eq(areaRuleForUpdate.name);
  //   expect(areRule.eform).eq(areaRuleForUpdate.eform);
  //   expect(areRule.rulePlanningStatus).eq(false);
  // });
  // it('should not delete created area rule type 3', async () => {
  //   const rowNum = await backendConfigurationAreaRulesPage.rowNum();
  //   const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   await areRule.delete(true);
  //   expect(rowNum).eq(await backendConfigurationAreaRulesPage.rowNum());
  // });
  // it('should delete created area rule type 3', async () => {
  //   const rowNum = await backendConfigurationAreaRulesPage.rowNum();
  //   const areRule = await backendConfigurationAreaRulesPage.getLastAreaRuleRowObject();
  //   await areRule.delete();
  //   expect(rowNum - 1).eq(await backendConfigurationAreaRulesPage.rowNum());
  // });
  after(async () => {
    await backendConfigurationAreaRulesPage.clearTable();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.clearTable();
  });
});
