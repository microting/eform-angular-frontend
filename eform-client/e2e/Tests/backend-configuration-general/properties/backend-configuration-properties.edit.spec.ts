import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Backend Configuration Property - Edit', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
  });
  it('should edit all fields property', async () => {
    const rowNumBeforeCreate = await backendConfigurationPropertiesPage.rowNum();
    const propertyCreate: PropertyCreateUpdate = {
      name: generateRandmString(),
      chrNumber: generateRandmString(),
      address: generateRandmString(),
      cvrNumber: '1111111',
      // selectedLanguages: [
      //   { languageId: 1, languageName: 'Dansk' },
      //   { languageId: 2, languageName: 'Engelsk' },
      //   // { languageId: 3, languageName: 'German' },
      // ],
    };
    const propertyUpdate: PropertyCreateUpdate = {
      name: generateRandmString(),
      chrNumber: generateRandmString(),
      address: generateRandmString(),
      // selectedLanguages: [
      //   { languageId: 1, languageName: 'Dansk' },
      //   { languageId: 2, languageName: 'English' },
      //   // { languageId: 3, languageName: 'German' },
      // ],
    };
    await backendConfigurationPropertiesPage.createProperty(propertyCreate);
    expect(rowNumBeforeCreate + 1, 'Property not created').eq(
      await backendConfigurationPropertiesPage.rowNum()
    );
    const createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await createdProperty.edit(propertyUpdate);
    // propertyUpdate.selectedLanguages = [
    //   { languageId: 1, languageName: 'Dansk' },
    // ];
    const updatedProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    expect(updatedProperty.name, 'name is incorrect').eq(propertyUpdate.name);
    expect(updatedProperty.chrNumber, 'chrNumber is incorrect').eq(
      propertyUpdate.chrNumber
    );
    expect(updatedProperty.address, 'address is incorrect').eq(
      propertyUpdate.address
    );
    // expect(updatedProperty.languages, 'languages is incorrect').deep.eq(
    //   propertyUpdate.selectedLanguages
    // );
  });
  it('should not edit all fields property because click cancel', async () => {
    const rowNumBeforeCreate = await backendConfigurationPropertiesPage.rowNum();
    const propertyCreate: PropertyCreateUpdate = {
      name: generateRandmString(),
      chrNumber: generateRandmString(),
      address: generateRandmString(),
      cvrNumber: '1111111',
      // selectedLanguages: [
      //   { languageId: 1, languageName: 'Dansk' },
      //   { languageId: 2, languageName: 'Engelsk' },
      //   // { languageId: 3, languageName: 'German' },
      // ],
    };
    await backendConfigurationPropertiesPage.createProperty(propertyCreate);
    expect(rowNumBeforeCreate + 1, 'Property not created').eq(
      await backendConfigurationPropertiesPage.rowNum()
    );
    const createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await createdProperty.edit(
      {
        name: generateRandmString(),
        chrNumber: generateRandmString(),
        address: generateRandmString(),
        // selectedLanguages: [
        //   { languageId: 1, languageName: 'Dansk' },
        //   { languageId: 2, languageName: 'English' },
        //   // { languageId: 3, languageName: 'German' },
        // ],
      },
      true
    );
    const updatedProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    expect(updatedProperty.name, 'name is incorrect').eq(createdProperty.name);
    expect(updatedProperty.chrNumber, 'chrNumber is incorrect').eq(
      createdProperty.chrNumber
    );
    expect(updatedProperty.address, 'address is incorrect').eq(
      createdProperty.address
    );
    // expect(updatedProperty.languages, 'languages is incorrect').deep.eq(
    //   createdProperty.languages
    // );
  });
  afterEach(async () => {
    await backendConfigurationPropertiesPage.clearTable();
  });
});
