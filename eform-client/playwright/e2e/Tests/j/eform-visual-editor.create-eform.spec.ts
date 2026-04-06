import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import {
  EformVisualEditorPage,
  ChecklistFieldObj,
  MainChecklistObj,
  MainCheckListRowObj,
} from '../../Page objects/EformVisualEditor.page';
import {
  generateRandmString,
  getRandomInt,
} from '../../helper-functions';
import { EformFieldTypesEnum } from '../../../../src/app/common/const';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import XMLForEformFractions from '../../Constants/XMLForEformFractions';

test.describe.serial('Visual editor page', () => {
  let page;
  let loginPage: LoginPage;
  let eformVisualEditorPage: EformVisualEditorPage;
  let myEformsPage: MyEformsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    eformVisualEditorPage = new EformVisualEditorPage(page);
    myEformsPage = new MyEformsPage(page);
    await loginPage.open('/');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    await eformVisualEditorPage.goToVisualEditor();
  });

  test('should not create visual template without any translations on main checklist', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(
      checklistWithoutTranslations
    );
    expect(
      await (await eformVisualEditorPage.saveCreateEformBtn()).isEnabled()
    ).toBe(false);
  });

  test('should create visual template without any fields', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(
      checklistWithoutFields,
      true
    );
    const eform = await myEformsPage.getLastMyEformsRowObj();
    expect(eform.eFormName).toBe(checklistWithoutFields.translations[0].name);
    await eform.goToVisualEditor();
    await page.waitForTimeout(1500);
    const visualTemplate = new MainCheckListRowObj(page, eformVisualEditorPage);
    await visualTemplate.getAllFields();
    expect(visualTemplate.translations[0].name).toBe(checklistWithoutFields.translations[0].name);
    expect(visualTemplate.translations[0].description).toBe(checklistWithoutFields.translations[0].description);
    expect(visualTemplate.fields.length).toBe(0);
  });

  test('should create visual template', async () => {
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
    const eform = await myEformsPage.getLastMyEformsRowObj();

    expect(eform.eFormName).toBe(checklist.translations[0].name);
    await eform.goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklist.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklist.translations[0].description);
    expect(mainChecklist.fields[0].name).toBe(checklist.fields[0].translations[0].name);
    expect(mainChecklist.fields[0].type).toBe(checklist.fields[0].type);
    expect(mainChecklist.fields[0].color.description).toBe('Standard');
  });

  test('should create visual template with one pdfField', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(
      checklistWithPdfFile,
      true
    );
    const eform = await myEformsPage.getLastMyEformsRowObj();

    expect(eform.eFormName).toBe(checklistWithPdfFile.translations[0].name);
    await eform.goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklistWithPdfFile.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklistWithPdfFile.translations[0].description);
    expect(mainChecklist.fields[0].name).toBe(checklistWithPdfFile.fields[0].translations[0].name);
    expect(mainChecklist.fields[0].type).toBe(checklistWithPdfFile.fields[0].type);
  });

  test('should create checklist with field non standard color', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(checklist);
    let mainCheckListRowObj = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainCheckListRowObj.getAllFields();
    await mainCheckListRowObj.fields[0].changeColor('red');
    // Reload data after changeColor to ensure DOM is synchronized before saving
    mainCheckListRowObj = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainCheckListRowObj.getAllFields();
    await eformVisualEditorPage.clickSave();
    const eform = await myEformsPage.getLastMyEformsRowObj();

    expect(eform.eFormName).toBe(checklist.translations[0].name);
    await eform.goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklist.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklist.translations[0].description);
    expect(mainChecklist.fields[0].name).toBe(checklist.fields[0].translations[0].name);
    expect(mainChecklist.fields[0].type).toBe(checklist.fields[0].type);
    expect(mainChecklist.fields[0].color.description).toBe('Red');
  });

  test('should create visual template with one numberField', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(
      checklistWithPdfFile,
      true
    );
    const eform = await myEformsPage.getLastMyEformsRowObj();

    expect(eform.eFormName).toBe(checklistWithPdfFile.translations[0].name);
    await eform.goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklistWithPdfFile.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklistWithPdfFile.translations[0].description);
    expect(mainChecklist.fields[0].name).toBe(checklistWithPdfFile.fields[0].translations[0].name);
    expect(mainChecklist.fields[0].type).toBe(checklistWithPdfFile.fields[0].type);
    // todo add open modal field and expect other
  });

  test('should create visual template with one field and make copy this field', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(checklistObj);
    checklistObj.fields = [...checklistObj.fields, checklistObj.fields[0]];
    let mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    await page.waitForTimeout(500);
    await mainChecklist.fields[0].makeCopy();
    mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    await eformVisualEditorPage.clickSave();
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await page.waitForTimeout(1500);
    mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklistObj.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklistObj.translations[0].description);
    expect(mainChecklist.fields.length).toBe(2);
    expect(mainChecklist.fields[0].name).toBe(checklistObj.fields[0].translations[0].name);
    expect(mainChecklist.fields[0].type).toBe(checklistObj.fields[0].type);
    expect(mainChecklist.fields[1].name).toBe(checklistObj.fields[1].translations[0].name);
    expect(mainChecklist.fields[1].type).toBe(checklistObj.fields[1].type);
  });

  test(
    'should create visual template with one fieldGroup and ' +
      'one nested field with change color and make copy from nested field',
    async () => {
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
      await eformVisualEditorPage.createVisualTemplate(checklistObj);
      let mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
      await mainChecklist.getAllFields();
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
      await mainChecklist.fields[0].collapseToggle();
      await mainChecklist.fields[0].addNewNestedField(nestedField);
      mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
      await mainChecklist.getAllFields();
      await mainChecklist.fields[0].nestedFields[0].changeColor('red');
      await mainChecklist.fields[0].nestedFields[0].makeCopy();
      mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
      await mainChecklist.getAllFields();
      await eformVisualEditorPage.clickSave();
      await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
      await page.waitForTimeout(1500);
      mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
      await mainChecklist.getAllFields();
      expect(mainChecklist.translations[0].name).toBe(checklistObj.translations[0].name);
      expect(mainChecklist.translations[0].description).toBe(checklistObj.translations[0].description);
      expect(mainChecklist.fields.length).toBe(1);
      expect(mainChecklist.fields[0].name).toBe(checklistObj.fields[0].translations[0].name);
      expect(mainChecklist.fields[0].type).toBe(checklistObj.fields[0].type);
      expect(mainChecklist.fields[0].nestedFields.length).toBe(2);
      expect(mainChecklist.fields[0].nestedFields[0].name).toBe(nestedField.translations[0].name);
      expect(mainChecklist.fields[0].nestedFields[0].type).toBe(nestedField.type);
      expect(mainChecklist.fields[0].nestedFields[0].color.description).toBe('Red');

      expect(mainChecklist.fields[0].nestedFields[1].name).toBe(nestedField.translations[0].name);
      expect(mainChecklist.fields[0].nestedFields[1].type).toBe(nestedField.type);
      expect(mainChecklist.fields[0].nestedFields[1].color.description).toBe('Red');
    }
  );

  test('should create visual template and delete field', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(checklistObj);
    let mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
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
    await mainChecklist.fields[0].collapseToggle();
    await mainChecklist.fields[0].addNewNestedField(nestedField);
    mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    await mainChecklist.fields[0].nestedFields[0].changeColor('red');
    await mainChecklist.fields[0].nestedFields[0].makeCopy();
    mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    await mainChecklist.fields[0].delete();
    await eformVisualEditorPage.clickSave();
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await page.waitForTimeout(1500);
    mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklistObj.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklistObj.translations[0].description);
    expect(mainChecklist.fields.length).toBe(0);
  });

  test('should create visual template with one nested checklist and without fields', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(checklistObj, true);
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    // for (let i = 0; i < checklistObj.checklists.length; i++) {
    //   expect(
    //     mainChecklist.checklists[i].translations[0].name
    //   ).toBe(checklistObj.checklists[i].translations[0].name);
    //   expect(
    //     mainChecklist.checklists[i].translations[0].description
    //   ).toBe(checklistObj.checklists[i].translations[0].description);
    //   expect(
    //     mainChecklist.checklists[i].fields.length
    //   ).toBe(0);
    // }
  });

  test('should create visual template with one nested checklist and with some fields', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(checklistObj, true);
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    // for (let i = 0; i < checklistObj.checklists.length; i++) {
    //   expect(
    //     mainChecklist.checklists[i].translations[0].name
    //   ).toBe(checklistObj.checklists[i].translations[0].name);
    //   expect(
    //     mainChecklist.checklists[i].translations[0].description
    //   ).toBe(checklistObj.checklists[i].translations[0].description);
    // }
    // expect(
    //   mainChecklist.checklists[0].fields.length
    // ).toBe(1);
    // expect(
    //   mainChecklist.checklists[0].fields[0].name
    // ).toBe(checklistObj.checklists[0].fields[0].translations[0].name);
    // expect(
    //   mainChecklist.checklists[0].fields[0].type
    // ).toBe(checklistObj.checklists[0].fields[0].type);
  });

  test('should create visual template with one nested checklist and with pdfField', async () => {
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
    await eformVisualEditorPage.createVisualTemplate(checklistObj, true);
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    // for (let i = 0; i < checklistObj.checklists.length; i++) {
    //   expect(
    //     mainChecklist.checklists[i].translations[0].name
    //   ).toBe(checklistObj.checklists[i].translations[0].name);
    //   expect(
    //     mainChecklist.checklists[i].translations[0].description
    //   ).toBe(checklistObj.checklists[i].translations[0].description);
    // }
    // expect(
    //   mainChecklist.checklists[0].fields.length
    // ).toBe(1);
    // expect(
    //   mainChecklist.checklists[0].fields[0].name
    // ).toBe(checklistObj.checklists[0].fields[0].translations[0].name);
    // expect(
    //   mainChecklist.checklists[0].fields[0].type
    // ).toBe(checklistObj.checklists[0].fields[0].type);
  });

  test('should create visual template and change order field (not nested)', async () => {
    let checklist: MainChecklistObj = {
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
    await eformVisualEditorPage.createVisualTemplate(checklist);
    let mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    await mainChecklist.fields[1].changePosition(mainChecklist.fields[0]);
    await page.waitForTimeout(1000);
    checklist = {
      ...checklist,
      fields: [checklist.fields[1], checklist.fields[0]],
    };
    await eformVisualEditorPage.clickSave();

    const eform = await myEformsPage.getLastMyEformsRowObj();

    await eform.goToVisualEditor();
    await eformVisualEditorPage.manageTags().waitFor({ state: 'visible', timeout: 40000 });
    mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklist.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklist.translations[0].description);
    expect(mainChecklist.fields[0].name).toBe(checklist.fields[0].translations[0].name);
    expect(mainChecklist.fields[1].name).toBe(checklist.fields[1].translations[0].name);
  });

  test('should create visual template and change order nested field', async () => {
    let checklist: MainChecklistObj = {
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
    await eformVisualEditorPage.createVisualTemplate(checklist);
    let mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    await mainChecklist.checklists[0].fields[1].changePosition(
      mainChecklist.checklists[0].fields[0]
    );
    await page.waitForTimeout(1000);
    checklist = {
      ...checklist,
      checklists: [
        {
          ...checklist.checklists,
          fields: [
            checklist.checklists[0].fields[1],
            checklist.checklists[0].fields[0],
          ],
        },
      ],
    };
    await eformVisualEditorPage.clickSave();

    const eform = await myEformsPage.getLastMyEformsRowObj();

    await eform.goToVisualEditor();
    await page.waitForTimeout(1500);
    mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();
    expect(mainChecklist.translations[0].name).toBe(checklist.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(checklist.translations[0].description);
    expect(mainChecklist.checklists[0].fields[0].name).toBe(checklist.checklists[0].fields[0].translations[0].name);
    expect(mainChecklist.checklists[0].fields[1].name).toBe(checklist.checklists[0].fields[1].translations[0].name);
  });

  test('should correct read created eform from xml', async () => {
    await myEformsPage.Navbar.goToMyEForms();
    const eformName = generateRandmString();
    const eformFromXml: MainChecklistObj = {
      translations: [
        { name: eformName, description: '', languageId: 1, id: null },
      ],
      fields: [
        {
          translations: [
            { name: 'Number 2', description: '', languageId: 1, id: null },
          ],
          type: EformFieldTypesEnum.Number,
          mandatory: true,
        },
      ],
    };
    await myEformsPage.createNewEform(
      eformName,
      [],
      0,
      XMLForEformFractions.XML.replace(/Number 1/g, eformName)
    );
    await (await myEformsPage.getLastMyEformsRowObj()).goToVisualEditor();
    await page.waitForTimeout(1500);
    const mainChecklist = new MainCheckListRowObj(page, eformVisualEditorPage);
    await mainChecklist.getAllFields();

    expect(mainChecklist.translations[0].name).toBe(eformFromXml.translations[0].name);
    expect(mainChecklist.translations[0].description).toBe(eformFromXml.translations[0].description);
    expect(mainChecklist.fields[0].name).toBe(eformFromXml.fields[0].translations[0].name);
    expect(mainChecklist.fields[0].type).toBe(eformFromXml.fields[0].type);
    expect(mainChecklist.fields[0].color.description).toBe('Standard');
  });

  test.afterEach(async () => {
    // delete created checklist
    await myEformsPage.Navbar.goToMyEForms();
    await myEformsPage.clearEFormTable();
  });
});
