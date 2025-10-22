import loginPage from '../Login.page';
import userAdministrationPage, {
  UserAdministrationObject,
} from '../UserAdministration.page';
import { generateRandmString } from '../helper-functions';
import { expect } from 'chai';

describe('User Administration - Name Change', function () {
  const randomPassword = generateRandmString();

  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('GET', '**/api/admin/get-users').as('loadUsers');
    userAdministrationPage.Navbar.goToUserAdministration();
    cy.wait('@loadUsers', { timeout: 30000 });
    cy.get('#createNewUserBtn', { timeout: 10000 }).should('be.visible');
  });

  it('should set name to Foo Bar', () => {
    const user: UserAdministrationObject = {
      firstName: 'Foo',
      lastName: 'Bar',
      password: 'secretpassword',
    };

    const userObject = userAdministrationPage.getUserByNumber(1);
    userObject.edit(user);

    // Verify the name was changed
    cy.get('#userAdministrationFullName-0')
      .invoke('text')
      .then(text => {
        expect(text).to.equal('Foo Bar');
      });
  });

  it('should revert to old name', () => {
    const user: UserAdministrationObject = {
      firstName: 'John',
      lastName: 'Smith',
      password: 'secretpassword',
    };

    const userObject = userAdministrationPage.getUserByNumber(1);
    userObject.edit(user);

    // Verify the name was reverted
    cy.get('#userAdministrationFullName-0')
      .invoke('text')
      .then(text => {
        expect(text).to.equal('John Smith');
      });
  });

  it('should create new user', () => {
    const user: UserAdministrationObject = {
      firstName: generateRandmString(),
      lastName: generateRandmString(),
      group: 'eForm users',
      role: 'User',
      email: 'user@user.com',
      password: randomPassword,
    };

    userAdministrationPage.rowNum().then((countBefore) => {
      userAdministrationPage.createNewUser(user);

      userAdministrationPage.rowNum().then((countAfter) => {
        expect(
          countAfter,
          'User not created'
        ).to.equal(countBefore + 1);
      });
    });
  });

  it('should change new user role', () => {
    const user: UserAdministrationObject = {
      role: 'Admin',
      password: randomPassword,
    };

    const userObject = userAdministrationPage.getUserByNumber(2);
    userObject.edit(user);

    // Verify the role was changed
    cy.get('#userAdministrationRole-1')
      .invoke('text')
      .then(text => {
        expect(text.toLowerCase()).to.equal('admin');
      });
  });

  it('should revert new user role', () => {
    const user: UserAdministrationObject = {
      role: 'User',
      group: 'eForm users',
      password: randomPassword,
    };

    const userObject = userAdministrationPage.getUserByNumber(2);
    userObject.edit(user);

    // Verify the role was reverted
    cy.get('#userAdministrationRole-1')
      .invoke('text')
      .then(text => {
        expect(text.toLowerCase()).to.equal('user');
      });
  });

  it('should delete created user', () => {
    userAdministrationPage.rowNum().then((countBefore) => {
      const userObject = userAdministrationPage.getUserByNumber(2);
      userObject.delete();

      userAdministrationPage.rowNum().then((countAfter) => {
        expect(
          countAfter,
          'User not deleted'
        ).to.equal(countBefore - 1);
      });
    });
  });
});
