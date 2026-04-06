// noinspection JSIgnoredPromiseFromCall, ES6PreferShortImport

import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';
import {
  applicationLanguagesTranslated,
  EformFieldTypesEnum,
} from '../../../src/app/common/const';
import {
  CommonDictionaryModel,
  CommonTranslationsModel,
} from '../../../src/app/common/models';
import { eformVisualEditorElementColors } from '../../../src/app/modules/eforms/eform-visual-editor/const';
import { selectValueInNgSelector } from '../helper-functions';

export class EformVisualEditorPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  async checkListCountAll(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.page.locator('[id^="checkListSection"]').count();
  }

  async checkListCountOnFirsLevel(): Promise<number> {
    return await this.page.locator('#editorChecklists > app-visual-editor-checklist').count();
  }

  async fieldsCountOnFirsLevel(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.page.locator('[id*=field_]').count();
  }

  eformsVisualEditor(): Locator {
    return this.page.locator('#eformsVisualEditor');
  }

  manageTags(): Locator {
    return this.page.locator('#manageTags');
  }

  saveCreateEformBtn(): Locator {
    return this.page.locator('#saveCreateEformBtn');
  }

  expandAllBtn(): Locator {
    return this.page.locator('#expandAllBtn');
  }

  initialFieldCreateBtn(): Locator {
    return this.page.locator('#initialFieldCreateBtn');
  }

  initialChecklistCreateBtn(): Locator {
    return this.page.locator('#initialChecklistCreateBtn');
  }

  checklistDeleteDeleteBtn(): Locator {
    return this.page.locator('#checklistDeleteDeleteBtn');
  }

  checklistDeleteCancelBtn(): Locator {
    return this.page.locator('#checklistDeleteCancelBtn');
  }

  mainCheckListNameTranslationByLanguageId(languageId: number): Locator {
    return this.page.locator(`#mainCheckListNameTranslation_${languageId}`);
  }

  mainCheckListDescriptionTranslation(): Locator {
    return this.page.locator('[id^="mainCheckListDescriptionTranslation_"]');
  }

  mainCheckListDescriptionTranslationByLanguageId(languageId: number): Locator {
    return this.page.locator(`#mainCheckListDescriptionTranslation_${languageId}`);
  }

  mainCheckListTagsSelector(): Locator {
    return this.page.locator('#mainCheckListTagsSelector');
  }

  changeFieldSaveBtn(): Locator {
    return this.page.locator('#changeFieldSaveBtn');
  }

  fieldTypeSelector(): Locator {
    return this.page.locator('#fieldTypeSelector');
  }

  changeFieldSaveCancelBtn(): Locator {
    return this.page.locator('#changeFieldSaveCancelBtn');
  }

  fieldDeleteDeleteBtn(): Locator {
    return this.page.locator('#fieldDeleteDeleteBtn');
  }

  fieldDeleteCancelBtn(): Locator {
    return this.page.locator('#fieldDeleteCancelBtn');
  }

  changeChecklistSaveCancelBtn(): Locator {
    return this.page.locator('#changeChecklistSaveCancelBtn').last();
  }

  changeChecklistSaveBtn(): Locator {
    return this.page.locator('#changeChecklistSaveBtn').last();
  }

  async selectedLanguages(): Promise<number[]> {
    const selectedLanguages: number[] = [];
    for (let i = 0; i < applicationLanguagesTranslated.length; i++) {
      const checkbox = this.page.locator(`#languageCheckbox${applicationLanguagesTranslated[i].id}`).locator('input[type="checkbox"]');
      if (await checkbox.isChecked()) {
        selectedLanguages.push(i);
      }
    }
    return selectedLanguages;
  }

  async goToVisualEditor() {
    await this.eformsVisualEditor().click();
    await this.manageTags().waitFor({ state: 'visible', timeout: 40000 });
  }

  async createVisualTemplate(checklist: MainChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          await this.clickLanguageCheckbox(true, checklist.translations[i].languageId);
          await this.page.waitForTimeout(500);
          await this.mainCheckListNameTranslationByLanguageId(checklist.translations[i].languageId)
            .fill(checklist.translations[i].name);
          await this.page.waitForTimeout(500);
          await this.mainCheckListDescriptionTranslationByLanguageId(checklist.translations[i].languageId)
            .locator(`.NgxEditor__Content`)
            .fill(checklist.translations[i].description);
          await this.page.waitForTimeout(500);
        }
      }
      if (checklist.tags) {
        for (let i = 0; i < checklist.tags.length; i++) {
          await selectValueInNgSelector(this.page, '#mainCheckListTagsSelector', checklist.tags[i]);
        }
      }
      if (checklist.fields) {
        for (let i = 0; i < checklist.fields.length; i++) {
          await this.createVisualTemplateField(checklist.fields[i]);
        }
      }
      if (checklist.checklists) {
        for (let i = 0; i < checklist.checklists.length; i++) {
          await this.createNestedVisualTemplate(checklist.checklists[i], i);
        }
      }
    }
    if (clickSave) {
      await this.clickSave();
      await this.page.waitForTimeout(500);
    }
  }

  async createNestedVisualTemplate(
    checklist: MainChecklistObj,
    index: number
  ) {
    await this.initialChecklistCreateBtn().click();
    await this.changeChecklistSaveCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          await this.page.locator(`#newChecklistNameTranslation_${i}`).fill(
            checklist.translations[i].name
          );
          await this.page.locator(
            `#newChecklistDescriptionTranslation_${i} .NgxEditor__Content`
          ).fill(checklist.translations[i].description);
        }
      }
      await this.changeChecklistSaveBtn().click();
      await this.manageTags().waitFor({ state: 'visible', timeout: 40000 });
      if (checklist.fields) {
        for (let i = 0; i < checklist.fields.length; i++) {
          await this.createVisualTemplateField(
            checklist.fields[i],
            false,
            this.page.locator(`#addNewNestedField${index}`)
          );
        }
      }
    }
  }

  async createVisualTemplateField(
    checklistFieldObj: ChecklistFieldObj,
    clickCancel = false,
    addNewNestedFieldBtn: Locator | null = null
  ) {
    await this.openVisualTemplateFieldCreateModal(
      checklistFieldObj,
      addNewNestedFieldBtn
    );
    await this.closeVisualTemplateFieldCreateModal(clickCancel);
  }

  async openVisualTemplateFieldCreateModal(
    checklistFieldObj: ChecklistFieldObj,
    addNewNestedFieldBtn: Locator | null = null
  ) {
    if (checklistFieldObj) {
      if (!addNewNestedFieldBtn) {
        await this.initialFieldCreateBtn().click();
      } else {
        await addNewNestedFieldBtn.click();
      }
      await this.changeFieldSaveCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
      if (checklistFieldObj.translations) {
        for (let i = 0; i < checklistFieldObj.translations.length; i++) {
          await this.page.locator(`#fieldNameTranslation_${i}`).fill(
            checklistFieldObj.translations[i].name
          );
          await this.page.locator(`#newFieldDescriptionTranslation_${i} .NgxEditor__Content`)
            .fill(checklistFieldObj.translations[i].description);
        }
      }
      if (checklistFieldObj.type) {
        await this.fieldTypeSelector().locator('input').fill(
          DanishEformFieldTypesEnum[checklistFieldObj.type]
        );
        const option = this.page.locator('ng-dropdown-panel').locator('.ng-option').first();
        await option.waitFor({ state: 'visible', timeout: 40000 });
        await option.click();
      }

      // pdf type
      if (
        checklistFieldObj.pathToFiles &&
        checklistFieldObj.pathToFiles.length > 0
      ) {
        for (let i = 0; i < checklistFieldObj.pathToFiles.length; i++) {
          await this.page.locator(`#pdfInput${i}`).setInputFiles(
            checklistFieldObj.pathToFiles[i]
          );
        }
      }

      // number type
      if (checklistFieldObj.minValue) {
        await this.page.locator('#minValueEdit').fill(String(checklistFieldObj.minValue));
      }
      if (checklistFieldObj.maxValue) {
        await this.page.locator('#maxValueEdit').fill(String(checklistFieldObj.maxValue));
      }
      if (checklistFieldObj.defaultValue) {
        await this.page.locator('#defaultValueEdit0').fill(String(checklistFieldObj.defaultValue));
      }
      if (checklistFieldObj.decimalCount) {
        await this.page.locator('#decimalCountEdit').fill(String(checklistFieldObj.decimalCount));
      }

      // mandatory
      const noMandatory = [
        EformFieldTypesEnum.None,
        EformFieldTypesEnum.FieldGroup,
        EformFieldTypesEnum.Audio,
        EformFieldTypesEnum.ShowPdf,
        EformFieldTypesEnum.SaveButton,
      ];
      if (
        !noMandatory.includes(checklistFieldObj.type!) &&
        checklistFieldObj.mandatory
      ) {
        await this.page.locator('#isChecked').locator('..').click();
      }
    }
  }

  async closeVisualTemplateFieldCreateModal(clickCancel = false) {
    if (clickCancel) {
      await this.changeFieldSaveCancelBtn().click();
    } else {
      await this.changeFieldSaveBtn().click();
    }
    await this.manageTags().waitFor({ state: 'visible', timeout: 40000 });
  }

  async clickSave() {
    const saveBtn = this.saveCreateEformBtn();
    await saveBtn.scrollIntoViewIfNeeded();
    const saveResponse = this.page.waitForResponse(
      r => r.url().includes('/api/templates') && (r.request().method() === 'POST' || r.request().method() === 'PUT'),
      { timeout: 60000 }
    );
    await saveBtn.click();
    await saveResponse;
  }

  async openAllLanguages() {
    for (let i = 0; i < 3; i++) { // for now only 3 languages
      await this.clickLanguageCheckbox(true, i + 1);
    }
  }

  async clickLanguageCheckbox(value: boolean, index: number) {
    const checkbox = this.page.locator(`#languageCheckbox${index}`);
    const innerInput = checkbox.locator('input[type="checkbox"]');
    const isChecked = await innerInput.isChecked();
    if (isChecked !== value) {
      await checkbox.click();
    }
  }
}

export enum DanishEformFieldTypesEnum {
  Text = 1,
  'Numerisk',
  'Infoboks',
  'Afkrysning',
  'Billede',
  'Audio',
  'Movie',
  'Rullemenu',
  'Tekst',
  'Rullemenu multi',
  'Dato',
  'Underskrift',
  'Start/Stop-tid',
  'Rullemenu søgbar',
  'Rullemenu liste',
  'PDF',
  'Gruppe',
  'GemKnap',
  'Tæller',
}

export class MainCheckListRowObj {
  constructor(page: Page, eformVisualEditorPage: EformVisualEditorPage) {
    this.page = page;
    this.eformVisualEditorPage = eformVisualEditorPage;
  }

  page: Page;
  eformVisualEditorPage: EformVisualEditorPage;
  fields: ChecklistFieldRowObj[] = [];
  checklists: ChecklistRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  async openAllLanguages() {
    await this.eformVisualEditorPage.openAllLanguages();
  }

  async getAllFields() {
    const countField = await this.eformVisualEditorPage.fieldsCountOnFirsLevel();
    for (let i = 0; i < countField; i++) {
      const rowObj = new ChecklistFieldRowObj(this.page, this.eformVisualEditorPage, i);
      this.fields.push(await rowObj.loadData());
    }
    const countChecklist = await this.eformVisualEditorPage.checkListCountAll();
    for (let i = 0; i < countChecklist; i++) {
      const clRow = new ChecklistRowObj(this.page, this.eformVisualEditorPage, i);
      this.checklists.push(await clRow.load());
    }
    for (let i = 0; i < applicationLanguagesTranslated.length; i++) {
      const checkbox = this.page.locator(`#languageCheckbox${applicationLanguagesTranslated[i].id}`).locator('input[type="checkbox"]');
      if (await checkbox.isChecked()) {
        this.translations.push({
          languageId: i,
          name: await this.page.locator(`#mainCheckListNameTranslation_${applicationLanguagesTranslated[i].id}`).inputValue(),
          description: await this.page.locator(
            `#mainCheckListDescriptionTranslation_${applicationLanguagesTranslated[i].id} .NgxEditor__Content`
          ).textContent() || '',
          id: null,
        });
      }
    }
  }

  async edit(checklist: MainChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          const checkbox = this.page.locator(`#languageCheckbox${checklist.translations[i].languageId}`);
          const innerInput = checkbox.locator('input[type="checkbox"]');
          if (!(await innerInput.isChecked())) {
            await checkbox.click();
          }
          await this.page.locator(`#mainCheckListNameTranslation_${checklist.translations[i].languageId}`).fill(
            checklist.translations[i].name
          );
          await this.page.locator(
            `#mainCheckListDescriptionTranslation_${checklist.translations[i].languageId} .NgxEditor__Content`
          ).fill(checklist.translations[i].description);
        }
      }
      if (checklist.tags) {
        for (let i = 0; i < checklist.tags.length; i++) {
          await this.eformVisualEditorPage.mainCheckListTagsSelector().locator('input').fill(checklist.tags[i]);
          const option = this.eformVisualEditorPage.mainCheckListTagsSelector().locator('.ng-option');
          await option.waitFor({ state: 'visible', timeout: 40000 });
          await option.click();
        }
      }
    }
    if (clickSave) {
      await this.eformVisualEditorPage.clickSave();
    }
  }

  async collapseToggle() {
    await this.eformVisualEditorPage.expandAllBtn().click();
  }
}

export class ChecklistFieldRowObj {
  constructor(
    page: Page,
    eformVisualEditorPage: EformVisualEditorPage,
    index: number,
    isNested = false,
    fieldIndex = 0,
    isNestedInChecklist = false
  ) {
    this.page = page;
    this.eformVisualEditorPage = eformVisualEditorPage;
    this.index = index;
    this.isNested = isNested;
    this.fieldIndex = fieldIndex;
    this.isNestedInChecklist = isNestedInChecklist;
  }

  page: Page;
  eformVisualEditorPage: EformVisualEditorPage;
  index: number;
  isNested: boolean;
  fieldIndex: number;
  isNestedInChecklist: boolean;
  element: Locator;
  name: string;
  type: EformFieldTypesEnum;
  deleteBtn: Locator;
  editBtn: Locator;
  copyBtn: Locator;
  addNestedFieldBtn: Locator;
  collapseToggleBtn: Locator;
  fieldIsNotComplete: boolean;
  color: CommonDictionaryModel;
  colorsBtn: {
    standard: Locator;
    green: Locator;
    blue: Locator;
    yellow: Locator;
    red: Locator;
    grey: Locator;
  };
  nestedFields: ChecklistFieldRowObj[];
  moveFieldBtn: Locator;

  async loadData(): Promise<ChecklistFieldRowObj> {
    if (this.isNested) {
      this.element = this.page.locator(
        `#field_${this.fieldIndex} #nestedFields app-visual-editor-field`
      ).nth(this.index);
    } else if (this.isNestedInChecklist) {
      this.element = this.page.locator(
        `#fields_${this.fieldIndex}>app-visual-editor-field`
      ).nth(this.index);
    } else {
      this.element = this.page.locator(`#field_${this.index}`);
    }
    if (await this.element.isVisible()) {
      const str: string[] = (await this.element.locator('.field-name-and-type').first().textContent() || '')
        .replace('menu\n', '')
        .split('; ');
      this.name = str[0];
      this.type = (DanishEformFieldTypesEnum as any)[str[1]];
      this.deleteBtn = this.element.locator('#deleteBtn').first();
      this.editBtn = this.element.locator('#editBtn').first();
      this.copyBtn = this.element.locator('#copyBtn').first();
      this.moveFieldBtn = this.element.locator('#moveFieldBtn').first();
      this.fieldIsNotComplete = (await this.element.locator('#isNotFieldComplete').count()) > 0;
      const backgroundColor = await this.element.locator('div>div>div').first().evaluate(
        (el) => getComputedStyle(el).backgroundColor
      );
      // Convert rgb to hex
      const hex = backgroundColor
        .match(/\d+/g)!
        .map((x: string) => parseInt(x).toString(16).padStart(2, '0'))
        .join('');
      this.color = eformVisualEditorElementColors.find(
        (x) => x.name === hex
      )!;
      const colorMas = this.element.locator('#colors >*');
      this.colorsBtn = {
        standard: colorMas.nth(0),
        green: colorMas.nth(1),
        blue: colorMas.nth(2),
        yellow: colorMas.nth(3),
        red: colorMas.nth(4),
        grey: colorMas.nth(5),
      };
      if (this.type === EformFieldTypesEnum.FieldGroup) {
        this.addNestedFieldBtn = this.element.locator('#addNewNestedField');
        this.collapseToggleBtn = this.element.locator('#collapseToggleBtn');
        this.nestedFields = [];
        const nestedCount = await this.element.locator('#nestedFields app-visual-editor-field').count();
        for (let i = 0; i < nestedCount; i++) {
          const clfRow = new ChecklistFieldRowObj(this.page, this.eformVisualEditorPage, i, true, this.index);
          this.nestedFields.push(await clfRow.loadData());
        }
      }
    }
    return this;
  }

  async changeColor(colorName: string) {
    while (this.color.description.toLowerCase() !== colorName) {
      await this.colorsBtn[colorName as keyof typeof this.colorsBtn].click();
      const backgroundColor = await this.element.locator('div>div>div').first().evaluate(
        (el) => getComputedStyle(el).backgroundColor
      );
      const hex = backgroundColor
        .match(/\d+/g)!
        .map((x: string) => parseInt(x).toString(16).padStart(2, '0'))
        .join('');
      this.color = eformVisualEditorElementColors.find(
        (x) => x.name === hex
      )!;
    }
  }

  async makeCopy() {
    await this.copyBtn.scrollIntoViewIfNeeded();
    await this.copyBtn.click();
    await this.page.waitForTimeout(500);
  }

  async addNewNestedField(checklistFieldObj: ChecklistFieldObj) {
    await this.eformVisualEditorPage.createVisualTemplateField(
      checklistFieldObj,
      false,
      this.addNestedFieldBtn
    );
  }

  async collapseToggle() {
    await this.collapseToggleBtn.click();
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  async openDeleteModal() {
    await this.deleteBtn.click();
    await this.eformVisualEditorPage.fieldDeleteCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await this.eformVisualEditorPage.fieldDeleteCancelBtn().click();
    } else {
      await this.eformVisualEditorPage.fieldDeleteDeleteBtn().click();
    }
    await this.eformVisualEditorPage.manageTags().waitFor({ state: 'visible', timeout: 40000 });
  }

  async edit(field: ChecklistFieldObj, clickCancel = false) {
    await this.openEditModal(field);
    await this.closeEditModal(clickCancel);
  }

  async openEditModal(field: ChecklistFieldObj) {
    await this.eformVisualEditorPage.openVisualTemplateFieldCreateModal(
      field,
      this.editBtn
    );
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await this.eformVisualEditorPage.changeFieldSaveCancelBtn().click();
    } else {
      await this.eformVisualEditorPage.changeFieldSaveBtn().click();
    }
    await this.eformVisualEditorPage.manageTags().waitFor({ state: 'visible', timeout: 40000 });
  }

  async changePosition(targetField: ChecklistFieldRowObj) {
    await this.moveFieldBtn.dragTo(targetField.element);
  }
}

export class ChecklistRowObj {
  constructor(page: Page, eformVisualEditorPage: EformVisualEditorPage, index: number) {
    this.page = page;
    this.eformVisualEditorPage = eformVisualEditorPage;
    this.index = index;
  }

  page: Page;
  eformVisualEditorPage: EformVisualEditorPage;
  index: number;
  element: Locator;
  moveBtn: Locator;
  addNewNestedChecklistBtn: Locator;
  addNewNestedFieldBtn: Locator;
  editChecklistBtn: Locator;
  deleteChecklistBtn: Locator;
  fields: ChecklistFieldRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  async load() {
    this.element = this.page.locator(`#checkList_${this.index}`);
    if (await this.element.isVisible()) {
      this.moveBtn = this.element.locator('#moveBtn');
      this.addNewNestedChecklistBtn = this.element.locator(
        `#addNewNestedChecklist${this.index}`
      );
      this.addNewNestedFieldBtn = this.element.locator(
        `#addNewNestedField${this.index}`
      );
      this.editChecklistBtn = this.element.locator(
        `#editChecklistBtn${this.index}`
      );
      this.deleteChecklistBtn = this.element.locator(
        `#deleteChecklistBtn${this.index}`
      );
      const fieldCount = await this.element.locator(`#fields_${this.index}>app-visual-editor-field`).count();
      for (let i = 0; i < fieldCount; i++) {
        const clfRow = new ChecklistFieldRowObj(this.page, this.eformVisualEditorPage, i, false, this.index, true);
        this.fields.push(await clfRow.loadData());
      }
      const selectedLanguages = await this.eformVisualEditorPage.selectedLanguages();
      await this.openEditModal();
      for (let i = 0; i < selectedLanguages.length; i++) {
        const translation: CommonTranslationsModel = {
          languageId: selectedLanguages[i],
          name: '',
          description: '',
          id: null,
        };
        translation.name = await this.page.locator(
          `#newChecklistNameTranslation_${selectedLanguages[i]}`
        ).inputValue();
        translation.description = await this.page.locator(
          `#newChecklistDescriptionTranslation_${selectedLanguages[i]} .NgxEditor__Content`
        ).textContent() || '';
        this.translations.push(translation);
      }
      await this.closeEditModal(true);
    }
    return this;
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  async openDeleteModal() {
    await this.deleteChecklistBtn.click();
    await this.eformVisualEditorPage.fieldDeleteCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await this.eformVisualEditorPage.checklistDeleteCancelBtn().click();
    } else {
      await this.eformVisualEditorPage.checklistDeleteDeleteBtn().click();
    }
    await this.eformVisualEditorPage.manageTags().waitFor({ state: 'visible', timeout: 40000 });
  }

  async edit(translations?: CommonTranslationsModel[], clickCancel = false) {
    await this.openEditModal(translations);
    await this.closeEditModal(clickCancel);
  }

  async openEditModal(translations?: CommonTranslationsModel[]) {
    await this.editChecklistBtn.click();
    await this.page.waitForTimeout(1000);
    await this.eformVisualEditorPage.changeChecklistSaveCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
    if (translations) {
      for (let i = 0; i < translations.length; i++) {
        await this.page.locator(`#newChecklistNameTranslation_${translations[i].languageId}`).fill(
          translations[i].name
        );
        await this.page.locator(
          `#newChecklistDescriptionTranslation_${translations[i].languageId} .NgxEditor__Content`
        ).fill(translations[i].description);
      }
    }
  }

  async closeEditModal(clickCancel: boolean) {
    if (clickCancel) {
      await this.eformVisualEditorPage.changeChecklistSaveCancelBtn().click();
    } else {
      await this.eformVisualEditorPage.changeChecklistSaveBtn().click();
    }
    await this.eformVisualEditorPage.manageTags().waitFor({ state: 'visible', timeout: 40000 });
  }
}

export class MainChecklistObj {
  translations?: CommonTranslationsModel[];
  tags?: string[];
  fields?: ChecklistFieldObj[];
  checklists?: ChecklistObj[];
}

export class ChecklistFieldObj {
  translations?: CommonTranslationsModel[];
  type?: EformFieldTypesEnum;
  mandatory?: boolean;
  pathToFiles?: string[];
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  decimalCount?: number;
}

export class ChecklistObj {
  translations?: CommonTranslationsModel[];
  fields?: ChecklistFieldObj[];
}
