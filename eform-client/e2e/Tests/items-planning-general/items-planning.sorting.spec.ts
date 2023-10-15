import loginPage from '../../Page objects/Login.page';
import itemsPlanningPlanningPage from '../../Page objects/ItemsPlanning/ItemsPlanningPlanningPage';
import myEformsPage from '../../Page objects/MyEforms.page';
import foldersPage from '../../Page objects/Folders.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;
let template = generateRandmString();
let folderName = generateRandmString();
describe('Items planning plannings - Sorting', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    if (await myEformsPage.rowNum() <= 0) {
      await myEformsPage.createNewEform(template); // Create eform
    } else {
      template = (await myEformsPage.getFirstMyEformsRowObj()).eFormName;
    }
    await myEformsPage.Navbar.goToFolderPage();
    if (await foldersPage.rowNum() <= 0) {
      await foldersPage.createNewFolder(folderName, 'Description'); // Create folder
    } else {
      folderName = (await foldersPage.getFolder(1)).name;
    }
    await itemsPlanningPlanningPage.goToPlanningsPage();
  });
  it('should create dummy plannings', async () => {
    await itemsPlanningPlanningPage.createDummyPlannings(template, folderName);
  });
  it('should be able to sort by ID', async () => {
    await browser.pause(1000);
    let list = (await $$('td.planningId'));
    const planningBefore = await Promise.all(list.map((item) => {
      return item.getText();
    }));

    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      await itemsPlanningPlanningPage.clickIdTableHeader();

      list = await $$('td.planningId');
      const planningAfter = await Promise.all(list.map((item) => {
        return item.getText();
      }));

      // get current direction of sorting

      const sortIcon = await (await $('th.planningId')).$('.ng-trigger-leftPointer').getAttribute('style');
      let sorted;
      if (sortIcon === 'transform: rotate(45deg);') {
        sorted = planningBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = planningBefore;
      } else {
        sorted = planningBefore.sort();
      }
      expect(sorted, 'Sort by ID incorrect').deep.equal(planningAfter);
    }
  });
  it('should be able to sort by Name', async () => {
    let list = await $$('td.planningName');
    const planningBefore = await Promise.all(list.map((item) => {
      return item.getText();
    }));

    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      await itemsPlanningPlanningPage.clickNameTableHeader();

      list = await $$('td.planningName');
      const planningAfter = await Promise.all(list.map((item) => {
        return item.getText();
      }));

      // get current direction of sorting
      const sortIcon = await (await $('th.planningName')).$('.ng-trigger-leftPointer').getAttribute('style');
      let sorted;
      if (sortIcon === 'transform: rotate(45deg);') {
        sorted = planningBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = planningBefore;
      } else {
        sorted = planningBefore.sort();
      }

      expect(sorted, 'Sort by Name incorrect').deep.equal(planningAfter);
    }
  });
  it('should be able to sort by Description', async () => {
    let list = await $$('td.planningDescription');
    const planningBefore = await Promise.all(list.map((item) => {
      return item.getText();
    }));

    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      await itemsPlanningPlanningPage.clickDescriptionTableHeader();

      list = await $$('td.planningDescription');
      const planningAfter = await Promise.all(list.map((item) => {
        return item.getText();
      }));

      // get current direction of sorting
      const sortIcon = await (await $('th.planningDescription')).$('.ng-trigger-leftPointer').getAttribute('style');
      let sorted;
      if (sortIcon === 'transform: rotate(45deg);') {
        sorted = planningBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = planningBefore;
      } else {
        sorted = planningBefore.sort();
      }

      expect(sorted, 'Sort by Description incorrect').deep.equal(planningAfter);
    }
  });
  it('should clear table', async () => {
    await itemsPlanningPlanningPage.clearTable();
  });
});
