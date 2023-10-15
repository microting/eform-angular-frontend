import loginPage from '../../Page objects/Login.page';
import itemsPlanningSettingsPage from '../../Page objects/ItemsPlanning/ItemsPlanningSettings.page';

const expect = require('chai').expect;

describe('Items planning plugin settings page', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await itemsPlanningSettingsPage.goToSettingsPage();
  });
  it('save items planning settings', async () => {
    const settingsData = {
      sdkConnectionString: 'Server=SQLEXPRESS;Database=123_SDK;User ID=sa;Password=Qq1234567$;',
      logLevel: '4',
      logLimit: '25000',
      maxParallelism: '1',
      numberOfWorkers: '1'
    };
    await itemsPlanningSettingsPage.saveSettings(settingsData);
    // Check that items planning settings saved correctly
    const savedSettings = await itemsPlanningSettingsPage.getSettings();
    expect(await savedSettings.sdkConnectionString, 'SDK connection string is incorrect').equal(settingsData.sdkConnectionString);
    expect(await savedSettings.logLevel, 'Log Level is incorrect').equal(settingsData.logLevel);
    expect(await savedSettings.logLimit, 'Log Limit is incorrect').equal(settingsData.logLimit);
    expect(await savedSettings.maxParallelism, 'Max parallelism is incorrect').equal(settingsData.maxParallelism);
    expect(await savedSettings.numberOfWorkers, 'Number of workers is incorrect').equal(settingsData.numberOfWorkers);
  });
});
