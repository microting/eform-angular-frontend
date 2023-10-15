import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Backend Configuration Property - Delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
  });
  it('should create and delete property', async () => {
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
    await (
      await backendConfigurationPropertiesPage.getLastPropertyRowObject()
    ).delete();
    expect(rowNumBeforeCreate, 'Property not deleted').eq(
      await backendConfigurationPropertiesPage.rowNum()
    );
  });
});
