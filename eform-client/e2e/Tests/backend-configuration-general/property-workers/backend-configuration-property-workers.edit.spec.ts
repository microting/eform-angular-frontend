import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
import { expect } from 'chai';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';

const property: PropertyCreateUpdate = {
  name: generateRandmString(),
  chrNumber: generateRandmString(),
  address: generateRandmString(),
  cvrNumber: '1111111',
  // selectedLanguages: [
  //   { languageId: 1, languageName: 'Dansk' },
  //   { languageId: 2, languageName: 'Engelsk' },
  // ],
};
const workerForCreate = {
  name: generateRandmString(),
  surname: generateRandmString(),
  language: 'Dansk',
  properties: [0],
};

describe('Backend Configuration Property Workers - Create and edit', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
  });
  it('should create worker and pair to created property', async () => {
    await backendConfigurationPropertiesPage.createProperty(property);
    const lastProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    expect(await lastProperty.editPropertyAreasBtn.isEnabled()).eq(false);
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.create(workerForCreate);
    await browser.pause(500);
    const worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    expect(worker.fullName).eq(workerForCreate.name + ' ' + workerForCreate.surname);
    const properties = await worker.getAssignedProperties();
    expect(properties).deep.eq([
      //{ propertyName: property.cvrNumber + ' - ' + property.chrNumber + ' - ' + property.name, checked: true },
      { propertyName: property.name, checked: true },
    ]);
  });
  it('should edit worker and unpair from property', async () => {
    const worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    await worker.edit({ properties: [0] });
    await browser.pause(500);
    const properties = await worker.getAssignedProperties();
    expect(properties).deep.eq([
      //{ propertyName: property.cvrNumber + ' - ' + property.chrNumber + ' - ' + property.name, checked: false },
      { propertyName: property.name, checked: false },
    ]);
  });
  it('should check modals', async () => {
    let worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    await worker.edit(
      {
        name: generateRandmString(),
        surname: generateRandmString(),
        properties: [0],
      },
      true
    );
    worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    const properties = await worker.getAssignedProperties();
    expect(properties).deep.eq([
      //{ propertyName: property.cvrNumber + ' - ' + property.chrNumber + ' - ' + property.name, checked: false },
      { propertyName: property.name, checked: false },
    ]);
    expect(worker.fullName).eq(workerForCreate.name + ' ' + workerForCreate.surname);
    // expect(worker.lastName).eq(workerForCreate.surname);
    expect(worker.language).eq(workerForCreate.language);
    // check inputs
    await worker.openEditModal(null);
    expect(
      await (
        await backendConfigurationPropertyWorkersPage.editFirstNameInput()
      ).getValue()
    ).eq(workerForCreate.name);
    expect(
      await (
        await backendConfigurationPropertyWorkersPage.editLastNameInput()
      ).getValue()
    ).eq(workerForCreate.surname);
    await worker.closeEditModal(true);
    // check create
    const rowNum = await backendConfigurationPropertyWorkersPage.rowNum();
    await backendConfigurationPropertyWorkersPage.create(workerForCreate, true);
    expect(rowNum).eq(await backendConfigurationPropertyWorkersPage.rowNum());
    await backendConfigurationPropertyWorkersPage.openCreateModal(null);
    expect(
      await (
        await backendConfigurationPropertyWorkersPage.createFirstNameInput()
      ).getValue()
    ).eq('');
    expect(
      await (
        await backendConfigurationPropertyWorkersPage.createLastNameInput()
      ).getValue()
    ).eq('');
    await backendConfigurationPropertyWorkersPage.closeCreateModal(true);
  });
  after(async () => {
    await backendConfigurationPropertyWorkersPage.clearTable();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
  });
});
