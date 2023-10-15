import loginPage from '../../../Page objects/Login.page';
import backendConfigurationPropertiesPage, {
  PropertyCreateUpdate,
} from '../../../Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
import backendConfigurationPropertyWorkersPage from '../../../Page objects/BackendConfiguration/BackendConfigurationPropertyWorkers.page';

const expect = require('chai').expect;
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
const workerForCreate = {
  name: generateRandmString(),
  surname: generateRandmString(),
  language: 'Dansk',
  properties: [0],
};

describe('Backend Configuration Property - Bind Areas', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await backendConfigurationPropertiesPage.goToProperties();
    await backendConfigurationPropertiesPage.createProperty(property);
  });
  it('should bind all areas with one property', async () => {
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await backendConfigurationPropertyWorkersPage.create(workerForCreate);
    await backendConfigurationPropertiesPage.goToProperties();
    let createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    await createdProperty.bindOrUnbindWithAllAreas();
    createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
    const binds = await createdProperty.getBindAreas();
    for (let i = 0; i < binds.length; i++) {
      expect(await binds[i], `area ${i} is not bind`).eq(true);
    }
    await createdProperty.closeBindPropertyWithAreasModal(true);
  });
  // it('should unbind some areas from one property', async () => {
  //   const mas = [3, 5, 8, 12];
  //   const createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
  //   await createdProperty.editBindWithAreas(mas);
  //   const binds = await createdProperty.getBindAreas();
  //   for (let i = 0; i < binds.length; i++) {
  //     if (mas.some((x) => x !== i)) {
  //       expect(await binds[i], `area ${i} is not bind`).eq(true);
  //     } else {
  //       expect(await binds[i], `area ${i} is not unbind`).eq(false);
  //     }
  //   }
  // });
  // it('should cancel edit areas in property', async () => {
  //   const mas = [3, 5, 8, 12];
  //   const createdProperty = await backendConfigurationPropertiesPage.getLastPropertyRowObject();
  //   await createdProperty.editBindWithAreas(mas, true);
  //   const binds = await createdProperty.getBindAreas();
  //   for (let i = 0; i < binds.length; i++) {
  //     if (mas.some((x) => x !== i)) {
  //       expect(await binds[i], `area ${i} is unbind`).eq(true);
  //     } else {
  //       expect(await binds[i], `area ${i} is bind`).eq(false);
  //     }
  //   }
  // });
  after(async () => {
    await backendConfigurationPropertiesPage.clearTable();
    await backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    await browser.pause(500);
    await backendConfigurationPropertyWorkersPage.clearTable();
  });
});
