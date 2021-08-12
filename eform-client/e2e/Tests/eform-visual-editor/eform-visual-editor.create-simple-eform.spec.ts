import loginPage from '../../Page objects/Login.page';
import eformVisualEditorPage, {
  ChecklistFieldObj,
  ChecklistObj,
  MainCheckListRowObj,
} from '../../Page objects/EformVisualEditor.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import {
  applicationLanguages,
  EformFieldTypesEnum,
} from '../../../src/app/common/const';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
const checklist: ChecklistObj = {
  translations: [
    {
      name: generateRandmString(),
      description: generateRandmString(),
      languageId: 1,
      id: null,
    },
  ],
  tags: [],
  fields: [
    {
      type: EformFieldTypesEnum.None,
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 1,
          id: null,
        },
      ],
      mandatory: false,
    },
  ],
};

describe('Visual editor page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    eformVisualEditorPage.goToVisualEditor();
  });
  it('should create visual template', function () {
    eformVisualEditorPage.createVisualTemplate(checklist, true);
    const eform = myEformsPage.getLastMyEformsRowObj();

    expect(eform.eFormName, 'name in table eforms not valid').eq(
      checklist.translations[0].name
    );
    eform.goToVisualEditor();
    const mainChecklist = new MainCheckListRowObj();
    expect(
      mainChecklist.translations[0].name,
      'name main checklist not valid'
    ).eq(checklist.translations[0].name);
    expect(
      mainChecklist.translations[0].description,
      'description main checklist not valid'
    ).eq(checklist.translations[0].description);
    expect(mainChecklist.fields[0].name, 'field name not valid').eq(
      checklist.fields[0].translations[0].name
    );
    expect(mainChecklist.fields[0].type, 'field type not valid').eq(
      checklist.fields[0].type
    );
  });
  it('should edit created visual template', function () {
    let mainChecklist = new MainCheckListRowObj();
    const checklistObjForEdit: ChecklistObj = {
      ...checklist,
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 1,
          id: null,
        },
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 2,
          id: null,
        },
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 3,
          id: null,
        },
      ],
      fields: [],
    };
    const newField: ChecklistFieldObj = {
      type: EformFieldTypesEnum.Comment,
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 1,
          id: null,
        },
      ],
      mandatory: false,
    };
    eformVisualEditorPage.createVisualTemplateField(newField);
    mainChecklist.edit(checklistObjForEdit, true);
    checklistObjForEdit.fields = [...checklist.fields, newField];
    const eform = myEformsPage.getLastMyEformsRowObj();
    expect(eform.eFormName, 'name in table eforms not valid').eq(
      checklistObjForEdit.translations[0].name
    );
    eform.goToVisualEditor();
    mainChecklist = new MainCheckListRowObj(true);
    for (let i = 0; i < applicationLanguages.length; i++) {
      expect(
        mainChecklist.translations[i].name,
        `name[${i}] main checklist not valid`
      ).eq(checklistObjForEdit.translations[i].name);
      expect(
        mainChecklist.translations[i].description,
        `description[${i}] main checklist not valid`
      ).eq(checklistObjForEdit.translations[i].description);
    }
    for (let i = 0; i < checklistObjForEdit.fields.length; i++) {
      expect(mainChecklist.fields[i].name, `field[${i}] name not valid`).eq(
        checklistObjForEdit.fields[i].translations[0].name
      );
      expect(mainChecklist.fields[i].type, `field[${i}] type not valid`).eq(
        checklistObjForEdit.fields[i].type
      );
    }
  });
  after(function () {
    // delete created checklist
    myEformsPage.Navbar.goToMyEForms();
    myEformsPage.getLastMyEformsRowObj().deleteEForm();
  });
});
