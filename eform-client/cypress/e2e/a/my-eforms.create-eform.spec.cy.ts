import loginPage from '../Login.page';
import {myEformsPage, myEformsRowObject} from '../MyEforms.page';
import { v4 as uuidv4 } from 'uuid';
import {Guid} from 'guid-typescript';
import {expect} from 'chai';


// @ts-ignore
describe('My eforms', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  // @ts-ignore
  it('should create eform without any tags',() => {
    // const newEformLabel = Guid.create().toString();
    // myEformsPage.createNewEform(newEformLabel);
    // myEformsPage.rowNum().then((rowNum) => {
    //   console.log(rowNum);
    //   myEformsRowObject.getRow(rowNum).then((row) => {
    //     expect(row.tags.length).to.equal(0);
    //     console.log(row);
    //     row.deleteBtn.click();
    //     myEformsRowObject.deleteEForm();
    //   });
    // });
    //myEformsPage.getEformsRowObjByNameEForm(newEformLabel).then((eform) => {
    //  expect(eform.tags.length).to.equal(1);
    //   //expect(eform.tags[0].getText()).to.eventually.equal(createdTag);
    //   const countBeforeDelete = myEformsPage.rowNum();
    //   eform.deleteEForm();
    //   myEformsPage.rowNum().then((newRowCount) => {
    //     expect(countBeforeDelete - 1).to.equal(newRowCount);
    //   });
    //});
    // const countBeforeDelete = myEformsPage.rowNum();
    // eform.deleteEForm();
    // const newRowCount = myEformsPage.rowNum();
    // expect(+countBeforeDelete - 1).eq(newRowCount);
  });
  // it('should create eform simultaneously with creating 1 tag', () => {
  //   const newEformLabel = uuidv4();
  //   const createdTag = uuidv4();
  //   myEformsPage.createNewEform(newEformLabel, [createdTag]);
  //   arrayNamesTag.push(createdTag);
  //   myEformsPage.getEformsRowObjByNameEForm(newEformLabel).then((eform) => {
  //     expect(eform.tags.length).to.equal(1);
  //     expect(eform.tags[0].getText()).to.eventually.equal(createdTag);
  //     const countBeforeDelete = myEformsPage.rowNum();
  //     eform.deleteEForm();
  //     myEformsPage.rowNum().then((newRowCount) => {
  //       expect(countBeforeDelete - 1).to.equal(newRowCount);
  //     });
  //   });
  // });
  // it('should create eform simultaneously with creating 2 tags', () => {
  //   const newEformLabel = uuidv4();
  //   const createdTags = [uuidv4(), uuidv4()];
  //   myEformsPage.createNewEform(newEformLabel, createdTags);
  //   arrayNamesTag.push(...createdTags);
  //   myEformsPage.getEformsRowObjByNameEForm(newEformLabel).then((eform) => {
  //     const tagsTexts = eform.tags.map((item) => item.getText());
  //     Promise.all(tagsTexts).then((tagsTexts) => {
  //       expect(eform.tags.length).to.equal(createdTags.length);
  //       expect(tagsTexts).to.include.members(createdTags);
  //       const countBeforeDelete = myEformsPage.rowNum();
  //       eform.deleteEForm();
  //       myEformsPage.rowNum().then((newRowCount) => {
  //         expect(countBeforeDelete - 1).to.equal(newRowCount);
  //       });
  //     });
  //   });
  // });
  // it('should create eform with creating 1 tag and using 1 already prepared tag', () => {
  //   const newEformLabel = uuidv4();
  //   const createdTags = [uuidv4()];
  //   const tagAddedNum = 1;
  //   myEformsPage.createNewEform(newEformLabel, createdTags, tagAddedNum);
  //   cy.wrap(createdTags).each((tag) => {
  //     cy.contains(tag).should('be.visible');
  //   });
  //   cy.contains(newEformLabel).click();
  //   cy.wrap(createdTags).each((tag) => {
  //     cy.contains(tag).should('have.class', 'selected');
  //   });
  //   myEformsPage.deleteEForm();
  //   cy.contains(newEformLabel).should('not.exist');
  // });
  //
  // it('should create eform while adding 1 already prepared tag', () => {
  //   const newEformLabel = uuidv4();
  //   const tagAddedNum = 1;
  //   myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
  //   cy.contains(newEformLabel).click();
  //   cy.contains('No tags selected').should('be.visible');
  //   myEformsPage.deleteEForm();
  //   cy.contains(newEformLabel).should('not.exist');
  // });
  //
  // it('should create eform while adding more than 2 already prepared tags', () => {
  //   const newEformLabel = uuidv4();
  //   const tagAddedNum = 2;
  //   myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
  //   cy.contains(newEformLabel).click();
  //   cy.contains('No tags selected').should('be.visible');
  //   myEformsPage.deleteEForm();
  //   cy.contains(newEformLabel).should('not.exist');
  // });
  //
  // it('should not create eform if xml is empty', () => {
  //   myEformsPage.clickNewEformBtn();
  //   cy.get('#createFormButton').should('be.disabled');
  // });
});
