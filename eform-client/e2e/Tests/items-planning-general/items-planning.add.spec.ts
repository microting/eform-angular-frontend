import loginPage from '../../Page objects/Login.page';
import itemsPlanningPlanningPage, {
  PlanningCreateUpdate,
  PlanningRowObject,
} from '../../Page objects/ItemsPlanning/ItemsPlanningPlanningPage';
import itemsPlanningModalPage from '../../Page objects/ItemsPlanning/ItemsPlanningModal.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import foldersPage from '../../Page objects/Folders.page';
import {
  generateRandmString,
  getRandomInt,
} from '../../Helpers/helper-functions';
import {format, set} from 'date-fns';
import {customDaLocale} from '../../../src/app/common/const';

const expect = require('chai').expect;

const planningData: PlanningCreateUpdate = {
  name: [generateRandmString(), generateRandmString(), generateRandmString()],
  eFormName: generateRandmString(),
  folderName: generateRandmString(),
  description: generateRandmString(),
  repeatEvery: '1',
  repeatType: 'Dag',
  startFrom: { year: 2020, day: 7, month: 9 },
  repeatUntil: { year: 2020, day: 6, month: 10 },
  type: generateRandmString(),
  locationCode: '12345',
  buildYear: '10',
  number: '10',
  daysBeforeRedeploymentPushMessage: getRandomInt(1, 27),
  pushMessageEnabled: true,
};
describe('Items planning - Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    if ((await myEformsPage.rowNum()) <= 0) {
      await myEformsPage.createNewEform(planningData.eFormName); // Create eform
    } else {
      planningData.eFormName = (
        await myEformsPage.getFirstMyEformsRowObj()
      ).eFormName;
    }
    await myEformsPage.Navbar.goToFolderPage();
    if ((await foldersPage.rowNum()) <= 0) {
      await foldersPage.createNewFolder(planningData.folderName, 'Description'); // Create folder
    } else {
      planningData.folderName = (await foldersPage.getFolder(1)).name;
    }
    await itemsPlanningPlanningPage.goToPlanningsPage();
  });
  it('should create planning with all fields', async () => {
    const rowNumBeforeCreatePlanning = await itemsPlanningPlanningPage.rowNum();
    await itemsPlanningModalPage.createPlanning(planningData);
    await browser.pause(500);
    expect(rowNumBeforeCreatePlanning + 1, 'Planning not created').eq(
      await itemsPlanningPlanningPage.rowNum()
    );
  });
  it('check all fields planning', async () => {
    // Check that planning is created in table
    const planningRowObject = await itemsPlanningPlanningPage.getPlaningByName(
      planningData.name[0]
    );
    expect(planningRowObject.name, 'Saved name in table is incorrect').equal(
      planningData.name[0]
    );
    expect(
      planningRowObject.eFormName,
      'Saved template in table is incorrect'
    ).equal(planningData.eFormName);
    expect(
      planningRowObject.description,
      'Saved description in table is incorrect'
    ).equal(planningData.description);
    expect(
      planningRowObject.repeatEvery.toString(),
      'Saved repeat every in table is incorrect'
    ).equal(planningData.repeatEvery);
    // const repeatUntil = new Date(planningData.repeatUntil);
    // expect(
    //   planningRowObject.repeatUntil.getDate(),
    //   'Saved repeat Until in table is incorrect'
    // ).equal(repeatUntil.getDate());
    expect(
      planningRowObject.repeatType,
      'Saved repeat type in table is incorrect'
    ).equal(planningData.repeatType);
    // Check that all planning fields are saved
    await planningRowObject.openEdit();
    for (let i = 0; i < planningData.name.length; i++) {
      expect(
        await (await itemsPlanningModalPage.editPlanningItemName(i)).getValue(),
        'Name save is incorrect'
      ).eq(planningData.name[i]);
    }
    expect(
      await (await itemsPlanningModalPage.editPlanningDescription()).getValue(),
      'Description save is incorrect'
    ).eq(planningData.description);
    expect(
      await (
        await (await itemsPlanningModalPage.editPlanningSelector()).$(
          '.ng-value'
        )
      ).getText(),
      'Saved template is incorrect'
    ).eq(planningData.eFormName);
    expect(
      await (await itemsPlanningModalPage.editRepeatEvery()).getValue(),
      'Saved repeat every is incorrect'
    ).eq(planningData.repeatEvery);
    // expect(
    //   format(
    //     parse(
    //       itemsPlanningModalPage.editRepeatUntil.getValue(),
    //       'M/d/yyyy',
    //       new Date()
    //     ),
    //     'M/d/yyyy'
    //   ),
    //   'Saved repeat until is incorrect'
    // ).eq(format(planningData.repeatUntil, 'M/d/yyyy'));
    expect(
      await (
        await (await itemsPlanningModalPage.editRepeatType()).$(
          '.ng-value-label'
        )
      ).getText(),
      'Saved repeat type is incorrect'
    ).eq(planningData.repeatType);
    expect(
      await (await itemsPlanningModalPage.editItemType()).getValue(),
      'Saved type is incorrect'
    ).eq(planningData.type);
    expect(
      await (await itemsPlanningModalPage.editItemBuildYear()).getValue(),
      'Saved build year is incorrect'
    ).eq(planningData.buildYear);
    expect(
      await (
        await (await itemsPlanningModalPage.editFolderName()).$(
          '#editFolderSelectorInput'
        )
      ).getValue(),
      'Saved folder name is incorrect'
    ).eq(planningData.folderName);
    expect(
      await (await itemsPlanningModalPage.editItemLocationCode()).getValue(),
      'Saved location code is incorrect'
    ).eq(planningData.locationCode);
    const startDateForExpect = format(set(new Date(), {
      year: planningData.startFrom.year,
      month: planningData.startFrom.month - 1,
      date: planningData.startFrom.day,
    }), 'P', {locale: customDaLocale});
    expect(
      await (await itemsPlanningModalPage.editStartFrom()).getValue(), 'Saved start from is incorrect').eq(startDateForExpect);
    expect(
      await (
        await (await itemsPlanningModalPage.pushMessageEnabledEdit()).$(
          '.ng-value-label'
        )
      ).getText(),
      'Saved pushMessageEnabled code is incorrect'
    ).eq(planningData.pushMessageEnabled ? 'Aktiveret' : 'Deaktiveret');
    expect(
      +(await (
        await (
          await itemsPlanningModalPage.editDaysBeforeRedeploymentPushMessage()
        ).$('.ng-value-label')
      ).getText()),
      'Saved editDaysBeforeRedeploymentPushMessage code is incorrect'
    ).eq(planningData.daysBeforeRedeploymentPushMessage);
    await PlanningRowObject.closeEdit(true);
  });
  after('delete all created in this test', async () => {
    // Delete
    await itemsPlanningPlanningPage.clearTable();

    await myEformsPage.Navbar.goToFolderPage();
    await (await foldersPage.getFolderByName(planningData.folderName)).delete();

    await myEformsPage.Navbar.goToMyEForms();
    await myEformsPage.clearEFormTable();
  });
});
