import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import {expect} from 'chai';
import {generateRandmString} from '../../../Helpers/helper-functions';
import
  backendConfigurationFilesPage, {BackendFileCreate}
  from '../../../Page objects/BackendConfiguration/BackendConfigurationFiles.page';

const properties: PropertyCreateUpdate[] = [
  {
    name: generateRandmString(5),
    chrNumber: generateRandmString(5),
    address: generateRandmString(5),
    cvrNumber: '1111111',
  },
  {
    name: generateRandmString(5),
    chrNumber: generateRandmString(5),
    address: generateRandmString(5),
    cvrNumber: '1111111',
  },
];
const tags: string[] = [
  generateRandmString(5),
  generateRandmString(5),
]

describe('Backend Configuration Files Create', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.createProperty(properties[0]);
    await backendConfigurationPropertiesPage.createProperty(properties[1]);
    await backendConfigurationFilesPage.goToFiles();
    await backendConfigurationFilesPage.createNewTags(tags);
  });
  it('should not create file', async () => {
    const testFile: BackendFileCreate = {
      files: ['test.pdf'],
      //propertiesForCreate: [`${properties[0].cvrNumber} - ${properties[0].chrNumber} - ${properties[0].name}`],
      propertiesForCreate: [`${properties[0].name}`],
      tags: [],
      propertyNamesForExpect: [],
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile, true);
    expect(rowNum, 'file created').eq(await backendConfigurationFilesPage.rowNum());
  });
  it('should create 1 file with 1 tag and 1 property', async () => {
    const testFile: BackendFileCreate = {
      files: ['test.pdf'],
      //propertiesForCreate: [`${properties[0].cvrNumber} - ${properties[0].chrNumber} - ${properties[0].name}`],
      propertiesForCreate: [`${properties[0].name}`],
      tags: [tags[0]],
      propertyNamesForExpect: [properties[0].name],
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile);
    expect(rowNum + 1).eq(await backendConfigurationFilesPage.rowNum());
    const file = await backendConfigurationFilesPage.getLastFileRowObject();
    expect(file.fileName, 'filename not equal').eq(testFile.files[0]);
    expect(file.properties.length, 'count properties not equal').eq(testFile.propertyNamesForExpect.length);
    expect(file.properties[0], 'property name not equal').eq(testFile.propertyNamesForExpect[0]);
    expect(file.tags.length, 'count tags not equal').eq(testFile.tags.length);
    expect(file.tags[0], 'tags not equal').eq(testFile.tags[0]);
  });
  it('should create 1 file with 2 tag and 2 property', async () => {
    const testFile: BackendFileCreate = {
      files: ['test.pdf'],
      //propertiesForCreate: properties.map(x => `${x.cvrNumber} - ${x.chrNumber} - ${x.name}`),
      propertiesForCreate: properties.map(x => `${x.name}`),
      tags: tags,
      propertyNamesForExpect: properties.map(x => x.name),
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile);
    expect(rowNum + 1).eq(await backendConfigurationFilesPage.rowNum());
    const file = await backendConfigurationFilesPage.getLastFileRowObject();
    expect(file.fileName, 'filename not equal').eq(testFile.files[0]);
    expect(file.properties.length, 'count properties not equal').eq(testFile.propertyNamesForExpect.length);
    expect(file.properties.sort(), 'property names not equal').deep.eq(testFile.propertyNamesForExpect.sort());
    expect(file.tags.length, 'count tags not equal').eq(testFile.tags.length);
    expect(file.tags.sort(), 'tags not equal').deep.eq(testFile.tags.sort());
  });
  it('should create 2 file with 0 tag and 2 property ', async () => {
    const testFile: BackendFileCreate = {
      files: ['attachment-english.pdf', 'test.pdf'],
      //propertiesForCreate: properties.map(x => `${x.cvrNumber} - ${x.chrNumber} - ${x.name}`),
      propertiesForCreate: properties.map(x => `${x.name}`),
      tags: [],
      propertyNamesForExpect: properties.map(x => x.name),
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile);
    expect(rowNum + 2).eq(await backendConfigurationFilesPage.rowNum());
    const files = await backendConfigurationFilesPage.getFilesRowObjectByIndexes([1, 2]);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      expect(file.fileName, 'filename not equal').eq(testFile.files[i]);
      expect(file.properties.length, 'count properties not equal').eq(testFile.propertyNamesForExpect.length);
      expect(file.properties.sort(), `property names not equal`).deep.eq(testFile.propertyNamesForExpect.sort());
      expect(file.tags.length, 'count tags not equal').eq(testFile.tags.length);
    }
  });
  it('should create 2 file with 1 tag and 1 property', async () => {
    const testFile: BackendFileCreate = {
      files: ['attachment-english.pdf', 'test.pdf'],
      //propertiesForCreate: [`${properties[0].cvrNumber} - ${properties[0].chrNumber} - ${properties[0].name}`],
      propertiesForCreate: [`${properties[0].name}`],
      tags: [tags[0]],
      propertyNamesForExpect: [properties[0].name],
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile);
    expect(rowNum + 2).eq(await backendConfigurationFilesPage.rowNum());
    const files = await backendConfigurationFilesPage.getFilesRowObjectByIndexes([1, 2]);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      expect(file.fileName, 'filename not equal').eq(testFile.files[i]);
      expect(file.properties.length, 'count properties not equal').eq(testFile.propertyNamesForExpect.length);
      expect(file.properties[0], 'property name not equal').eq(testFile.propertyNamesForExpect[0]);
      expect(file.tags.length, 'count tags not equal').eq(testFile.tags.length);
      expect(file.tags[0]).eq(testFile.tags[0]);
    }
  });
  afterEach(async () => {
    await backendConfigurationFilesPage.goToFiles(); // if not on table page
    await backendConfigurationFilesPage.clearTable();
  })
  after(async () => {
    await backendConfigurationFilesPage.removeTags(tags);
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.clearTable();
  });
});
