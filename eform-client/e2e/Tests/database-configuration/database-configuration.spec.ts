import databasePage from '../../Page objects/Database.page';
import DatabaseConfigurationConstants from '../../Constants/DatabaseConfigurationConstants';
import loginPage from '../../Page objects/Login.page';

const expect = require('chai').expect;

describe('Database', function () {
  it('should be configured successfully', async () => {
    databasePage.open('/');
    await databasePage.saveBtn.waitForDisplayed({timeout: 90000});
    await databasePage.languageDropdown.waitForDisplayed({timeout: 90000});
    await browser.pause(5000);
    // $('#loginBtn').waitForDisplayed({timeout: 90000});
    await databasePage.languageDropdown.waitForDisplayed({timeout: 90000});
    await browser.pause(1000);
    expect(await databasePage.firstNameInput.isDisplayed()).equal(true);
    expect(await databasePage.lastNameInput.isDisplayed()).equal(true);
    expect(await databasePage.emailInput.isDisplayed()).equal(true);
    expect(await databasePage.passwordInput.isDisplayed()).equal(true);
    expect(await databasePage.customerNo.isDisplayed()).equal(true);
    expect(await databasePage.tokenInput.isDisplayed()).equal(true);
    expect(await databasePage.authenticationType.isDisplayed()).equal(true);
    expect(await databasePage.languageDropdown.isDisplayed()).equal(true);
    if (await databasePage.saveBtn.isExisting()) {
      databasePage.configure(DatabaseConfigurationConstants.languageOptions.danish);
      await browser.pause(1000);
      await databasePage.save();
      await $('#loginBtn').waitForDisplayed({timeout: 90000});
      // browser.pause(45000);
      expect(await loginPage.loginBtn.isDisplayed()).equal(true);
    }
  });
});
