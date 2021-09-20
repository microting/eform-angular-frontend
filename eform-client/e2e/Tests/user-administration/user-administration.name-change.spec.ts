import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import userAdministration, {
  UserAdministrationObject,
} from '../../Page objects/UserAdministration.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('User administration settings', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToUserAdministration();
  });
  it('should set name to Foo Bar', async () => {
    const user: UserAdministrationObject = {
      firstName: 'Foo',
      lastName: 'Bar',
    };
    let userObject = userAdministration.getUserByNumber();
    userObject.edit(user);
    userObject = userAdministration.getUserByNumber();
    expect(userObject.fullName).equal('Foo Bar');
  });
  it('should revert to old name', async () => {
    const user: UserAdministrationObject = {
      firstName: 'John',
      lastName: 'Smith',
    };
    let userObject = userAdministration.getUserByNumber();
    userObject.edit(user);
    userObject = userAdministration.getUserByNumber();
    expect(userObject.fullName).equal('John Smith');
  });
  it('should create new user', async () => {
    const user: UserAdministrationObject = {
      firstName: generateRandmString(),
      lastName: generateRandmString(),
      group: 'eForm users',
      role: 'User',
      email: 'user@user.com',
      password: generateRandmString(),
    };
    const countUserBeforeCreate = userAdministration.rowNum;
    userAdministration.createNewUser(user);
    expect(countUserBeforeCreate + 1, 'user not created').eq(
      userAdministration.rowNum
    );
  });
  it('should change new user role', async () => {
    let userObject = userAdministration.getUserByNumber(2);
    const user: UserAdministrationObject = {
      role: 'Admin',
    };
    userObject.edit(user);
    userObject = userAdministration.getUserByNumber(2);
    expect(userObject.role, 'user role not changed').eq(
      user.role.toLowerCase()
    );
  });
  it('should revert new user role', async () => {
    let userObject = userAdministration.getUserByNumber(2);
    const user: UserAdministrationObject = {
      role: 'User',
      group: 'eForm users',
    };
    userObject.edit(user);
    userObject = userAdministration.getUserByNumber(2);
    expect(userObject.role, 'user role not changed').eq(
      user.role.toLowerCase()
    );
  });
  it('should delete created user', async () => {
    const countUserBeforeDelete = userAdministration.rowNum;
    userAdministration.getUserByNumber(2).delete();
    expect(countUserBeforeDelete - 1, 'user not created').eq(
      userAdministration.rowNum
    );
  });
});
