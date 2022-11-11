import loginPage from '../../Page objects/Login.page';
import eformVisualEditorPage, {
  ChecklistFieldObj,
  MainChecklistObj,
  MainCheckListRowObj,
} from '../../Page objects/EformVisualEditor.page';
import {
  generateRandmString,
  getRandomInt,
} from '../../Helpers/helper-functions';
import { EformFieldTypesEnum } from '../../../src/app/common/const';
import myEformsPage from '../../Page objects/MyEforms.page';
import { afterEach, beforeEach } from 'mocha';

const expect = require('chai').expect;

describe('Visual editor page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
  });
  beforeEach(async () => {
    await eformVisualEditorPage.goToVisualEditor();
  });
  it('should edit created visual template', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(checklist, true);
    await browser.pause(500);
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await browser.pause(500);
    let mainChecklist = new MainCheckListRowObj();
    await mainChecklist.getAllFields();
    const checklistObjForEdit: MainChecklistObj = {
      ...checklist,
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 1,
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
      ],
      mandatory: false,
    };
    await eformVisualEditorPage.openAllLanguages();
    console.log('visual editor page opened');
    await eformVisualEditorPage.createVisualTemplateField(newField);
    await mainChecklist.edit(checklistObjForEdit);
    mainChecklist = new MainCheckListRowObj();
    await mainChecklist.getAllFields();
    await mainChecklist.fields[1].makeCopy();
    await mainChecklist.fields[1].changePosition(mainChecklist.fields[0]);
    mainChecklist = new MainCheckListRowObj();
    await mainChecklist.getAllFields();
    await mainChecklist.fields[1].edit({ type: EformFieldTypesEnum.None });
    await mainChecklist.fields[1].changeColor('grey');
    checklistObjForEdit.fields = [
      newField,
      { ...checklist.fields[0], type: EformFieldTypesEnum.None },
      newField,
    ];
    await eformVisualEditorPage.clickSave();
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    mainChecklist = new MainCheckListRowObj();
    await mainChecklist.openAllLanguages();
    await mainChecklist.getAllFields();
    await eformVisualEditorPage.openAllLanguages();
    for (let i = 0; i < (await eformVisualEditorPage.selectedLanguages()).length; i++) {
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
  it('should edit created visual template (nested checklist)', async () => {
    const checklist: MainChecklistObj = {
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 1,
          id: null,
        },
      ],
      checklists: [
        {
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
            },
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
        },
        {
          translations: [
            {
              name: generateRandmString(),
              description: generateRandmString(),
              languageId: 1,
              id: null,
            },
          ],
        },
      ],
    };
    await eformVisualEditorPage.createVisualTemplate(checklist, true);
    await browser.pause(500);
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await browser.pause(500);
    let mainChecklist = new MainCheckListRowObj();
    await mainChecklist.getAllFields();
    await browser.pause(500);
    checklist.checklists[1].translations = [
      {
        name: generateRandmString(),
        description: generateRandmString(),
        languageId: 1,
        id: null,
      },
    ];
    await mainChecklist.checklists[1].edit(checklist.checklists[1].translations);
    await browser.pause(500);
    await mainChecklist.checklists[0].fields[0].makeCopy();
    await browser.pause(500);
    await mainChecklist.checklists[0].fields[0].changeColor('grey');
    await browser.pause(500);
    mainChecklist = new MainCheckListRowObj();
    await mainChecklist.getAllFields();
    await browser.pause(500);
    await mainChecklist.checklists[0].fields[1].changePosition(
      mainChecklist.checklists[0].fields[0]
    );
    await browser.pause(500);
    checklist.checklists[0].fields = [
      checklist.checklists[0].fields[1],
      {
        ...checklist.checklists[0].fields[0],
        type: EformFieldTypesEnum.Number,
        maxValue: getRandomInt(100, 200),
        minValue: getRandomInt(-100, 100),
        defaultValue: getRandomInt(-1, 1),
      },
      checklist.checklists[0].fields[0],
    ];
    mainChecklist = new MainCheckListRowObj();
    await mainChecklist.getAllFields();
    await browser.pause(500);
    await mainChecklist.checklists[0].fields[1].edit({
      type: checklist.checklists[0].fields[1].type,
      maxValue: checklist.checklists[0].fields[1].maxValue,
      minValue: checklist.checklists[0].fields[1].minValue,
      defaultValue: checklist.checklists[0].fields[1].defaultValue,
    });
    await browser.pause(500);
    await eformVisualEditorPage.clickSave();
    await browser.pause(500);
    const bla = await myEformsPage.getLastMyEformsRowObj();
    await bla.goToVisualEditor();
    await browser.pause(500);
    mainChecklist = new MainCheckListRowObj();
    await mainChecklist.getAllFields();
    await browser.pause(500);

    for (let i = 0; i < checklist.checklists[0].fields.length; i++) {
      expect(
        mainChecklist.checklists[0].fields[i].name,
        `field[${i}] name not valid`
      ).eq(checklist.checklists[0].fields[i].translations[0].name);
      expect(
        mainChecklist.checklists[0].fields[i].type,
        `field[${i}] type not valid`
      ).eq(checklist.checklists[0].fields[i].type);
    }
    expect(
      mainChecklist.checklists[0].fields[1].color.description,
      `field[1] color not valid`
    ).eq('Grey');
    // todo need open and check number field

    expect(
      mainChecklist.checklists[1].translations[0].name,
      `checklists[1] name not valid`
    ).eq(checklist.checklists[1].translations[0].name);
    expect(
      mainChecklist.checklists[1].translations[0].description,
      `checklists[1] description not valid`
    ).eq(checklist.checklists[1].translations[0].description);
  });
  afterEach(async () => {
    await myEformsPage.Navbar.goToMyEForms();
    await myEformsPage.clearEFormTable();
  });
});
