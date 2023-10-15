import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import {expect} from 'chai';
import {generateRandmString} from '../../../Helpers/helper-functions';
import
  backendConfigurationFilesPage, {BackendFileCreate}
  from '../../../Page objects/BackendConfiguration/BackendConfigurationFiles.page';

const property: PropertyCreateUpdate = {
  name: generateRandmString(),
  chrNumber: generateRandmString(),
  address: generateRandmString(),
  cvrNumber: '1111111',
};

describe('Backend Configuration Files Delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.createProperty(property);
    await backendConfigurationFilesPage.goToFiles();
    const testFile: BackendFileCreate = {
      files: ['test.pdf'],
      //propertiesForCreate: [`${property.cvrNumber} - ${property.chrNumber} - ${property.name}`],
      propertiesForCreate: [`${property.name}`],
      tags: [],
      propertyNamesForExpect: [],
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile);
    expect(rowNum + 1, 'file not created').eq(await backendConfigurationFilesPage.rowNum());
  });
  it('should not delete file', async () => {
    const rowNum = await backendConfigurationFilesPage.rowNum();
    const file = await backendConfigurationFilesPage.getLastFileRowObject();
    await file.delete(true);
    expect(rowNum, 'file deleted').eq(await backendConfigurationFilesPage.rowNum());
  });
  it('should delete file', async () => {
    const rowNum = await backendConfigurationFilesPage.rowNum();
    const file = await backendConfigurationFilesPage.getLastFileRowObject();
    await file.delete();
    expect(rowNum - 1, 'file not deleted').eq(await backendConfigurationFilesPage.rowNum());
  });
  after(async () => {
    await backendConfigurationFilesPage.goToFiles(); // if not on table page
    await backendConfigurationFilesPage.clearTable();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
  });
});
