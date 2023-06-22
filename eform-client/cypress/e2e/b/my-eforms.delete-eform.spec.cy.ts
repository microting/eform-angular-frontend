import loginPage from '../Login.page';
import {myEformsPage} from '../MyEforms.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;
describe('Main Page', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  // it('should create eform', () => {
  //   (myEformsPage.idSortBtn()).click();
  //   $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  //   const rowCountBeforeCreation = myEformsPage.rowNum();
  //   const newEformLabel = Guid.create().toString();
  //   myEformsPage.createNewEform(newEformLabel);
  //   const eform = myEformsPage.getFirstMyEformsRowObj();
  //   expect(eform.eFormName).equal(newEformLabel);
  //   const rowCountAfterCreation = myEformsPage.rowNum();
  //   expect(rowCountBeforeCreation + 1).eq(rowCountAfterCreation);
  // });
  // it('should delete existing eform', () => {
  //   const rowCountBeforeDelete = myEformsPage.rowNum();
  //   const eform = myEformsPage.getFirstMyEformsRowObj();
  //   eform.deleteEForm();
  //   browser.pause(1000);
  //   const rowCountAfterDelete = myEformsPage.rowNum();
  //   expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  // });
});
