import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { expect } from 'chai';
import { generateRandmString } from '../../../Helpers/helper-functions';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';
import backendConfigurationTaskManagementPage, {TaskManagementFilters} from '../../../Page objects/BackendConfiguration/BackendConfigurationTaskManagement.page';
import {SelectableListRowObject} from '../../../Page objects/SelectableLists.page';
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

describe('Backend Configuration Task Manager Create Task', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.createProperty(property);
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.create(workerForCreate);
    await myEformsPage.Navbar.goToEntitySelect();
    const selectableListRowObject = await new SelectableListRowObject().getRow(2);
    await selectableListRowObject.edit({items: areas}, true);
    await backendConfigurationTaskManagementPage.goToTaskManagement();
  });
  it('should not create new task without required fields', async () => {
    await backendConfigurationTaskManagementPage.changeFilters(filters);
    const rowNum = await backendConfigurationTaskManagementPage.rowNum();
    await backendConfigurationTaskManagementPage.openCreateTaskModal(
      {
        areaName: '',
        assignedTo: '',
        description: generateRandmString(),
        propertyName: ''
      });
    expect(await (await backendConfigurationTaskManagementPage.taskManagementCreateShowSaveBtn()).isClickable()).eq(false);
    await backendConfigurationTaskManagementPage.closeCreateTaskModal(true);
    await backendConfigurationTaskManagementPage.changeFilters(filters);
    expect(rowNum).eq(await backendConfigurationTaskManagementPage.rowNum());
  });
  it('should create new task', async () => {
    await backendConfigurationTaskManagementPage.changeFilters(filters);
    const rowNum = await backendConfigurationTaskManagementPage.rowNum();
    const description = generateRandmString();
    await backendConfigurationTaskManagementPage.createTask(
      {
        areaName: areas[0],
        assignedTo: `${workerForCreate.name} ${workerForCreate.surname}`,
        description: description,
        propertyName: `${property.cvrNumber} - ${property.chrNumber} - ${property.name}`
      });
    await backendConfigurationTaskManagementPage.changeFilters(filters);
    expect(rowNum + 1).eq(await backendConfigurationTaskManagementPage.rowNum());
    const taskRowObject = await backendConfigurationTaskManagementPage.getFirstTaskRowObject();
    expect(taskRowObject.area).eq(areas[0]);
    expect(taskRowObject.lastAssignedTo).eq(`${workerForCreate.name} ${workerForCreate.surname}`);
    expect(taskRowObject.propertyName).eq(property.name);
    expect(taskRowObject.description).eq(description);
  });
  after(async () => {
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.clearTable();
  });
});
