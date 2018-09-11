import databasePage from '../../Page objects/Database.page';
import DatabaseConfigurationConstants from '../../Constants/DatabaseConfigurationConstants';
import loginPage from '../../Page objects/Login.page';

const expect = require('chai').expect;

describe('Database', function () {
  it('should be configured successfully', function () {
    databasePage.open('/');
    browser.pause(25000);
    if (databasePage.saveBtn.isExisting()) {
      databasePage.configure(DatabaseConfigurationConstants.languageOptions.english);
      databasePage.save();
      browser.pause(26000);
      expect(loginPage.usernameInput.isVisible()).equal(true);
    }
  });
});
