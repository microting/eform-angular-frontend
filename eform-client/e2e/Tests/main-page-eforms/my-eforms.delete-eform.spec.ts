import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;
describe('Main Page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
  });
  it('should create eform', async () => {
    await (await myEformsPage.idSortBtn()).click();
    const rowCountBeforeCreation = await myEformsPage.rowNum();
    const newEformLabel = Guid.create().toString();
    await myEformsPage.createNewEform(newEformLabel);
    const eform = await myEformsPage.getFirstMyEformsRowObj();
    expect(eform.eFormName).equal(newEformLabel);
    const rowCountAfterCreation = await myEformsPage.rowNum();
    expect(rowCountBeforeCreation + 1).eq(rowCountAfterCreation);
  });
  it('should delete existing eform', async () => {
    const rowCountBeforeDelete = await myEformsPage.rowNum();
    const eform = await myEformsPage.getFirstMyEformsRowObj();
    await eform.deleteEForm();
    await browser.pause(1000);
    const rowCountAfterDelete = await myEformsPage.rowNum();
    expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  });
});
