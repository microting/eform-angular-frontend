import loginPage from '../Login.page';
import {myEformsPage, myEformsRowObject} from '../MyEforms.page';
import {generateRandmString} from '../helper-functions';


describe('My eforms', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    // myEformsPage.clearTable();
  });
  it('should create eform without any tags', () => {
    const newEformLabel = generateRandmString();
    myEformsPage.createNewEform(newEformLabel);
    myEformsPage.rowNum().should('eq', 1);
    const rowObj = myEformsPage.getFirstRowObject(['eFormName']);
    rowObj.eFormName.should('have.text', newEformLabel);
    rowObj.element().find('.mat-column-tags .eform-tag').should('not.exist');
  });
  it('should create eform simultaneously with creating 1 tag', () => {
    const newEformLabel = generateRandmString();
    const newEformTag = generateRandmString();
    myEformsPage.createNewEform(newEformLabel, [newEformTag]);
    myEformsPage.rowNum().should('eq', 1).then(() => {
      const rowObj = myEformsPage.getFirstRowObject(['eFormName', 'tags']);
      rowObj.eFormName.should('have.text', newEformLabel);
      rowObj.tags.should('have.length', 1);
    });
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
  afterEach(() => {
    myEformsPage.clearTable();
  });
});
