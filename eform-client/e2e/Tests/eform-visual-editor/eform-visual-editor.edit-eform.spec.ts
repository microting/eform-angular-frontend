import loginPage from '../../Page objects/Login.page';
import eformVisualEditorPage, {
  ChecklistFieldObj,
  MainChecklistObj,
  MainCheckListRowObj,
} from '../../Page objects/EformVisualEditor.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import { EformFieldTypesEnum } from '../../../src/app/common/const';
import myEformsPage from '../../Page objects/MyEforms.page';
import { afterEach, beforeEach } from 'mocha';

const expect = require('chai').expect;

describe('Visual editor page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  beforeEach(function () {
    eformVisualEditorPage.goToVisualEditor();
  });
  it('should edit created visual template', function () {
    const checklist: MainChecklistObj = {
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 1,
          id: null,
        },
      ],
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
    eformVisualEditorPage.createVisualTemplate(checklist, true);
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    let mainChecklist = new MainCheckListRowObj();
    const checklistObjForEdit: MainChecklistObj = {
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
      mandatory: false,
    };
    eformVisualEditorPage.openAllLanguages();
    eformVisualEditorPage.createVisualTemplateField(newField);
    mainChecklist.edit(checklistObjForEdit);
    mainChecklist = new MainCheckListRowObj();
    mainChecklist.fields[1].makeCopy();
    mainChecklist.fields[1].changePosition(mainChecklist.fields[0]);
    mainChecklist = new MainCheckListRowObj();
    mainChecklist.fields[1].edit({ type: EformFieldTypesEnum.None });
    mainChecklist.fields[1].changeColor('grey');
    checklistObjForEdit.fields = [
      newField,
      { ...checklist.fields[0], type: EformFieldTypesEnum.None },
      newField,
    ];
    eformVisualEditorPage.clickSave();
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    mainChecklist = new MainCheckListRowObj(true);
    eformVisualEditorPage.openAllLanguages();
    for (let i = 0; i < eformVisualEditorPage.selectedLanguages.length; i++) {
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
    expect(
      mainChecklist.fields[1].color.description,
      `field[1] color not valid`
    ).eq('Grey');
  });
  afterEach(function () {
    // delete created checklist
    myEformsPage.Navbar.goToMyEForms();
    myEformsPage.clearEFormTable();
  });
});
