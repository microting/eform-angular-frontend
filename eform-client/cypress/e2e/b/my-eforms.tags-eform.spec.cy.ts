import loginPage from '../Login.page';
import {myEformsPage} from '../MyEforms.page';
import { generateRandmString } from '../helper-functions';

import {expect} from 'chai';
const testTag = 'Test tag';
const newEformLabel = generateRandmString();
describe('Main page', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  // it('should create eform', () => {
  //   (myEformsPage.idSortBtn()).click();
  //   $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  //   const rowCountBeforeCreation = myEformsPage.rowNum();
  //   myEformsPage.createNewEform(newEformLabel);
  //   const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
  //   expect(eform.eFormName).eq(newEformLabel);
  //   const rowCountAfterCreation = myEformsPage.rowNum();
  //   expect(rowCountBeforeCreation + 1).eq(rowCountAfterCreation);
  // });
  // it('should not perform any changes by doing nothing and clicking "Save" in tag edit window', () => {
  //   const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
  //   eform.editTagsBtn.click();
  //   (myEformsPage.tagEditSaveBtn()).click();
  //   $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  //   expect(
  //     (myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).tags.length
  //   ).eq(0);
  // });
  // it('should create tag', () => {
  //   const elem = $('#toast-container');
  //   elem.waitForDisplayed({ timeout: 40000, reverse: true });
  //   myEformsPage.createNewTag(testTag);
  //   elem.waitForDisplayed({ timeout: 40000 });
  //   expect(elem.getText()).eq(`Tag "${testTag}" oprettet`);
  // });
  // it('should add already prepared tag to eform', () => {
  //   (myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).addTag(testTag);
  //   browser.pause(500);
  //   expect(
  //     (myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).tags[0].getText()
  //   ).eq(testTag);
  // });
  // it('should delete eForm tag from eform', () => {
  //   let eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
  //   const elem = $('#toast-container');
  //   elem.waitForDisplayed({ timeout: 40000, reverse: true });
  //   eform.deleteTags([testTag]);
  //   elem.waitForDisplayed({ timeout: 40000 });
  //   elem.click();
  //   browser.pause(500);
  //   eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
  //   expect(eform.tags.length).eq(0);
  // });
  // it('should delete tag from list', () => {
  //   const elem = $('#toast-container');
  //   elem.waitForDisplayed({ timeout: 40000, reverse: true });
  //   myEformsPage.removeTag(testTag);
  //   elem.waitForDisplayed({ timeout: 40000 });
  //   expect(elem.getText()).eq(`Tag slettet`);
  // });
  // it('should delete existing eform', () => {
  //   const rowCountBeforeDelete = myEformsPage.rowNum();
  //   (myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).deleteEForm();
  //   browser.pause(500);
  //   const rowCountAfterDelete = myEformsPage.rowNum();
  //   expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  // });
});
