import loginPage from '../../Page objects/Login.page';
import itemsPlanningPlanningPage, {
  PlanningCreateUpdate,
  PlanningRowObject,
} from '../../Page objects/ItemsPlanning/ItemsPlanningPlanningPage';
import myEformsPage from '../../Page objects/MyEforms.page';
import foldersPage from '../../Page objects/Folders.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import deviceUsersPage, {
  DeviceUsersRowObject,
} from '../../Page objects/DeviceUsers.page';
import itemsPlanningPairingPage from '../../Page objects/ItemsPlanning/ItemsPlanningPairingPage';
import itemsPlanningModalPage from '../../Page objects/ItemsPlanning/ItemsPlanningModal.page';

const expect = require('chai').expect;
let template = generateRandmString();
let folderName = generateRandmString();
let planningRowObjects: PlanningRowObject[];
const deviceUsers = new Array<DeviceUsersRowObject>();
const countDeviceUsers = 4; // constant, how need create user devices for test
const countPlanning = 4; // constant, how need create plannings

describe('Items planning plugin - Pairing', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();

    if (await myEformsPage.rowNum() <= 0) {
      await myEformsPage.createNewEform(template); // Create eform
    } else {
      template = (await myEformsPage.getFirstMyEformsRowObj()).eFormName;
    }

    await myEformsPage.Navbar.goToDeviceUsersPage();
    while (await deviceUsersPage.rowNum() !== countDeviceUsers) {
      // create device users
      await deviceUsersPage.createNewDeviceUser(
        generateRandmString(),
        generateRandmString()
      );
    }
    for (let i = 1; i < countDeviceUsers + 1; i++) {
      deviceUsers.push(await deviceUsersPage.getDeviceUser(i));
    }

    await myEformsPage.Navbar.goToFolderPage();
    if (await foldersPage.rowNum() <= 0) {
      await foldersPage.createNewFolder(folderName, 'Description'); // Create folder
    } else {
      folderName = (await foldersPage.getFolder(1)).name;
    }

    await itemsPlanningPlanningPage.goToPlanningsPage();
    while (await itemsPlanningPlanningPage.rowNum() < countPlanning) {
      const planningData: PlanningCreateUpdate = {
        name: [
          generateRandmString(),
          generateRandmString(),
          generateRandmString(),
        ],
        eFormName: template,
        folderName: folderName,
      };
      await itemsPlanningModalPage.createPlanning(planningData);
    }
    await browser.pause(1000)
    planningRowObjects = [
      ...await itemsPlanningPlanningPage.getAllPlannings(countPlanning),
    ];

    await itemsPlanningPairingPage.goToPairingPage();
  });
  it('should pair one device user which all plannings', async () => {
    const pair = true;
    const pairingColObject = await itemsPlanningPairingPage.getDeviceUserByIndex(1);
    await pairingColObject.pairWhichAllPlannings(pair);
    for (let i = 0; i < pairingColObject.pairCheckboxesForClick.length; i++) {
      expect(await (await pairingColObject.pairCheckboxes[i].$('input')).getProperty('checked'),
        `Checkbox ${pairingColObject.pairCheckboxes[i].selector} not equal ${pair}. Value checkbox: ${await (await pairingColObject.pairCheckboxes[i].$('input')).getProperty('checked')}`
      ).eq(pair);
    }
  });
  it('should unpair one device user which all plannings', async () => {
    const pair = false;
    const pairingColObject = await itemsPlanningPairingPage.getDeviceUserByIndex(1);
    await pairingColObject.pairWhichAllPlannings(pair, true);
    for (let i = 0; i < pairingColObject.pairCheckboxesForClick.length; i++) {
      expect(
        await (await pairingColObject.pairCheckboxes[i].$('input')).getProperty('checked'),
        `Checkbox ${pairingColObject.pairCheckboxes[i].selector} not equal ${pair}. Value checkbox: ${await (await pairingColObject.pairCheckboxes[i].$('input')).getProperty('checked')}`
      ).eq(pair);
    }
  });
  it('should pair one planning which all device user', async () => {
    const pair = true;
    const pairingRowObject = await itemsPlanningPairingPage.getPlanningByIndex(1);
    await pairingRowObject.pairWhichAllDeviceUsers(pair);
    for (let i = 0; i < pairingRowObject.pairCheckboxesForClick.length; i++) {
      expect(await (await pairingRowObject.pairCheckboxes[i].$('input')).getProperty('checked'),
        `Checkbox ${pairingRowObject.pairCheckboxes[i].selector} not equal ${pair}. Value checkbox: ${await (await pairingRowObject.pairCheckboxes[i].$('input')).getProperty('checked')}`
      ).eq(pair);
    }
  });
  it('should unpair one planning which all device user', async () => {
    const pair = false;
    const pairingRowObject = await itemsPlanningPairingPage.getPlanningByIndex(1);
    await pairingRowObject.pairWhichAllDeviceUsers(pair, true);
    for (let i = 0; i < pairingRowObject.pairCheckboxesForClick.length; i++) {
      expect(await (await pairingRowObject.pairCheckboxes[i].$('input')).getProperty('checked'),
        `Checkbox ${pairingRowObject.pairCheckboxes[i].selector} not equal ${pair}. Value checkbox: ${await (await pairingRowObject.pairCheckboxes[i].$('input')).getProperty('checked')}`
      ).eq(pair);
    }
  });
  it('should pair one planning which one device user', async () => {
    const pair = true;
    const indexDeviceForPair = 1;
    const pairingRowObject = await itemsPlanningPairingPage.getPlanningByIndex(1);
    await pairingRowObject.pairWithOneDeviceUser(pair, indexDeviceForPair);
    expect(await
      (await pairingRowObject.pairCheckboxes[indexDeviceForPair].$('input'))
        .getProperty('checked'),
      `Checkbox ${pairingRowObject.pairCheckboxes[indexDeviceForPair].selector} not equal ${pair}. Value checkbox: ${await (await pairingRowObject.pairCheckboxes[indexDeviceForPair].$('input')).getProperty('checked')}`)
      .eq(pair);
  });
  it('should unpair one planning which one device user', async () => {
    const pair = false;
    const indexDeviceForPair = 1;
    const pairingRowObject = await itemsPlanningPairingPage.getPlanningByIndex(1);
    await pairingRowObject.pairWithOneDeviceUser(pair, indexDeviceForPair);
    expect(await
      (await pairingRowObject.pairCheckboxes[indexDeviceForPair].$('input'))
        .getProperty('checked'),
      `Checkbox ${pairingRowObject.pairCheckboxes[indexDeviceForPair].selector} not equal ${pair}. Value checkbox: ${await (await pairingRowObject.pairCheckboxes[indexDeviceForPair].$('input')).getProperty('checked')}`)
      .eq(pair);
  });
  after('delete all created for this test', async () => {
    await itemsPlanningPlanningPage.goToPlanningsPage();
    await itemsPlanningPlanningPage.clearTable();

    await myEformsPage.Navbar.goToFolderPage();
    await (await foldersPage.getFolderByName(folderName)).delete();

    await myEformsPage.Navbar.goToDeviceUsersPage();
    for (let i = 0; i < deviceUsers.length; i++) {
      await deviceUsers[i].delete();
    }

    await myEformsPage.Navbar.goToMyEForms();
    await (await myEformsPage.getEformsRowObjByNameEForm(template)).deleteEForm();
  });
});
