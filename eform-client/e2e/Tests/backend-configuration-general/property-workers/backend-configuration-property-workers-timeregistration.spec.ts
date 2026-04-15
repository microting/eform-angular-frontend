import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
import { expect } from 'chai';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';
import { $ } from '@wdio/globals';

const property: PropertyCreateUpdate = {
  name: generateRandmString(),
  chrNumber: generateRandmString(),
  address: generateRandmString(),
  cvrNumber: '1111111',
};

const workerWithTimeRegistration = {
  name: generateRandmString(),
  surname: generateRandmString(),
  language: 'Dansk',
  properties: [0],
  workerEmail: generateRandmString() + '@test.com',
  timeRegistrationEnabled: true,
  timeSettings: {
    monday: { start: '08:00', end: '16:00', break: 30 },
    tuesday: { start: '08:00', end: '16:00', break: 30 },
    wednesday: { start: '08:00', end: '16:00', break: 30 },
    thursday: { start: '08:00', end: '16:00', break: 30 },
    friday: { start: '08:00', end: '16:00', break: 30 },
    saturday: { start: '', end: '', break: 0 },
    sunday: { start: '', end: '', break: 0 },
  },
};

describe('Backend Configuration Property Workers - Time Registration Tab', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
  });

  it('should create a property', async () => {
    await backendConfigurationPropertiesPage.createProperty(property);
    const lastProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    expect(lastProperty).to.not.be.null;
  });

  it('should create worker with time registration enabled', async () => {
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.create(workerWithTimeRegistration);
    await browser.pause(500);
    const worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    expect(worker.fullName).eq(
      workerWithTimeRegistration.name + ' ' + workerWithTimeRegistration.surname
    );
  });

  it('should show time registration tab when timeRegistrationEnabled is true', async () => {
    const worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    await worker.openEditModal(null);
    await browser.pause(500);

    // Check if timeregistration tab exists
    const timeRegistrationTab = await $('#timeregistrationTab');
    expect(await timeRegistrationTab.isDisplayed()).eq(true);
  });

  it('should be able to set time registration fields', async () => {
    // Switch to time registration tab
    const timeRegistrationTab = await $('#timeregistrationTab');
    await timeRegistrationTab.click();
    await browser.pause(500);

    // Set Monday times
    const startMonday = await $('#startMonday');
    const endMonday = await $('#endMonday');
    const breakMonday = await $('#breakMonday');

    await startMonday.setValue('08:00');
    await endMonday.setValue('16:00');
    await breakMonday.setValue('30');

    // Verify values were set
    expect(await startMonday.getValue()).eq('08:00');
    expect(await endMonday.getValue()).eq('16:00');
    expect(await breakMonday.getValue()).eq('30');

    // Save the changes
    const saveBtn = await $('#saveEditBtn');
    await saveBtn.click();
    await browser.pause(1000);
  });

  it('should persist time registration settings after edit', async () => {
    const worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    await worker.openEditModal(null);
    await browser.pause(500);

    // Switch to time registration tab
    const timeRegistrationTab = await $('#timeregistrationTab');
    await timeRegistrationTab.click();
    await browser.pause(500);

    // Verify Monday times persisted
    const startMonday = await $('#startMonday');
    const endMonday = await $('#endMonday');
    const breakMonday = await $('#breakMonday');

    expect(await startMonday.getValue()).eq('08:00');
    expect(await endMonday.getValue()).eq('16:00');
    expect(await breakMonday.getValue()).eq('30');

    // Close modal
    const cancelBtn = await $('#cancelEditBtn');
    await cancelBtn.click();
    await browser.pause(500);
  });

  it('should not show time registration tab when timeRegistrationEnabled is false', async () => {
    // Create worker without time registration
    const workerWithoutTimeRegistration = {
      name: generateRandmString(),
      surname: generateRandmString(),
      language: 'Dansk',
      properties: [0],
      workerEmail: generateRandmString() + '@test.com',
      timeRegistrationEnabled: false,
    };

    await backendConfigurationPropertyWorkersPage.create(workerWithoutTimeRegistration);
    await browser.pause(500);
    const worker = await backendConfigurationPropertyWorkersPage.getLastRowObject();
    await worker.openEditModal(null);
    await browser.pause(500);

    // Check if timeregistration tab does NOT exist
    const timeRegistrationTab = await $('#timeregistrationTab');
    expect(await timeRegistrationTab.isExisting()).eq(false);

    const cancelBtn = await $('#cancelEditBtn');
    await cancelBtn.click();
    await browser.pause(500);
  });

  after(async () => {
    await backendConfigurationPropertyWorkersPage.clearTable();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
  });
});
