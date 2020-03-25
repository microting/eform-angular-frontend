import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;
describe('My eforms', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should create eform without any tags', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    const newEformLabel = Guid.create().toString();
    myEformsPage.createNewEform(newEformLabel);
    let eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.eFormName).equal(newEformLabel);
    expect(eform.tags.length).equal(0);
    eform.deleteBtn.click();
    // browser.pause(10000);
    $('#eFormDeleteDeleteBtn').waitForDisplayed(20000);
    $$('.btn-danger')[2].click();
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);
  });
  it('should create eform simultaneously with creating 1 tag', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    const newEformLabel = Guid.create().toString();
    const createdTag = Guid.create().toString();
    myEformsPage.createNewEform(newEformLabel, [createdTag]);
    let eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.eFormName).equal(newEformLabel);
    expect(eform.tags.length).equal(1);
    expect(eform.tags[0].getText()).equal(createdTag);
    eform.deleteBtn.click();
    $('#eFormDeleteDeleteBtn').waitForDisplayed(20000);
    $$('.btn-danger')[2].click();
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);

  });
  it('should create eform simultaneously with creating 2 tags', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString(), Guid.create().toString()];
    const addedAndSelectedTags = myEformsPage.createNewEform(newEformLabel, createdTags);
    let eform = myEformsPage.getFirstMyEformsRowObj();
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.eFormName).equal(newEformLabel);
    expect(eform.tags.length).equal(createdTags.length);
    expect(tagsTexts).to.include.members(createdTags);
    eform.deleteBtn.click();
    $('#eFormDeleteDeleteBtn').waitForDisplayed(20000);
    // browser.pause(7000);
    $$('.btn-danger')[2].click();
    browser.pause(7000);
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);
  });
  it('should create eform with creating 1 tag and using 1 already prepared tag', function () {
    loginPage.open('/');
    $('#spinner-animation').waitForDisplayed(90000, true);
    let eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString()];
    const tagAddedNum = 1;
    const addedAndSelectedTags = myEformsPage.createNewEform(newEformLabel, createdTags, tagAddedNum);
    eform = myEformsPage.getFirstMyEformsRowObj();
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.eFormName).equal(newEformLabel);
    expect(eform.tags.length).equal(createdTags.length + tagAddedNum);
    expect(tagsTexts).to.include.members(createdTags);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    eform.deleteBtn.click();
    $('#eFormDeleteDeleteBtn').waitForDisplayed(20000);
    // browser.pause(7000);
    $$('.btn-danger')[2].click();
    browser.pause(7000);
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);
  });
  it('should create eform while adding 1 already prepared tag', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 1;
    const addedAndSelectedTags = myEformsPage.createNewEform(newEformLabel, undefined, tagAddedNum);
    let eform = myEformsPage.getFirstMyEformsRowObj();
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.eFormName).equal(newEformLabel);
    expect(eform.tags.length).equal(tagAddedNum);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    eform.deleteBtn.click();
    $('#eFormDeleteDeleteBtn').waitForDisplayed(20000);
    // browser.pause(7000);
    $$('.btn-danger')[2].click();
    browser.pause(7000);
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);
  });
  it('should create eform while adding more than 2 already prepared tags', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 2;
    const addedAndSelectedTags = myEformsPage.createNewEform(newEformLabel, undefined, tagAddedNum);
    let eform = myEformsPage.getFirstMyEformsRowObj();
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    expect(eform.eFormName).equal(newEformLabel);
    expect(eform.tags.length).equal(tagAddedNum);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    eform.deleteBtn.click();
    $('#eFormDeleteDeleteBtn').waitForDisplayed(20000);
    // browser.pause(10000);
    $$('.btn-danger')[2].click();
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);
  });
  it('should not create eform if xml is empty', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    myEformsPage.newEformBtn.click();
    browser.pause(5000);
    expect(myEformsPage.createEformBtn.isEnabled()).equal(false);
  });
});
