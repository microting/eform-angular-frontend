import databasePage from '../../Page objects/Database.page';
import DatabaseConfigurationConstants from '../../Constants/DatabaseConfigurationConstants';
import loginPage from '../../Page objects/Login.page';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;

describe('Database', function () {
  it('should be configured successfully', async () => {
    await databasePage.open('/');
    await (await databasePage.saveBtn()).waitForDisplayed({timeout: 90000});
    await (await databasePage.languageDropdown()).waitForDisplayed({timeout: 90000});
    await browser.pause(5000);
    // $('#loginBtn').waitForDisplayed({timeout: 90000});
    await (await databasePage.languageDropdown()).waitForDisplayed({timeout: 90000});
    await browser.pause(1000);
    expect(await (await databasePage.firstNameInput()).isDisplayed()).equal(true);
    expect(await (await databasePage.lastNameInput()).isDisplayed()).equal(true);
    expect(await (await databasePage.emailInput()).isDisplayed()).equal(true);
    expect(await (await databasePage.passwordInput()).isDisplayed()).equal(true);
    expect(await (await databasePage.customerNo()).isDisplayed()).equal(true);
    expect(await (await databasePage.tokenInput()).isDisplayed()).equal(true);
    expect(await (await databasePage.authenticationType()).isDisplayed()).equal(true);
    expect(await (await databasePage.languageDropdown()).isDisplayed()).equal(true);
    //if (await (await databasePage.saveBtn()).isExisting()) {
      await databasePage.configure(DatabaseConfigurationConstants.languageOptions.danish);
      await browser.pause(1000);
      await databasePage.save();
      await (await $('#loginBtn')).waitForDisplayed({timeout: 90000});
      // browser.pause(45000);
      expect(await (await loginPage.loginBtn()).isDisplayed()).equal(true);
    //}
  });
});
