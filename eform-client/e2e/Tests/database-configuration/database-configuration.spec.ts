import databasePage from '../../Page objects/Database.page';
import DatabaseConfigurationConstants from '../../Constants/DatabaseConfigurationConstants';
import loginPage from '../../Page objects/Login.page';

const expect = require('chai').expect;

describe('Database', function () {
  it('should be configured successfully', function () {
    databasePage.open('/');
    databasePage.saveBtn.waitForDisplayed({ timeout: 90000 });
    databasePage.languageDropdown.waitForDisplayed({ timeout: 90000 });
    browser.pause(5000);
    // $('#loginBtn').waitForDisplayed({timeout: 90000});
    databasePage.languageDropdown.waitForDisplayed({ timeout: 90000 });
    browser.pause(1000);
    expect(databasePage.firstNameInput.isDisplayed()).equal(true);
    expect(databasePage.lastNameInput.isDisplayed()).equal(true);
    expect(databasePage.emailInput.isDisplayed()).equal(true);
    expect(databasePage.passwordInput.isDisplayed()).equal(true);
    expect(databasePage.customerNo.isDisplayed()).equal(true);
    expect(databasePage.tokenInput.isDisplayed()).equal(true);
    expect(databasePage.authenticationType.isDisplayed()).equal(true);
    expect(databasePage.languageDropdown.isDisplayed()).equal(true);
    if (databasePage.saveBtn.isExisting()) {
      databasePage.configure(
        DatabaseConfigurationConstants.languageOptions.danish
      );
      browser.pause(1000);
      databasePage.save();
      $('#loginBtn').waitForDisplayed({ timeout: 180000 });
      // browser.pause(45000);
      expect(loginPage.loginBtn.isDisplayed()).equal(true);
    }
  });
});
