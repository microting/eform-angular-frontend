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
import XMLForEformFractions from '../../Constants/XMLForEformFractions';
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
  it('should not create visual template without any translations on main checklist', function () {
    const checklistWithoutTranslations = {
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
    eformVisualEditorPage.createVisualTemplate(checklistWithoutTranslations);
    expect(
      eformVisualEditorPage.saveCreateEformBtn.isEnabled(),
      'button "create" must be disabled'
    ).eq(false);
  });
  it('should create visual template without any fields', function () {
    const checklistWithoutFields = {
      translations: [
        {
          name: generateRandmString(),
          description: generateRandmString(),
          languageId: 1,
          id: null,
        },
      ],
    };
    eformVisualEditorPage.createVisualTemplate(checklistWithoutFields, true);
    const eform = myEformsPage.getLastMyEformsRowObj();
    expect(
      eform.eFormName,
      'name in table eforms not valid; template not create'
    ).eq(checklistWithoutFields.translations[0].name);
    eform.goToVisualEditor();
    const visualTemplate = new MainCheckListRowObj();
    expect(
      visualTemplate.translations[0].name,
      'name main checklist not valid'
    ).eq(checklistWithoutFields.translations[0].name);
    expect(
      visualTemplate.translations[0].description,
      'description main checklist not valid'
    ).eq(checklistWithoutFields.translations[0].description);
    expect(visualTemplate.fields.length, 'fields length not valid').eq(0);
  });
  it('should create visual template', function () {
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
    expect(
      mainChecklist.fields[0].color.description,
      'field color not valid'
    ).eq('Standard');
  });
  it('should create visual template with one pdfField', function () {
    const checklistWithPdfFile: MainChecklistObj = {
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
          type: EformFieldTypesEnum.ShowPdf,
          translations: [
            {
              name: generateRandmString(),
              description: generateRandmString(),
              languageId: 1,
              id: null,
            },
          ],
          mandatory: false,
          pathToFiles: [`${process.cwd()}/e2e/Assets/attachment-english.pdf`],
        },
      ],
    };
    eformVisualEditorPage.createVisualTemplate(checklistWithPdfFile, true);
    const eform = myEformsPage.getLastMyEformsRowObj();

    expect(eform.eFormName, 'name in table eforms not valid').eq(
      checklistWithPdfFile.translations[0].name
    );
    eform.goToVisualEditor();
    const mainChecklist = new MainCheckListRowObj();
    expect(
      mainChecklist.translations[0].name,
      'name main checklist not valid'
    ).eq(checklistWithPdfFile.translations[0].name);
    expect(
      mainChecklist.translations[0].description,
      'description main checklist not valid'
    ).eq(checklistWithPdfFile.translations[0].description);
    expect(mainChecklist.fields[0].name, 'field name not valid').eq(
      checklistWithPdfFile.fields[0].translations[0].name
    );
    expect(mainChecklist.fields[0].type, 'field type not valid').eq(
      checklistWithPdfFile.fields[0].type
    );
  });
  it('should create checklist with field non standard color', function () {
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
    eformVisualEditorPage.createVisualTemplate(checklist);
    const mainCheckListRowObj = new MainCheckListRowObj();
    mainCheckListRowObj.fields[0].changeColor('red');
    eformVisualEditorPage.clickSave();
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
    expect(
      mainChecklist.fields[0].color.description,
      'field color not valid'
    ).eq('Red');
  });
  it('should create visual template with one numberField', function () {
    const checklistWithPdfFile: MainChecklistObj = {
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
          type: EformFieldTypesEnum.Number,
          translations: [
            {
              name: generateRandmString(),
              description: generateRandmString(),
              languageId: 1,
              id: null,
            },
          ],
          mandatory: false,
          minValue: getRandomInt(0, 100),
          maxValue: getRandomInt(100, 200),
          defaultValue: getRandomInt(0, 200),
          decimalCount: 0,
        },
      ],
    };
    eformVisualEditorPage.createVisualTemplate(checklistWithPdfFile, true);
    const eform = myEformsPage.getLastMyEformsRowObj();

    expect(eform.eFormName, 'name in table eforms not valid').eq(
      checklistWithPdfFile.translations[0].name
    );
    eform.goToVisualEditor();
    const mainChecklist = new MainCheckListRowObj();
    expect(
      mainChecklist.translations[0].name,
      'name main checklist not valid'
    ).eq(checklistWithPdfFile.translations[0].name);
    expect(
      mainChecklist.translations[0].description,
      'description main checklist not valid'
    ).eq(checklistWithPdfFile.translations[0].description);
    expect(mainChecklist.fields[0].name, 'field name not valid').eq(
      checklistWithPdfFile.fields[0].translations[0].name
    );
    expect(mainChecklist.fields[0].type, 'field type not valid').eq(
      checklistWithPdfFile.fields[0].type
    );
    // todo add open modal field and expect other
  });
  it('should create visual template with one field and make copy this field', function () {
    const checklistObj: MainChecklistObj = {
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
    eformVisualEditorPage.createVisualTemplate(checklistObj);
    checklistObj.fields = [...checklistObj.fields, checklistObj.fields[0]];
    let mainChecklist = new MainCheckListRowObj();
    mainChecklist.fields[0].makeCopy();
    eformVisualEditorPage.clickSave();
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    mainChecklist = new MainCheckListRowObj();
    expect(
      mainChecklist.translations[0].name,
      'name main checklist not valid'
    ).eq(checklistObj.translations[0].name);
    expect(
      mainChecklist.translations[0].description,
      'description main checklist not valid'
    ).eq(checklistObj.translations[0].description);
    expect(mainChecklist.fields.length, 'fields length not valid').eq(2);
    expect(mainChecklist.fields[0].name, 'field[0] name not valid').eq(
      checklistObj.fields[0].translations[0].name
    );
    expect(mainChecklist.fields[0].type, 'field[0] type not valid').eq(
      checklistObj.fields[0].type
    );
    expect(mainChecklist.fields[1].name, 'field[1] name not valid').eq(
      checklistObj.fields[1].translations[0].name
    );
    expect(mainChecklist.fields[1].type, 'field[1] type not valid').eq(
      checklistObj.fields[1].type
    );
  });
  it(
    'should create visual template with one fieldGroup and ' +
      'one nested field with change color and make copy from nested field',
    function () {
      const checklistObj: MainChecklistObj = {
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
            type: EformFieldTypesEnum.FieldGroup,
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
      eformVisualEditorPage.createVisualTemplate(checklistObj);
      let mainChecklist = new MainCheckListRowObj();
      const nestedField: ChecklistFieldObj = {
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
      };
      mainChecklist.fields[0].collapseToggle();
      mainChecklist.fields[0].addNewNestedField(nestedField);
      mainChecklist = new MainCheckListRowObj();
      mainChecklist.fields[0].nestedFields[0].changeColor('red');
      mainChecklist.fields[0].nestedFields[0].makeCopy();
      eformVisualEditorPage.clickSave();
      myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
      mainChecklist = new MainCheckListRowObj();
      expect(
        mainChecklist.translations[0].name,
        'name main checklist not valid'
      ).eq(checklistObj.translations[0].name);
      expect(
        mainChecklist.translations[0].description,
        'description main checklist not valid'
      ).eq(checklistObj.translations[0].description);
      expect(mainChecklist.fields.length, 'fields length not valid').eq(1);
      expect(mainChecklist.fields[0].name, 'field name not valid').eq(
        checklistObj.fields[0].translations[0].name
      );
      expect(mainChecklist.fields[0].type, 'field type not valid').eq(
        checklistObj.fields[0].type
      );
      expect(
        mainChecklist.fields[0].nestedFields.length,
        'nestedFields not make copy'
      ).eq(2);
      expect(
        mainChecklist.fields[0].nestedFields[0].name,
        'nestedFields[0] name not valid'
      ).eq(nestedField.translations[0].name);
      expect(
        mainChecklist.fields[0].nestedFields[0].type,
        'nestedFields[0] type not valid'
      ).eq(nestedField.type);
      expect(
        mainChecklist.fields[0].nestedFields[0].color.description,
        'nestedFields[0] color not valid'
      ).eq('Red');

      expect(
        mainChecklist.fields[0].nestedFields[1].name,
        'nestedFields[1](copy  from [0]) name not valid'
      ).eq(nestedField.translations[0].name);
      expect(
        mainChecklist.fields[0].nestedFields[1].type,
        'nestedFields[1](copy  from [0]) type not valid'
      ).eq(nestedField.type);
      expect(
        mainChecklist.fields[0].nestedFields[1].color.description,
        'nestedFields[1](copy  from [0]) color not valid'
      ).eq('Red');
    }
  );
  it('should create visual template and delete field', function () {
    const checklistObj: MainChecklistObj = {
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
          type: EformFieldTypesEnum.FieldGroup,
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
    eformVisualEditorPage.createVisualTemplate(checklistObj);
    let mainChecklist = new MainCheckListRowObj();
    const nestedField: ChecklistFieldObj = {
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
    };
    mainChecklist.fields[0].collapseToggle();
    mainChecklist.fields[0].addNewNestedField(nestedField);
    mainChecklist = new MainCheckListRowObj();
    mainChecklist.fields[0].nestedFields[0].changeColor('red');
    mainChecklist.fields[0].nestedFields[0].makeCopy();
    mainChecklist = new MainCheckListRowObj();
    mainChecklist.fields[0].delete();
    eformVisualEditorPage.clickSave();
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    mainChecklist = new MainCheckListRowObj();
    expect(
      mainChecklist.translations[0].name,
      'name main checklist not valid'
    ).eq(checklistObj.translations[0].name);
    expect(
      mainChecklist.translations[0].description,
      'description main checklist not valid'
    ).eq(checklistObj.translations[0].description);
    expect(mainChecklist.fields.length, 'fields length not valid').eq(0);
  });
  it('should create visual template with one nested checklist and without fields', function () {
    const checklistObj: MainChecklistObj = {
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
    eformVisualEditorPage.createVisualTemplate(checklistObj, true);
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    const mainChecklist = new MainCheckListRowObj();
    for (let i = 0; i < checklistObj.checklists.length; i++) {
      expect(
        mainChecklist.checklists[i].translations[0].name,
        `name nested checklist[${i}] not valid`
      ).eq(checklistObj.checklists[i].translations[0].name);
      expect(
        mainChecklist.checklists[i].translations[0].description,
        `description nested checklist[${i}] not valid`
      ).eq(checklistObj.checklists[i].translations[0].description);
      expect(
        mainChecklist.checklists[i].fields.length,
        `nested checklist[${i}] fields length not valid`
      ).eq(0);
    }
  });
  it('should create visual template with one nested checklist and with some fields', function () {
    const checklistObj: MainChecklistObj = {
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
    eformVisualEditorPage.createVisualTemplate(checklistObj, true);
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    const mainChecklist = new MainCheckListRowObj();
    for (let i = 0; i < checklistObj.checklists.length; i++) {
      expect(
        mainChecklist.checklists[i].translations[0].name,
        `name nested checklist[${i}] not valid`
      ).eq(checklistObj.checklists[i].translations[0].name);
      expect(
        mainChecklist.checklists[i].translations[0].description,
        `description nested checklist[${i}] not valid`
      ).eq(checklistObj.checklists[i].translations[0].description);
    }
    expect(
      mainChecklist.checklists[0].fields.length,
      `nested checklist[0] fields length not valid`
    ).eq(1);
    expect(
      mainChecklist.checklists[0].fields[0].name,
      `nested checklist[0] fields name not valid`
    ).eq(checklistObj.checklists[0].fields[0].translations[0].name);
    expect(
      mainChecklist.checklists[0].fields[0].type,
      `nested checklist[0] fields type not valid`
    ).eq(checklistObj.checklists[0].fields[0].type);
  });
  it('should create visual template with one nested checklist and with pdfField', function () {
    const checklistObj: MainChecklistObj = {
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
              type: EformFieldTypesEnum.ShowPdf,
              translations: [
                {
                  name: generateRandmString(),
                  description: generateRandmString(),
                  languageId: 1,
                  id: null,
                },
              ],
              mandatory: false,
              pathToFiles: [
                `${process.cwd()}/e2e/Assets/attachment-english.pdf`,
              ],
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
    eformVisualEditorPage.createVisualTemplate(checklistObj, true);
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    const mainChecklist = new MainCheckListRowObj();
    for (let i = 0; i < checklistObj.checklists.length; i++) {
      expect(
        mainChecklist.checklists[i].translations[0].name,
        `name nested checklist[${i}] not valid`
      ).eq(checklistObj.checklists[i].translations[0].name);
      expect(
        mainChecklist.checklists[i].translations[0].description,
        `description nested checklist[${i}] not valid`
      ).eq(checklistObj.checklists[i].translations[0].description);
    }
    expect(
      mainChecklist.checklists[0].fields.length,
      `nested checklist[0] fields length not valid`
    ).eq(1);
    expect(
      mainChecklist.checklists[0].fields[0].name,
      `nested checklist[0] fields name not valid`
    ).eq(checklistObj.checklists[0].fields[0].translations[0].name);
    expect(
      mainChecklist.checklists[0].fields[0].type,
      `nested checklist[0] fields type not valid`
    ).eq(checklistObj.checklists[0].fields[0].type);
  });
  it('should correct read created eform from xml', function () {
    myEformsPage.Navbar.goToMyEForms();
    const eformName = generateRandmString();
    const eformFromXml: MainChecklistObj = {
      translations: [
        { name: eformName, description: '', languageId: 1, id: null },
      ],
      fields: [
        {
          translations: [
            { name: 'Number 1', description: '', languageId: 1, id: null },
          ],
          type: EformFieldTypesEnum.Number,
          mandatory: true,
        },
      ],
    };
    myEformsPage.createNewEform(
      eformName,
      [],
      0,
      XMLForEformFractions.XML.replace('Number 1', eformName)
    );
    myEformsPage.getLastMyEformsRowObj().goToVisualEditor();
    const mainChecklist = new MainCheckListRowObj();

    expect(
      mainChecklist.translations[0].name,
      'name main checklist not valid'
    ).eq(eformFromXml.translations[0].name);
    expect(
      mainChecklist.translations[0].description,
      'description main checklist not valid'
    ).eq(eformFromXml.translations[0].description);
    expect(mainChecklist.fields[0].name, 'field name not valid').eq(
      eformFromXml.fields[0].translations[0].name
    );
    expect(mainChecklist.fields[0].type, 'field type not valid').eq(
      eformFromXml.fields[0].type
    );
    expect(
      mainChecklist.fields[0].color.description,
      'field color not valid'
    ).eq('Standard');
  });
  afterEach(function () {
    // delete created checklist
    myEformsPage.Navbar.goToMyEForms();
    myEformsPage.clearEFormTable();
  });
});
