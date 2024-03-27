import loginPage from '../Login.page';
import {myEformsPage} from '../MyEforms.page';
import { generateRandmString } from '../helper-functions';

import {expect} from 'chai';
const testTag1 = 'Test tag';
const testTag2 = 'Tag for test';
const countCreateEForm = 3;
let countRowsBeforeFiltering = 0;
const namesEForms = new Array<string>();
describe('My eforms', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  // it('should be able to filter by 1 word in label input', () => {
  //   (myEformsPage.idSortBtn()).click();
  //   const spinnerAnimation = $('#spinner-animation');
  //   spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
  //   for (let i = 0; i < countCreateEForm; i++) {
  //     const newEForm = generateRandmString();
  //     myEformsPage.createNewEform(newEForm);
  //     namesEForms.push(newEForm);
  //   }
  //   const nameEFormForFiltering = namesEForms[1];
  //   countRowsBeforeFiltering = myEformsPage.rowNum();
  //   expect(countRowsBeforeFiltering).equal(3);
  //   (myEformsPage.eformFilter()).setValue(nameEFormForFiltering);
  //   spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
  //   browser.pause(2000);
  //   const eform = myEformsPage.getEformsRowObjByNameEForm(
  //     nameEFormForFiltering
  //   );
  //   expect(eform).not.equal(null);
  // });
  // it('should be able to see all eforms by leaving label input empty', () => {
  //   (myEformsPage.eformFilter()).click();
  //   browser.keys(['Control', 'a', 'Control', 'Delete']);
  //   $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
  //   browser.pause(2000);
  //   expect(myEformsPage.rowNum()).equal(3);
  // });
  // it('should be able to filter using 1 tag', () => {
  //   myEformsPage.createNewTags([testTag1, testTag2]);
  //   // (myEformsPage.getEformsRowObjByNameEForm(namesEForms[1])).addTag(testTag2);
  //   let form = myEformsPage.getEformsRowObjByNameEForm(namesEForms[1]);
  //   form.addTag(testTag2);
  //   form = myEformsPage.getEformsRowObjByNameEForm(namesEForms[2]);
  //   form.addTag(testTag1);
  //   myEformsPage.enterTagFilter(testTag1);
  //   expect(form.eFormName).eq((myEformsPage.getFirstMyEformsRowObj()).eFormName);
  // });
  // it('should be able to filter using several tags', () => {
  //   myEformsPage.enterTagFilter(testTag2);
  //   expect(myEformsPage.rowNum()).eq(2);
  // });
  // after(() => {
  //   (myEformsPage.eformFilter()).click();
  //   browser.keys(['Control', 'a', 'Control', 'Delete']);
  //   browser.pause(500);
  //   let lastTag = $('#tagSelector ng-select > div > div > .ng-value > span.ng-value-icon');
  //   lastTag.click();
  //   lastTag = $('#tagSelector ng-select > div > div > .ng-value > span.ng-value-icon');
  //   lastTag.click();
  //   myEformsPage.removeTags([testTag1, testTag2]);
  //   browser.pause(500);
  //   for (let i = 0; i < namesEForms.length; i++) {
  //     const form = myEformsPage.getEformsRowObjByNameEForm(namesEForms[i]);
  //     form.deleteEForm();
  //     browser.pause(500);
  //   }
  // });
});
