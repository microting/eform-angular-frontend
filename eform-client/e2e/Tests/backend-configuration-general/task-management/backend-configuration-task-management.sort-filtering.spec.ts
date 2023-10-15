import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { expect } from 'chai';
import {generateRandmString, testSorting} from '../../../Helpers/helper-functions';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';
import backendConfigurationTaskManagementPage from '../../../Page objects/BackendConfiguration/BackendConfigurationTaskManagement.page';
import {SelectableListRowObject} from '../../../Page objects/SelectableLists.page';
import myEformsPage from '../../../Page objects/MyEforms.page';

const properties: PropertyCreateUpdate[] = [
  {
  name: generateRandmString(),
  chrNumber: generateRandmString(),
  cvrNumber: '1111111',
  address: generateRandmString(),
  workOrderFlow: true,
  },
  {
    name: generateRandmString(),
    chrNumber: generateRandmString(),
    cvrNumber: '1111111',
    address: generateRandmString(),
    workOrderFlow: true,
  },
  {
    name: generateRandmString(),
    chrNumber: generateRandmString(),
    cvrNumber: '1111111',
    address: generateRandmString(),
    workOrderFlow: true,
  },
];
const workers = [
  {
    name: generateRandmString(),
    surname: generateRandmString(),
    language: 'Dansk',
    properties: [0, 1, 2],
    workOrderFlow: true,
  },
  {
    name: generateRandmString(),
    surname: generateRandmString(),
    language: 'Dansk',
    properties: [0, 1, 2],
    workOrderFlow: true,
  },
  {
    name: generateRandmString(),
    surname: generateRandmString(),
    language: 'Dansk',
    properties: [0, 1, 2],
    workOrderFlow: true,
  }
];
const areas1 = [generateRandmString(), generateRandmString(), generateRandmString(),];
const areas2 = [generateRandmString(), generateRandmString(), generateRandmString(),];
const areas3 = [generateRandmString(), generateRandmString(), generateRandmString(),];

describe('Backend Configuration Task Manager Delete Task', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    for (let i = 0; i < properties.length; i++) {
      await backendConfigurationPropertiesPage.createProperty(properties[i]);
    }
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    for (let i = 0; i < workers.length; i++) {
      await backendConfigurationPropertyWorkersPage.create(workers[i]);
      await browser.pause(500);
    }
    await myEformsPage.Navbar.goToEntitySelect();
    let selectableListRowObject = await new SelectableListRowObject().getRow(2);
    await selectableListRowObject.edit({items: areas1}, true);
    selectableListRowObject = await new SelectableListRowObject().getRow(4);
    await selectableListRowObject.edit({items: areas2}, true);
    selectableListRowObject = await new SelectableListRowObject().getRow(6);
    await selectableListRowObject.edit({items: areas3}, true);
    await backendConfigurationTaskManagementPage.goToTaskManagement();
    for (let i = 0; i < areas1.length; i++) {
      await backendConfigurationTaskManagementPage.createTask(
        {
          areaName: areas1[i],
          assignedTo: `${workers[0].name} ${workers[0].surname}`,
          propertyName: `${properties[0].cvrNumber} - ${properties[0].chrNumber} - ${properties[0].name}`,
          description: generateRandmString(),
        });
    }
    for (let i = 0; i < areas2.length; i++) {
      await backendConfigurationTaskManagementPage.createTask(
        {
          areaName: areas2[i],
          assignedTo: `${workers[1].name} ${workers[1].surname}`,
          propertyName: `${properties[1].cvrNumber} - ${properties[1].chrNumber} - ${properties[1].name}`,
          description: generateRandmString(),
        });
    }
    for (let i = 0; i < areas3.length; i++) {
      await backendConfigurationTaskManagementPage.createTask(
        {
          areaName: areas3[i],
          assignedTo: `${workers[2].name} ${workers[2].surname}`,
          propertyName: `${properties[2].cvrNumber} - ${properties[2].chrNumber} - ${properties[2].name}`,
          description: generateRandmString(),
        });
    }
  });
  it('should filter tasks', async () => {
    await backendConfigurationTaskManagementPage.changeFilters({
      propertyName: `${properties[0].cvrNumber} - ${properties[0].chrNumber} - ${properties[0].name}`
    });
    let taskRowObject = await backendConfigurationTaskManagementPage.getFirstTaskRowObject();
    expect(workers.findIndex(x => `${x.name} ${x.surname}` === taskRowObject.lastAssignedTo)).not.eq(-1);
    expect(taskRowObject.propertyName).eq(properties[0].name);
    expect(areas1.findIndex(x => x === taskRowObject.area)).not.eq(-1);

    await backendConfigurationTaskManagementPage.changeFilters({
      propertyName: `${properties[1].cvrNumber} - ${properties[1].chrNumber} - ${properties[1].name}`
    });
    taskRowObject = await backendConfigurationTaskManagementPage.getFirstTaskRowObject();
    expect(workers.findIndex(x => `${x.name} ${x.surname}` === taskRowObject.lastAssignedTo)).not.eq(-1);
    expect(taskRowObject.propertyName).eq(properties[1].name);
    expect(areas2.findIndex(x => x === taskRowObject.area)).not.eq(-1);

    await backendConfigurationTaskManagementPage.changeFilters({
      propertyName: `${properties[2].cvrNumber} - ${properties[2].chrNumber} - ${properties[2].name}`
    });
    taskRowObject = await backendConfigurationTaskManagementPage.getFirstTaskRowObject();
    expect(workers.findIndex(x => `${x.name} ${x.surname}` === taskRowObject.lastAssignedTo)).not.eq(-1);
    expect(taskRowObject.propertyName).eq(properties[2].name);
    expect(areas3.findIndex(x => x === taskRowObject.area)).not.eq(-1);

    await browser.pause(10000);
    await testSorting(await backendConfigurationTaskManagementPage.idTableHeader(), 'tbody > tr > td.id', 'ID');
    await testSorting(await backendConfigurationTaskManagementPage.caseInitiatedTableHeader(), 'tbody > tr > td.createdDate', 'Created date');
    await testSorting(await backendConfigurationTaskManagementPage.selectedAreaNameTableHeader(), 'tbody > tr > td.areaName', 'Area name');
    await testSorting(await backendConfigurationTaskManagementPage.createdByNameTableHeader(), 'tbody > tr > td.createdByName', 'Created by name');
    await testSorting(await backendConfigurationTaskManagementPage.createdByTextTableHeader(), 'tbody > tr > td.createdByText', 'Created by text');
    await testSorting(await backendConfigurationTaskManagementPage.lastAssignedToNameTableHeader(), 'tbody > tr > td.lastAssignedTo', 'Last assigned to');
    await testSorting(await backendConfigurationTaskManagementPage.updatedAtTableHeader(), 'tbody > tr > td.lastUpdateDate', 'Last update date');
    await testSorting(await backendConfigurationTaskManagementPage.caseStatusesEnumTableHeader(), 'tbody > tr > td.status', 'Status');
  });
  after(async () => {
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.clearTable();
  });
});
