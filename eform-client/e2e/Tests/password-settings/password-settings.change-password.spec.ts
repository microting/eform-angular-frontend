import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import passwordSettings from '../../Page objects/PasswordSettings.page';

const expect = require('chai').expect;

describe('Password settings', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
  });

  it('should change password and revert it back', async () => {
    // Navigate to password settings
    myEformsPage.Navbar.goToPasswordSettings();
    
    // Change password to new password
    passwordSettings.setNewPassword();
    
    // Logout
    passwordSettings.Navbar.logout();
    
    // Login with new password to verify change worked
    loginPage.open('/');
    loginPage.loginWithNewPassword();
    
    // Navigate to password settings to revert
    myEformsPage.Navbar.goToPasswordSettings();
    
    // Revert password back to original
    passwordSettings.revertToOldPassword();
    
    // Logout
    passwordSettings.Navbar.logout();
    
    // Login with original password to verify revert worked
    loginPage.open('/');
    loginPage.login();
    
    // Verify we can access password settings again
    myEformsPage.Navbar.goToPasswordSettings();
  });
});
