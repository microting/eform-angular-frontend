import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import profileSettings from '../../Page objects/ProfileSettings.page';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;
const translationsEFormsPageEng: Array<{ key: string; value: string }> = [
  { key: 'eform-new-subheader h2', value: 'My eForms' },
  //{ key: '#newEFormBtn', value: 'NEW EFORM' },
  //{ key: '#idSort', value: 'ID\nexpand_less' },
  // { key: '#createdAtSort', value: 'Created at\nunfold_more' },
  // { key: '#nameEFormSort', value: 'eForm Name\nunfold_more' },
  // { key: '#tagsEForm', value: 'Tags' },
  // { key: '#pairingEForm', value: 'Pairing' },
  // { key: '#actionsEForm', value: 'Actions' },
];
const translationsEFormsPageGer: Array<{ key: string; value: string }> = [
  { key: 'eform-new-subheader h2', value: 'Meine eForms' },
  //{ key: '#newEFormBtn', value: 'NEUES EFORM' },
  //{ key: '#idSort', value: 'ID\nexpand_less' },
  // { key: '#createdAtSort', value: 'Hergestellt in\nunfold_more' },
  // { key: '#nameEFormSort', value: 'eForm-Name\nunfold_more' },
  // { key: '#tagsEForm', value: 'Stichworte' },
  // { key: '#pairingEForm', value: 'Paarung' },
  // { key: '#actionsEForm', value: 'Aktionen' },
];
const translationsEFormsPageDan: Array<{ key: string; value: string }> = [
  { key: 'eform-new-subheader h2', value: 'Mine eForms' },
  //{ key: '#newEFormBtn', value: 'NY EFORM' },
  //{ key: '#idSort', value: 'ID\nexpand_less' },
  // { key: '#createdAtSort', value: 'Oprettet d.\nunfold_more' },
  // { key: '#nameEFormSort', value: 'eForm Navn\nunfold_more' },
  // { key: '#tagsEForm', value: 'Tags' },
  // { key: '#pairingEForm', value: 'Parring' },
  // { key: '#actionsEForm', value: 'Handlinger' },
];
describe('Profile settings', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
  });
  it('should set language to English', async () => {
    await myEformsPage.Navbar.goToProfileSettings();
    await profileSettings.chooseLanguage('English');
    await profileSettings.saveProfileSettings();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await myEformsPage.Navbar.goToMyEForms();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    for (const translation of translationsEFormsPageEng) {
      expect(await (await $(translation.key)).getText()).eq(
        translation.value,
        `element with selector ${translation.key} must be = ${
          translation.value
        }, but element text = ${await (await $(translation.key)).getText()}.
      Language = English`
      );
    }
  });
  // it('should set language to German', async () => {
  //   await myEformsPage.Navbar.goToProfileSettings();
  //   await profileSettings.chooseLanguage('German');
  //   await profileSettings.saveProfileSettings();
  //   await myEformsPage.Navbar.goToMyEForms();
  //   for (const translation of translationsEFormsPageGer) {
  //     expect((await $(translation.key)).getText()).eq(
  //       translation.value,
  //       `element with selector ${translation.key} must be = ${
  //         translation.value
  //       }, but element text = ${(await $(translation.key)).getText()}.
  //     Language = German`
  //     );
  //   }
  // });
  it('should set language to Dansk', async () => {
    await myEformsPage.Navbar.goToProfileSettings();
    await profileSettings.chooseLanguage('Dansk');
    await profileSettings.saveProfileSettings();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await myEformsPage.Navbar.goToMyEForms();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    for (const translation of translationsEFormsPageDan) {
      expect(await (await $(translation.key)).getText()).eq(
        translation.value,
        `element with selector ${translation.key} must be = ${
          translation.value
        }, but element text = ${await (await $(translation.key)).getText()}.
      Language = Dansk`
      );
    }
  });
});
