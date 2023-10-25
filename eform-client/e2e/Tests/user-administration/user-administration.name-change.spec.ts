import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import userAdministration, {
  UserAdministrationObject,
} from '../../Page objects/UserAdministration.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('User administration settings', function () {
  const randomPassword = generateRandmString();
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToUserAdministration();
  });
  it('should set name to Foo Bar', async () => {
    const user: UserAdministrationObject = {
      firstName: 'Foo',
      lastName: 'Bar',
      password: 'secretpassword',
    };
    let userObject = await userAdministration.getUserByNumber();
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber();
    expect(userObject.fullName).equal('Foo Bar');
  });
  it('should revert to old name', async () => {
    const user: UserAdministrationObject = {
      firstName: 'John',
      lastName: 'Smith',
      password: 'secretpassword',
    };
    let userObject = await userAdministration.getUserByNumber();
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber();
    expect(userObject.fullName).equal('John Smith');
  });
  it('should create new user', async () => {
    const user: UserAdministrationObject = {
      firstName: generateRandmString(),
      lastName: generateRandmString(),
      group: 'eForm users',
      role: 'User',
      email: 'user@user.com',
      password: randomPassword,
    };
    const countUserBeforeCreate = await userAdministration.rowNum();
    await browser.pause(500);
    await userAdministration.createNewUser(user);
    expect(countUserBeforeCreate + 1, 'user not created').eq(
      await userAdministration.rowNum()
    );
  });
  it('should change new user role', async () => {
    let userObject = await userAdministration.getUserByNumber(2);
    const user: UserAdministrationObject = {
      role: 'Admin',
      password: randomPassword,
    };
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber(2);
    expect(userObject.role, 'user role not changed').eq(
      user.role.toLowerCase()
    );
  });
  it('should revert new user role', async () => {
    let userObject = await userAdministration.getUserByNumber(2);
    const user: UserAdministrationObject = {
      role: 'User',
      group: 'eForm users',
      password: randomPassword,
    };
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber(2);
    expect(userObject.role, 'user role not changed').eq(
      user.role.toLowerCase()
    );
  });
  it('should delete created user', async () => {
    const countUserBeforeDelete = await userAdministration.rowNum();
    await (await userAdministration.getUserByNumber(2)).delete();
    expect(countUserBeforeDelete - 1, 'user not created').eq(
      await userAdministration.rowNum()
    );
  });
});
