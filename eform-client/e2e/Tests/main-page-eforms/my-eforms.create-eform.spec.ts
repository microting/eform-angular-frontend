import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;
let arrayNamesTag = new Array<string>();
before(function () {
  loginPage.open('/');
  loginPage.login();
});
describe('My eforms', function () {
  it('should create eform without any tags', function () {
    const newEformLabel = Guid.create().toString();
    myEformsPage.createNewEform(newEformLabel);
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).equal(0);
    const countBeforeDelete = myEformsPage.rowNum;
    eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(myEformsPage.rowNum);
  });
  it('should create eform simultaneously with creating 1 tag', function () {
    const newEformLabel = Guid.create().toString();
    const createdTag = Guid.create().toString();
    myEformsPage.createNewEform(newEformLabel, [createdTag]);
    arrayNamesTag.push(createdTag);
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).equal(1);
    expect(eform.tags[0].getText()).equal(createdTag);
    const countBeforeDelete = myEformsPage.rowNum;
    eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(myEformsPage.rowNum);

  });
  it('should create eform simultaneously with creating 2 tags', function () {
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString(), Guid.create().toString()];
    myEformsPage.createNewEform(newEformLabel, [createdTags]);
    arrayNamesTag = [...arrayNamesTag, ...createdTags];
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.tags.length).equal(createdTags.length);
    expect(tagsTexts).to.include.members(createdTags);
    const countBeforeDelete = myEformsPage.rowNum;
    eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(myEformsPage.rowNum);
  });
  it('should create eform with creating 1 tag and using 1 already prepared tag', function () {
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString()];
    const tagAddedNum = 1;
    const addedAndSelectedTags = myEformsPage.createNewEform(newEformLabel, [createdTags], tagAddedNum);
    arrayNamesTag = [...arrayNamesTag, ...createdTags];
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.tags.length).equal(createdTags.length + tagAddedNum);
    expect(tagsTexts).to.include.members(createdTags);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    const countBeforeDelete = myEformsPage.rowNum;
    eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(myEformsPage.rowNum);
  });
  it('should create eform while adding 1 already prepared tag', function () {
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 1;
    const addedAndSelectedTags = myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.tags.length).equal(tagAddedNum);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    const countBeforeDelete = myEformsPage.rowNum;
    eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(myEformsPage.rowNum);
  });
  it('should create eform while adding more than 2 already prepared tags', function () {
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 2;
    const addedAndSelectedTags = myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.tags.length).equal(tagAddedNum);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    myEformsPage.removeTags(arrayNamesTag);
    const countBeforeDelete = myEformsPage.rowNum;
    eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(myEformsPage.rowNum);
  });
  it('should not create eform if xml is empty', function () {
    myEformsPage.newEformBtn.click();
    myEformsPage.createEformBtn.waitForDisplayed({timeout: 5000});
    expect(myEformsPage.createEformBtn.isEnabled()).equal(false);
  });
});
