import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { expect } from 'chai';
import { generateRandmString } from '../../../Helpers/helper-functions';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';
import backendConfigurationTaskManagementPage, {TaskManagementFilters} from '../../../Page objects/BackendConfiguration/BackendConfigurationTaskManagement.page';
import selectableLists, {EntitySelectItemEditRowObject, SelectableListRowObject} from '../../../Page objects/SelectableLists.page';
import myEformsPage from '../../../Page objects/MyEforms.page';

const property: PropertyCreateUpdate = {
  name: generateRandmString(),
  chrNumber: generateRandmString(),
  address: generateRandmString(),
  workOrderFlow: true,
  cvrNumber: '1111111',
};
const workerForCreate = {
  name: generateRandmString(),
  surname: generateRandmString(),
  language: 'Dansk',
  properties: [0],
  workOrderFlow: true,
};
const areas = [generateRandmString(), generateRandmString(), generateRandmString(),]
const filters: TaskManagementFilters = {
  propertyName: `${property.cvrNumber} - ${property.chrNumber} - ${property.name}`,
}

describe('Backend Configuration Task Manager Delete Task', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.createProperty(property);
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.create(workerForCreate);
    await backendConfigurationPropertiesPage.goToProperties();
    const createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await createdProperty.propertyTaskAreasBtn.click();
    for (let i = 0; i < (areas).length; i++) {
      const btn = await $('#addSingleEntitySelectableItem');
      await btn.click();
      const itemObj = new EntitySelectItemEditRowObject();
      const item = await itemObj.getRow(i + 1);
      const editBtn = await $$('#entityItemEditBtn')[i];
      await editBtn.click();
      const ele = $(`#entityItemEditNameBox`);
      await ele.waitForDisplayed({timeout: 40000});
      await ele.setValue(areas[i]);
      await browser.pause(500);
      const saveBtn = await $('#entityItemSaveBtn');
      await saveBtn.click();
    }
    const saveBtn = await $('#entityListSaveBtn');
    await saveBtn.click();
    await backendConfigurationTaskManagementPage.goToTaskManagement();
    await backendConfigurationTaskManagementPage.createTask(
      {
        areaName: areas[0],
        assignedTo: `${workerForCreate.name} ${workerForCreate.surname}`,
        propertyName: `${property.cvrNumber} - ${property.chrNumber} - ${property.name}`,
        description: generateRandmString()
      });
    await backendConfigurationTaskManagementPage.changeFilters(filters);
  });
  it('should not delete task because click cancel', async () => {
    const rowNum = await backendConfigurationTaskManagementPage.rowNum();
    const taskRowObject = await backendConfigurationTaskManagementPage.getFirstTaskRowObject();
    await taskRowObject.delete(true);
    await backendConfigurationTaskManagementPage.changeFilters(filters);
    expect(rowNum).eq(await backendConfigurationTaskManagementPage.rowNum());
  });
  it('should delete task', async () => {
    const rowNum = await backendConfigurationTaskManagementPage.rowNum();
    const taskRowObject = await backendConfigurationTaskManagementPage.getFirstTaskRowObject();
    await taskRowObject.delete();
    expect(rowNum - 1).eq(await backendConfigurationTaskManagementPage.rowNum());
  });
  after(async () => {
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.clearTable();
  });
});
