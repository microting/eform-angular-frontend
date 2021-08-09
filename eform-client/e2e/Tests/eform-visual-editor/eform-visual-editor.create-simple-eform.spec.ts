import loginPage from '../../Page objects/Login.page';
import eformVisualEditorPage, {
  ChecklistObj,
} from '../../Page objects/EformVisualEditor.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import { EformFieldTypesEnum } from '../../../src/app/common/const';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
const checklist: ChecklistObj = {
  translations: [
    {
      name: generateRandmString(),
      description: generateRandmString(),
      languageId: 0,
      id: 0,
    },
  ],
  fields: [
    {
      type: EformFieldTypesEnum.None,
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 0,
          id: 0,
        },
      ],
      mandatory: false,
    },
  ],
  tags: [],
};

describe('Device users page should add new device user', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    eformVisualEditorPage.goToVisualEditor();
  });
  it('should create visual template', function () {
    eformVisualEditorPage.createVisualTemplate(checklist, true);
    const eform = myEformsPage.getFirstMyEformsRowObj();

    expect(eform.eFormName).eq(checklist.translations[0].name);
    // eform.goToVisualEditor();
  });
});
