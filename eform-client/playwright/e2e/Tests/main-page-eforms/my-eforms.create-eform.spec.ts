import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { Guid } from 'guid-typescript';

let arrayNamesTag = new Array<string>();
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.open('/');
  await loginPage.login();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('My eforms', () => {
  test('should create eform without any tags', async () => {
    const myEformsPage = new MyEformsPage(page);
    const newEformLabel = Guid.create().toString();
    await myEformsPage.createNewEform(newEformLabel);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).toBe(0);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    const newRowCount = await myEformsPage.rowNum();
    expect(+countBeforeDelete - 1).toBe(newRowCount);
  });

  test('should create eform simultaneously with creating 1 tag', async () => {
    const myEformsPage = new MyEformsPage(page);
    const newEformLabel = Guid.create().toString();
    const createdTag = Guid.create().toString();
    await myEformsPage.createNewEform(newEformLabel, [createdTag]);
    arrayNamesTag.push(createdTag);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).toBe(1);
    expect(await eform.tags[0].getText()).toBe(createdTag);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    const newRowCount = await myEformsPage.rowNum();
    expect(countBeforeDelete - 1).toBe(newRowCount);
  });

  test('should create eform simultaneously with creating 2 tags', async () => {
    const myEformsPage = new MyEformsPage(page);
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString(), Guid.create().toString()];
    await myEformsPage.createNewEform(newEformLabel, [createdTags]);
    arrayNamesTag = [...arrayNamesTag, ...createdTags];
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).toBe(createdTags.length);
    expect(tagsTexts).toEqual(expect.arrayContaining(createdTags));
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).toBe(await myEformsPage.rowNum());
  });

  test('should create eform with creating 1 tag and using 1 already prepared tag', async () => {
    const myEformsPage = new MyEformsPage(page);
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString()];
    const tagAddedNum = 1;
    const addedAndSelectedTags = await myEformsPage.createNewEform(newEformLabel, [createdTags], tagAddedNum);
    arrayNamesTag = [...arrayNamesTag, ...createdTags];
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).toBe(createdTags.length + tagAddedNum);
    expect(tagsTexts).toEqual(expect.arrayContaining(createdTags));
    expect(tagsTexts).toEqual(expect.arrayContaining(addedAndSelectedTags.selected));
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).toBe(await myEformsPage.rowNum());
  });

  test('should create eform while adding 1 already prepared tag', async () => {
    const myEformsPage = new MyEformsPage(page);
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 1;
    const addedAndSelectedTags = await myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).toBe(tagAddedNum);
    expect(tagsTexts).toEqual(expect.arrayContaining(addedAndSelectedTags.selected));
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).toBe(await myEformsPage.rowNum());
  });

  test('should create eform while adding more than 2 already prepared tags', async () => {
    const myEformsPage = new MyEformsPage(page);
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 2;
    const addedAndSelectedTags = await myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).toBe(tagAddedNum);
    expect(tagsTexts).toEqual(expect.arrayContaining(addedAndSelectedTags.selected));
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).toBe(await myEformsPage.rowNum());
    await myEformsPage.removeTags(arrayNamesTag);
  });

  test('should not create eform if xml is empty', async () => {
    const myEformsPage = new MyEformsPage(page);
    await (await myEformsPage.newEformBtn()).click();
    await (await myEformsPage.createEformBtn()).waitFor({ state: 'visible', timeout: 5000 });
    expect(await (await myEformsPage.createEformBtn()).isEnabled()).toBe(false);
  });
});
