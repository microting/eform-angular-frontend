import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import {expect} from 'chai';
import {generateRandmString} from '../../../Helpers/helper-functions';
import
  backendConfigurationFilesPage, {BackendFileCreate, BackendFileEdit}
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
  generateRandmString(5),
  generateRandmString(5),
]

describe('Backend Configuration Files Edit', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    for (let i = 0; i < properties.length; i++) {
      await backendConfigurationPropertiesPage.createProperty(properties[i]);
    }
    await backendConfigurationFilesPage.goToFiles();
    await backendConfigurationFilesPage.createNewTags(tags);
  });
  it('should edit tags and name in file', async () => {
    const testFile: BackendFileCreate = {
      files: ['test.pdf'],
      propertiesForCreate: [
        //`${properties[0].cvrNumber} - ${properties[0].chrNumber} - ${properties[0].name}`,
        `${properties[0].name}`,
      ],
      tags: [tags[0], tags[1]],
      propertyNamesForExpect: [properties[0].name],
    }
    const changedFTestFile: BackendFileEdit = {
      fileName: generateRandmString(10),
      tags: [tags[2], tags[3]],
      propertiesForEdit: [],
      propertyNamesForExpect: [],
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile);
    expect(rowNum + 1).eq(await backendConfigurationFilesPage.rowNum());
    let file = await backendConfigurationFilesPage.getLastFileRowObject();
    await file.editFile(changedFTestFile);
    file = await backendConfigurationFilesPage.getLastFileRowObject();
    expect(file.fileName, 'filename not equal').eq(`${changedFTestFile.fileName}.pdf`);
    expect(file.tags.length, 'count tags not equal').eq(changedFTestFile.tags.length);
    expect(file.tags.sort(), 'tags not equal').deep.eq(changedFTestFile.tags.sort());
  });
  it('should edit properties in file', async () => {
    const testFile: BackendFileCreate = {
      files: ['test.pdf'],
      propertiesForCreate: [
        //`${properties[0].cvrNumber} - ${properties[0].chrNumber} - ${properties[0].name}`,
        `${properties[0].name}`,
        //`${properties[1].cvrNumber} - ${properties[1].chrNumber} - ${properties[1].name}`
        `${properties[1].name}`
      ],
      tags: null,
      propertyNamesForExpect: [properties[0].name, properties[1].name],
    }
    const changedFTestFile: BackendFileEdit = {
      fileName: null,
      tags: null,
      propertiesForEdit: [
        //`${properties[2].cvrNumber} - ${properties[2].chrNumber} - ${properties[2].name}`,
        `${properties[2].name}`,
        //`${properties[3].cvrNumber} - ${properties[3].chrNumber} - ${properties[3].name}`
        `${properties[3].name}`
      ],
      propertyNamesForExpect: [properties[2].name, properties[3].name],
    }
    const rowNum = await backendConfigurationFilesPage.rowNum();
    expect(rowNum, 'have some files').eq(0);
    await backendConfigurationFilesPage.createFile(testFile);
    // expect(rowNum + 1).eq(await backendConfigurationFilesPage.rowNum());
    let file = await backendConfigurationFilesPage.getLastFileRowObject();
    await file.editFile(changedFTestFile);
    file = await backendConfigurationFilesPage.getLastFileRowObject();
    expect(file.fileName, 'filename not equal').eq(testFile.files[0]);
    expect(file.properties.length, 'count properties not equal').eq(changedFTestFile.propertyNamesForExpect.length);
    expect(file.properties, 'property name not equal').deep.eq(changedFTestFile.propertyNamesForExpect);
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
