import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import profileSettings from '../../Page objects/ProfileSettings.page';

const expect = require('chai').expect;
const translationsEFormsPageEng: Array<{ key: string; value: string }> = [
  { key: 'eform-subheader h1', value: 'My eForms' },
  { key: '#newEFormBtn', value: 'NEW EFORM' },
  { key: '#idSort', value: 'ID\nexpand_less' },
  { key: '#createdAtSort', value: 'Created at\nunfold_more' },
  { key: '#nameEFormSort', value: 'eForm Name\nunfold_more' },
  { key: '#tagsEForm', value: 'Tags' },
  { key: '#pairingEForm', value: 'Pairing' },
  { key: '#actionsEForm', value: 'Actions' },
];
const translationsEFormsPageGer: Array<{ key: string; value: string }> = [
  { key: 'eform-subheader h1', value: 'Meine eForms' },
  { key: '#newEFormBtn', value: 'NEUES EFORM' },
  { key: '#idSort', value: 'ID\nexpand_less' },
  { key: '#createdAtSort', value: 'Hergestellt in\nunfold_more' },
  { key: '#nameEFormSort', value: 'eForm-Name\nunfold_more' },
  { key: '#tagsEForm', value: 'Stichworte' },
  { key: '#pairingEForm', value: 'Paarung' },
  { key: '#actionsEForm', value: 'Aktionen' },
];
const translationsEFormsPageDan: Array<{ key: string; value: string }> = [
  { key: 'eform-subheader h1', value: 'Mine eForms' },
  { key: '#newEFormBtn', value: 'NY EFORM' },
  { key: '#idSort', value: 'ID\nexpand_less' },
  { key: '#createdAtSort', value: 'Oprettet d.\nunfold_more' },
  { key: '#nameEFormSort', value: 'eForm Navn\nunfold_more' },
  { key: '#tagsEForm', value: 'Tags' },
  { key: '#pairingEForm', value: 'Parring' },
  { key: '#actionsEForm', value: 'Handlinger' },
];
describe('Profile settings', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
  });
  it('should set language to English', async () => {
    myEformsPage.Navbar.goToProfileSettings();
    profileSettings.chooseLanguage('English');
    profileSettings.saveProfileSettings();
    myEformsPage.Navbar.goToMyEForms();
    translationsEFormsPageEng.forEach((translation) =>
      expect($(translation.key).getText()).eq(
        translation.value,
        `element with selector ${translation.key} must be = ${
          translation.value
        }, but element text = ${$(translation.key).getText()}.
      Language = English`
      )
    );
  });
  it('should set language to German', async () => {
    myEformsPage.Navbar.goToProfileSettings();
    profileSettings.chooseLanguage('German');
    profileSettings.saveProfileSettings();
    myEformsPage.Navbar.goToMyEForms();
    translationsEFormsPageGer.forEach((translation) =>
      expect($(translation.key).getText()).eq(
        translation.value,
        `element with selector ${translation.key} must be = ${
          translation.value
        }, but element text = ${$(translation.key).getText()}.
      Language = German`
      )
    );
  });
  it('should set language to Danish', async () => {
    myEformsPage.Navbar.goToProfileSettings();
    profileSettings.chooseLanguage('Danish');
    profileSettings.saveProfileSettings();
    myEformsPage.Navbar.goToMyEForms();
    translationsEFormsPageDan.forEach((translation) =>
      expect($(translation.key).getText()).eq(
        translation.value,
        `element with selector ${translation.key} must be = ${
          translation.value
        }, but element text = ${$(translation.key).getText()}.
      Language = Danish`
      )
    );
  });
});
