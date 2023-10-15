import loginPage from '../../Page objects/Login.page';
import itemsPlanningPlanningPage from '../../Page objects/ItemsPlanning/ItemsPlanningPlanningPage';
import myEformsPage from '../../Page objects/MyEforms.page';
import foldersPage from '../../Page objects/Folders.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;
let template = generateRandmString();
let folderName = generateRandmString();
const countPlannings = 5;

describe('Items planning plannings - Multiple delete', function () {
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
    await itemsPlanningPlanningPage.createDummyPlannings(
      template,
      folderName,
      countPlannings
    );
  });
  it('should not delete because click cancel', async () => {
    const countBeforeDelete = await itemsPlanningPlanningPage.rowNum();
    await itemsPlanningPlanningPage.selectAllPlanningsForDelete();
    await itemsPlanningPlanningPage.multipleDelete(true);
    expect(countBeforeDelete, 'plannings has been delete').eq(
      await itemsPlanningPlanningPage.rowNum()
    );
  });
  it('should multiple delete plannings', async () => {
    const countBeforeDelete = await itemsPlanningPlanningPage.rowNum();
    await itemsPlanningPlanningPage.multipleDelete();
    expect(countBeforeDelete - countPlannings, 'plannings not delete').eq(
      await itemsPlanningPlanningPage.rowNum()
    );
  });
});
