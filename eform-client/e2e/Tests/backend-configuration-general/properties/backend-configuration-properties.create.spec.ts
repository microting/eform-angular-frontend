import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Backend Configuration Property - Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
  });
  it('should create property with all fields', async () => {
    const rowNumBeforeCreate = await backendConfigurationPropertiesPage.rowNum();
    const property: PropertyCreateUpdate = {
      name: generateRandmString(),
      chrNumber: generateRandmString(),
      address: generateRandmString(),
      cvrNumber: '1111111',
      // selectedLanguages: [
      //   { languageId: 1, languageName: 'Dansk' },
      //   { languageId: 2, languageName: 'Engelsk' },
      // ],
    };
    await backendConfigurationPropertiesPage.createProperty(property);
    expect(rowNumBeforeCreate + 1, 'Property not created').eq(
      await backendConfigurationPropertiesPage.rowNum()
    );
    const createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    expect(createdProperty.name, 'name is incorrect').eq(property.name);
    expect(createdProperty.chrNumber, 'chrNumber is incorrect').eq(
      property.chrNumber
    );
    expect(createdProperty.address, 'address is incorrect').eq(
      property.address
    );
    // expect(createdProperty.languages, 'languages is incorrect').deep.eq(
    //   property.selectedLanguages
    // );
  });
  it('should create property with only name' /* and selected one language*/, async () => {
    const rowNumBeforeCreate = await backendConfigurationPropertiesPage.rowNum();
    const property: PropertyCreateUpdate = {
      cvrNumber: '1111111',
      name: generateRandmString(),
      // selectedLanguages: [{ languageId: 1, languageName: 'Dansk' }],
    };
    await backendConfigurationPropertiesPage.createProperty(property);
    expect(rowNumBeforeCreate + 1, 'property not created').eq(
      await backendConfigurationPropertiesPage.rowNum()
    );
    const createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    expect(createdProperty.name, 'name is incorrect').eq(property.name);
  });
  it('should not create property without name', async () => {
    const rowNumBeforeCreate = await backendConfigurationPropertiesPage.rowNum();
    const property: PropertyCreateUpdate = {
      cvrNumber: '1111111',
      chrNumber: generateRandmString(),
      address: generateRandmString(),
      // selectedLanguages: [
      //   { languageId: 1, languageName: 'Dansk' },
      //   { languageId: 2, languageName: 'Engelsk' },
      // ],
    };
    await backendConfigurationPropertiesPage.openCreatePropertyModal(property);
    expect(
      await (
        await backendConfigurationPropertiesPage.propertyCreateSaveBtn()
      ).isEnabled(),
      'save button is enabled'
    ).eq(false);
    await backendConfigurationPropertiesPage.closeCreatePropertyModal(true);
    expect(rowNumBeforeCreate, 'property created').eq(
      await backendConfigurationPropertiesPage.rowNum()
    );
  });
  afterEach(async () => {
    await backendConfigurationPropertiesPage.clearTable();
  });
});
