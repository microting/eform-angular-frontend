import databasePage from '../../Page objects/Database.page';
import DatabaseConfigurationConstants from '../../Constants/DatabaseConfigurationConstants';
import loginPage from '../../Page objects/Login.page';

const expect = require('chai').expect;

describe('Database', function () {
  it('should be configured successfully', function () {
    databasePage.open('/');
    browser.pause(30000);
    expect(databasePage.firstNameInput.isVisible()).equal(true);
    expect(databasePage.lastNameInput.isVisible()).equal(true);
    expect(databasePage.emailInput.isVisible()).equal(true);
    expect(databasePage.passwordInput.isVisible()).equal(true);
    expect(databasePage.customerNo.isVisible()).equal(true);
    expect(databasePage.tokenInput.isVisible()).equal(true);
    expect(databasePage.authenticationType.isVisible()).equal(true);
    expect(databasePage.sqlserverDropdown.isVisible()).equal(true);
    expect(databasePage.languageDropdown.isVisible()).equal(true);
    if (databasePage.saveBtn.isExisting()) {
      databasePage.configure(DatabaseConfigurationConstants.languageOptions.danish);
      databasePage.save();
      browser.pause(45000);
      expect(loginPage.loginBtn.isVisible()).equal(true);
    }
  });
});
