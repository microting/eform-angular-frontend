// noinspection JSIgnoredPromiseFromCall

import { PageWithNavbarPage } from './PageWithNavbar.page';
import {
  applicationLanguages,
  EformFieldTypesEnum,
} from '../../src/app/common/const';
import {
  CommonDictionaryModel,
  CommonTranslationsModel,
} from '../../src/app/common/models';
import myEformsPage from './MyEforms.page';
import { eformVisualEditorElementColors } from '../../src/app/modules/eforms/eform-visual-editor/const/eform-visual-editor-element-types';

class EformVisualEditorPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  async checkListCountAll(): Promise<number> {
    await browser.pause(1000);
    return (await $$('[id^="checkListSection"]')).length;
  }
  async checkListCountOnFirsLevel(): Promise<number> {
    return (await $$('#editorChecklists > app-visual-editor-checklist')).length;
  }

  async fieldsCountOnFirsLevel(): Promise<number> {
    await browser.pause(1000);
    return (await $$('[id*=field_]')).length;
  }

  async eformsVisualEditor(): Promise<WebdriverIO.Element> {
    const ele = await $('#eformsVisualEditor');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async manageTags(): Promise<WebdriverIO.Element> {
    const ele = await $('#manageTags');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async saveCreateEformBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#saveCreateEformBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async expandAllBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#expandAllBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async initialFieldCreateBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#initialFieldCreateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async initialChecklistCreateBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#initialChecklistCreateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async checklistDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#checklistDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async checklistDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#checklistDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async mainCheckListNameTranslationByLanguageId(
    languageId: number
  ): Promise<WebdriverIO.Element> {
    const ele = await $(`#mainCheckListNameTranslation_${languageId}`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async mainCheckListDescriptionTranslation(): Promise<WebdriverIO.Element> {
    const ele = await $('[id^="mainCheckListDescriptionTranslation_"]');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async mainCheckListDescriptionTranslationByLanguageId(
    languageId: number
  ): Promise<WebdriverIO.Element> {
    const ele = await $(`#mainCheckListDescriptionTranslation_${languageId}`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async mainCheckListTagsSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#mainCheckListTagsSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async changeFieldSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#changeFieldSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async fieldTypeSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#fieldTypeSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async changeFieldSaveCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#changeFieldSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async fieldDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#fieldDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async fieldDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = $('#fieldDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async changeChecklistSaveCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = $('#changeChecklistSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async changeChecklistSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = $('#changeChecklistSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async selectedLanguages(): Promise<number[]> {
    const selectedLanguages = [];
    for (let i = 0; i < applicationLanguages.length; i++) {
      const checkbox = await $(`#languageCheckbox${i}`);
      if ((await checkbox.getValue()) === true.toString()) {
        selectedLanguages.push(i);
      }
    }
    return selectedLanguages;
  }

  async goToVisualEditor() {
    await (await this.eformsVisualEditor()).click();
    await (await this.manageTags()).waitForClickable({ timeout: 40000 });
  }

  async createVisualTemplate(checklist: MainChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          await this.clickLanguageCheckbox(true, i);
          await (
            await this.mainCheckListNameTranslationByLanguageId(i)
          ).setValue(checklist.translations[i].name);
          await (
            await (
              await this.mainCheckListDescriptionTranslationByLanguageId(i)
            ).$(`.NgxEditor__Content`)
          ).setValue(checklist.translations[i].description);
        }
      }
      if (checklist.tags) {
        for (let i = 0; i < checklist.tags.length; i++) {
          (await (await this.mainCheckListTagsSelector()).$('input')).setValue(
            checklist.tags[i]
          );
          const option = await (await this.mainCheckListTagsSelector()).$(
            '.ng-option'
          );
          await option.waitForDisplayed({ timeout: 40000 });
          await option.click();
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
    }
  }

  async createNestedVisualTemplate(
    checklist: MainChecklistObj,
    index: number
    /*, clickCancel = false*/
  ) {
    await (await this.initialChecklistCreateBtn()).click();
    await (await this.changeChecklistSaveCancelBtn()).waitForClickable({
      timeout: 40000,
    });
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          await (await $(`#newChecklistNameTranslation_${i}`)).setValue(
            checklist.translations[i].name
          );
          await (
            await $(
              `#newChecklistDescriptionTranslation_${i} .NgxEditor__Content`
            )
          ).setValue(checklist.translations[i].description);
        }
      }
      // if (clickCancel) {
      //   this.changeChecklistSaveCancelBtn.click();
      // } else {
      await (await this.changeChecklistSaveBtn()).click();
      // }
      await (await this.manageTags()).waitForClickable({ timeout: 40000 });
      if (checklist.fields) {
        for (let i = 0; i < checklist.fields.length; i++) {
          await this.createVisualTemplateField(
            checklist.fields[i],
            false,
            await $(`#addNewNestedField${index}`)
          ); // addNewNestedField0 - 0 it's index
        }
      }
    }
  }

  async createVisualTemplateField(
    checklistFieldObj: ChecklistFieldObj,
    clickCancel = false,
    addNewNestedFieldBtn: WebdriverIO.Element = null
  ) {
    await this.openVisualTemplateFieldCreateModal(
      checklistFieldObj,
      addNewNestedFieldBtn
    );
    await this.closeVisualTemplateFieldCreateModal(clickCancel);
  }

  async openVisualTemplateFieldCreateModal(
    checklistFieldObj: ChecklistFieldObj,
    addNewNestedFieldBtn: WebdriverIO.Element = null
  ) {
    if (checklistFieldObj) {
      if (!addNewNestedFieldBtn) {
        await (await this.initialFieldCreateBtn()).click();
      } else {
        await addNewNestedFieldBtn.click();
      }
      await (await this.changeFieldSaveCancelBtn()).waitForClickable({
        timeout: 40000,
      });
      if (checklistFieldObj.translations) {
        for (let i = 0; i < checklistFieldObj.translations.length; i++) {
          await (await $(`#fieldNameTranslation_${i}`)).setValue(
            checklistFieldObj.translations[i].name
          );
          await (
            await $(`#newFieldDescriptionTranslation_${i} .NgxEditor__Content`)
          ).setValue(checklistFieldObj.translations[i].description);
        }
      }
      if (checklistFieldObj.type) {
        await (await (await this.fieldTypeSelector()).$('input')).setValue(
          DanishEformFieldTypesEnum[checklistFieldObj.type]
        );
        const option = await (await this.fieldTypeSelector()).$('.ng-option');
        await option.waitForDisplayed({ timeout: 40000 });
        await option.click();
      }

      // pdf type
      if (
        checklistFieldObj.pathToFiles &&
        checklistFieldObj.pathToFiles.length > 0
      ) {
        for (let i = 0; i < checklistFieldObj.pathToFiles.length; i++) {
          const file = await browser.uploadFile(
            checklistFieldObj.pathToFiles[i]
          );
          await (await $(`#pdfInput${i}`)).addValue(file);
        }
      }

      // number type
      if (checklistFieldObj.minValue) {
        await (await $('#minValueEdit')).setValue(checklistFieldObj.minValue);
      }
      if (checklistFieldObj.maxValue) {
        await (await $('#maxValueEdit')).setValue(checklistFieldObj.maxValue);
      }
      if (checklistFieldObj.defaultValue) {
        await (await $('#defaultValueEdit0')).setValue(
          checklistFieldObj.defaultValue
        );
      }
      if (checklistFieldObj.decimalCount) {
        await (await $('#decimalCountEdit')).setValue(
          checklistFieldObj.decimalCount
        );
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
        !noMandatory.includes(checklistFieldObj.type) &&
        checklistFieldObj.mandatory
      ) {
        await (await (await $('#isChecked')).$('..')).click();
      }
    }
  }

  async closeVisualTemplateFieldCreateModal(clickCancel = false) {
    if (clickCancel) {
      await (await this.changeFieldSaveCancelBtn()).click();
    } else {
      await (await this.changeFieldSaveBtn()).click();
    }
    await (await this.manageTags()).waitForClickable({ timeout: 40000 });
  }

  async clickSave() {
    await (await this.saveCreateEformBtn()).click();
    await (await myEformsPage.newEformBtn()).waitForClickable({
      timeout: 40000,
    });
  }

  async openAllLanguages() {
    for (let i = 0; i < applicationLanguages.length; i++) {
      await this.clickLanguageCheckbox(true, i);
    }
  }

  async clickLanguageCheckbox(value: boolean, index: number) {
    const checkbox = await $(`#languageCheckbox${index}`);
    if ((await checkbox.getValue()) !== value.toString()) {
      await (await checkbox.$('..')).click();
    }
  }
}

export enum DanishEformFieldTypesEnum {
  Text = 1,
  'Numerisk',
  'Infoboks',
  'Afkrysning',
  'Billede',
  Audio,
  Movie,
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

const eformVisualEditorPage = new EformVisualEditorPage();
export default eformVisualEditorPage;

export class MainCheckListRowObj {
  constructor() {}
  fields: ChecklistFieldRowObj[] = [];
  checklists: ChecklistRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  async openAllLanguages() {
    await eformVisualEditorPage.openAllLanguages();
  }

  async getAllFields() {
    const countField = await eformVisualEditorPage.fieldsCountOnFirsLevel();
    for (let i = 0; i < countField; i++) {
      const rowObj = new ChecklistFieldRowObj(i);
      this.fields.push(await rowObj.loadData());
    }
    const countChecklist = await eformVisualEditorPage.checkListCountAll();
    for (let i = 0; i < countChecklist; i++) {
      const clRow = new ChecklistRowObj(i);
      this.checklists.push(await clRow.load());
    }
    for (let i = 0; i < applicationLanguages.length; i++) {
      const checkbox = await $(`#languageCheckbox${i}`);
      if ((await checkbox.getValue()) !== false.toString()) {
        this.translations.push({
          languageId: i,
          name: await (
            await $(`#mainCheckListNameTranslation_${i}`)
          ).getValue(),
          description: await (
            await $(
              `#mainCheckListDescriptionTranslation_${i} .NgxEditor__Content`
            )
          ).getText(),
          id: null,
        });
      }
    }
  }

  async edit(checklist: MainChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          const checkbox = await $(`#languageCheckbox${i}`);
          if ((await checkbox.getValue()) === false.toString()) {
            await (await checkbox.$('..')).click();
          }
          await (await $(`#mainCheckListNameTranslation_${i}`)).setValue(
            checklist.translations[i].name
          );
          await (
            await $(
              `#mainCheckListDescriptionTranslation_${i} .NgxEditor__Content`
            )
          ).setValue(checklist.translations[i].description);
        }
      }
      if (checklist.tags) {
        for (let i = 0; i < checklist.tags.length; i++) {
          await (
            await (await eformVisualEditorPage.mainCheckListTagsSelector()).$(
              'input'
            )
          ).setValue(checklist.tags[i]);
          const option = await (
            await eformVisualEditorPage.mainCheckListTagsSelector()
          ).$('.ng-option');
          await option.waitForDisplayed({ timeout: 40000 });
          await option.click();
        }
      }
    }
    if (clickSave) {
      await eformVisualEditorPage.clickSave();
    }
  }

  async collapseToggle() {
    await (await eformVisualEditorPage.expandAllBtn()).click();
    await browser.pause(500);
  }
}

export class ChecklistFieldRowObj {
  constructor(
    index: number,
    isNested = false,
    fieldIndex = 0,
    isNestedInChecklist = false
  ) {
    this.index = index;
    this.isNested = isNested;
    this.fieldIndex = fieldIndex;
    this.isNestedInChecklist = isNestedInChecklist;
  }
  index: number;
  isNested: boolean;
  fieldIndex: number;
  isNestedInChecklist: boolean;
  element: WebdriverIO.Element;
  name: string;
  type: EformFieldTypesEnum;
  deleteBtn: WebdriverIO.Element;
  editBtn: WebdriverIO.Element;
  copyBtn: WebdriverIO.Element;
  addNestedFieldBtn: WebdriverIO.Element;
  collapseToggleBtn: WebdriverIO.Element;
  fieldIsNotComplete: boolean;
  color: CommonDictionaryModel;
  colorsBtn: {
    standard: WebdriverIO.Element;
    green: WebdriverIO.Element;
    blue: WebdriverIO.Element;
    yellow: WebdriverIO.Element;
    red: WebdriverIO.Element;
    grey: WebdriverIO.Element;
  };
  nestedFields: ChecklistFieldRowObj[];
  moveFieldBtn: WebdriverIO.Element;

  async loadData(): Promise<ChecklistFieldRowObj> {
    if (this.isNested) {
      this.element = (
        await $$(
          `#field_${this.fieldIndex} #nestedFields app-visual-editor-field`
        )
      )[this.index];
    } else if (this.isNestedInChecklist) {
      this.element = (
        await $$(`#fields_${this.fieldIndex}>app-visual-editor-field`)
      )[this.index];
    } else {
      this.element = await $(`#field_${this.index}`);
    }
    if (this.element) {
      const str: string[] = (
        await (await this.element.$('.col-6')).getText()
      )
        .replace('drag_handle ', '') // delete not need word
        .split('; '); // split name and type
      this.name = str[0];
      this.type = DanishEformFieldTypesEnum[str[1]];
      this.deleteBtn = await this.element.$('#deleteBtn');
      this.editBtn = await this.element.$('#editBtn');
      this.copyBtn = await this.element.$('#copyBtn');
      this.moveFieldBtn = await this.element.$('#moveFieldBtn');
      this.fieldIsNotComplete = !!(await this.element.$('#isNotFieldComplete'));
      const backgroundColor = (
        await (await this.element.$('div>div')).getCSSProperty(
          'background-color'
        )
      ).parsed.hex;
      this.color = eformVisualEditorElementColors.find(
        (x) => x.name === backgroundColor.replace('#', '')
      );
      const colorMas = await this.element.$$('#colors >*');
      this.colorsBtn = {
        standard: colorMas[0],
        green: colorMas[1],
        blue: colorMas[2],
        yellow: colorMas[3],
        red: colorMas[4],
        grey: colorMas[5],
      };
      if (this.type === EformFieldTypesEnum.FieldGroup) {
        this.addNestedFieldBtn = await this.element.$('#addNewNestedField');
        this.collapseToggleBtn = await this.element.$('#collapseToggleBtn');
        this.nestedFields = [];
        for (
          let i = 0;
          i <
          (await this.element.$$('#nestedFields app-visual-editor-field'))
            .length;
          i++
        ) {
          const clfRow = new ChecklistFieldRowObj(i, true, this.index);
          this.nestedFields.push(await clfRow.loadData());
        }
      }
    }
    return this;
  }

  async changeColor(colorName: string) {
    await this.colorsBtn[colorName].click();
  }

  async makeCopy() {
    await this.copyBtn.scrollIntoView();
    await this.copyBtn.click();
  }

  async addNewNestedField(checklistFieldObj: ChecklistFieldObj) {
    await eformVisualEditorPage.createVisualTemplateField(
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
    await (await eformVisualEditorPage.fieldDeleteCancelBtn()).waitForClickable(
      {
        timeout: 40000,
      }
    );
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (await eformVisualEditorPage.fieldDeleteCancelBtn()).click();
    } else {
      await (await eformVisualEditorPage.fieldDeleteDeleteBtn()).click();
    }
    await (await eformVisualEditorPage.manageTags()).waitForClickable({
      timeout: 40000,
    });
  }

  async edit(field: ChecklistFieldObj, clickCancel = false) {
    await this.openEditModal(field);
    await this.closeEditModal(clickCancel);
  }

  async openEditModal(field: ChecklistFieldObj) {
    await eformVisualEditorPage.openVisualTemplateFieldCreateModal(
      field,
      this.editBtn
    );
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await (await eformVisualEditorPage.changeFieldSaveCancelBtn()).click();
    } else {
      await (await eformVisualEditorPage.changeFieldSaveBtn()).click();
    }
    await (await eformVisualEditorPage.manageTags()).waitForClickable({
      timeout: 40000,
    });
  }

  async changePosition(tarasyncField: ChecklistFieldRowObj) {
    await this.moveFieldBtn.dragAndDrop(tarasyncField.element);
  }
}

export class ChecklistRowObj {
  constructor(index: number) {
    this.index = index;
  }
  index: number;
  element: WebdriverIO.Element;
  moveBtn: WebdriverIO.Element;
  addNewNestedChecklistBtn: WebdriverIO.Element;
  addNewNestedFieldBtn: WebdriverIO.Element;
  editChecklistBtn: WebdriverIO.Element;
  deleteChecklistBtn: WebdriverIO.Element;
  fields: ChecklistFieldRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  async load() {
    this.element = await $(`#checkList_${this.index}`);
    if (this.element) {
      this.moveBtn = await this.element.$('#moveBtn');
      this.addNewNestedChecklistBtn = await this.element.$(
        `#addNewNestedChecklist${this.index}`
      );
      this.addNewNestedFieldBtn = await this.element.$(
        `#addNewNestedField${this.index}`
      );
      this.editChecklistBtn = await this.element.$(
        `#editChecklistBtn${this.index}`
      );
      this.deleteChecklistBtn = await this.element.$(
        `#deleteChecklistBtn${this.index}`
      );
      for (
        let i = 0;
        i <
        (await this.element.$$(`#fields_${this.index}>app-visual-editor-field`))
          .length;
        i++
      ) {
        const clfRow = new ChecklistFieldRowObj(i, false, this.index, true);
        this.fields.push(await clfRow.loadData());
      }
      const selectedLanguages = await eformVisualEditorPage.selectedLanguages();
      await this.openEditModal();
      for (let i = 0; i < selectedLanguages.length; i++) {
        const translation: CommonTranslationsModel = {
          languageId: selectedLanguages[i],
          name: '',
          description: '',
          id: null,
        };
        translation.name = await (
          await $(`#newChecklistNameTranslation_${selectedLanguages[i]}`)
        ).getValue();
        translation.description = await (
          await $(
            `#newChecklistDescriptionTranslation_${selectedLanguages[i]} .NgxEditor__Content`
          )
        ).getText();
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
    await (await eformVisualEditorPage.fieldDeleteCancelBtn()).waitForClickable(
      {
        timeout: 40000,
      }
    );
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (await eformVisualEditorPage.checklistDeleteCancelBtn()).click();
    } else {
      await (await eformVisualEditorPage.checklistDeleteDeleteBtn()).click();
    }
    await (await eformVisualEditorPage.manageTags()).waitForClickable({
      timeout: 40000,
    });
  }

  async edit(translations?: CommonTranslationsModel[], clickCancel = false) {
    await this.openEditModal(translations);
    await this.closeEditModal(clickCancel);
  }

  async openEditModal(translations?: CommonTranslationsModel[]) {
    await this.editChecklistBtn.click();
    await (
      await eformVisualEditorPage.changeChecklistSaveCancelBtn()
    ).waitForClickable({
      timeout: 40000,
    });
    if (translations) {
      for (let i = 0; i < translations.length; i++) {
        await (await $(`#newChecklistNameTranslation_${i}`)).setValue(
          translations[i].name
        );
        await (
          await $(
            `#newChecklistDescriptionTranslation_${i} .NgxEditor__Content`
          )
        ).setValue(translations[i].description);
      }
    }
  }

  async closeEditModal(clickCancel: boolean) {
    if (clickCancel) {
      await (
        await eformVisualEditorPage.changeChecklistSaveCancelBtn()
      ).click();
    } else {
      await (await eformVisualEditorPage.changeChecklistSaveBtn()).click();
    }
    await (await eformVisualEditorPage.manageTags()).waitForClickable({
      timeout: 40000,
    });
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
