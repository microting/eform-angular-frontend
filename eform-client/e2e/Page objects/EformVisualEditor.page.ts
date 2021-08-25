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

  get checkListCountAll(): number {
    return $$('[id^="checkListSection"]').length;
  }
  get checkListCountOnFirsLevel(): number {
    return $$('#editorChecklists > app-visual-editor-checklist').length;
  }

  get fieldsCountOnFirsLevel(): number {
    return $$('[id*=field_]').length;
  }

  get eformsVisualEditor() {
    const ele = $('#eformsVisualEditor');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get manageTags() {
    const ele = $('#manageTags');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get saveCreateEformBtn() {
    const ele = $('#saveCreateEformBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get expandAllBtn() {
    const ele = $('#expandAllBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get collapseAllBtn() {
    const ele = $('#collapseAllBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get initialFieldCreateBtn() {
    const ele = $('#initialFieldCreateBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get initialChecklistCreateBtn() {
    const ele = $('#initialChecklistCreateBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get checklistDeleteDeleteBtn() {
    const ele = $('#checklistDeleteDeleteBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get checklistDeleteCancelBtn() {
    const ele = $('#checklistDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get mainCheckListNameTranslation() {
    const ele = $('[id^="mainCheckListNameTranslation_"]');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  mainCheckListNameTranslationByLanguageId(languageId: number) {
    const ele = $(`#mainCheckListNameTranslation_${languageId}`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get mainCheckListDescriptionTranslation() {
    const ele = $('[id^="mainCheckListDescriptionTranslation_"]');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  mainCheckListDescriptionTranslationByLanguageId(languageId: number) {
    const ele = $(`#mainCheckListDescriptionTranslation_${languageId}`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get mainCheckListTagsSelector() {
    const ele = $('#mainCheckListTagsSelector');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get changeFieldSaveBtn() {
    const ele = $('#changeFieldSaveBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get fieldTypeSelector() {
    const ele = $('#fieldTypeSelector');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get changeFieldSaveCancelBtn() {
    const ele = $('#changeFieldSaveCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get fieldDeleteDeleteBtn() {
    const ele = $('#fieldDeleteDeleteBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  get fieldDeleteCancelBtn() {
    const ele = $('#fieldDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  goToVisualEditor() {
    this.eformsVisualEditor.click();
    this.manageTags.waitForClickable({ timeout: 40000 });
  }

  createVisualTemplate(checklist: ChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          this.clickLanguageCheckbox(true, i);
          this.mainCheckListNameTranslationByLanguageId(i).setValue(
            checklist.translations[i].name
          );
          $(`#mainCheckListDescriptionTranslation_${i} .pell-content`).setValue(
            checklist.translations[i].description
          );
        }
      }
      if (checklist.tags) {
        for (let i = 0; i < checklist.tags.length; i++) {
          this.mainCheckListTagsSelector.$('input').setValue(checklist.tags[i]);
          const option = this.mainCheckListTagsSelector.$('.ng-option');
          option.waitForDisplayed({ timeout: 40000 });
          option.click();
        }
      }
      if (checklist.fields) {
        for (let i = 0; i < checklist.fields.length; i++) {
          this.createVisualTemplateField(checklist.fields[i]);
        }
      }
    }
    if (clickSave) {
      this.clickSave();
    }
  }

  createVisualTemplateField(
    checklistFieldObj: ChecklistFieldObj,
    clickCancel = false,
    addNewNestedFieldBtn: WebdriverIO.Element = null
  ) {
    this.openVisualTemplateFieldCreateModal(
      checklistFieldObj,
      addNewNestedFieldBtn
    );
    this.closeVisualTemplateFieldCreateModal(clickCancel);
  }

  openVisualTemplateFieldCreateModal(
    checklistFieldObj: ChecklistFieldObj,
    addNewNestedFieldBtn: WebdriverIO.Element = null
  ) {
    if (checklistFieldObj) {
      if (!addNewNestedFieldBtn) {
        this.initialFieldCreateBtn.click();
      } else {
        addNewNestedFieldBtn.click();
      }
      this.changeFieldSaveCancelBtn.waitForClickable({ timeout: 40000 });
      if (checklistFieldObj.translations) {
        for (let i = 0; i < checklistFieldObj.translations.length; i++) {
          $(`#fieldNameTranslation_${i}`).setValue(
            checklistFieldObj.translations[i].name
          );
          $(`#newFieldDescriptionTranslation_${i} .pell-content`).setValue(
            checklistFieldObj.translations[i].description
          );
        }
      }
      if (checklistFieldObj.type) {
        this.fieldTypeSelector
          .$('input')
          .setValue(EformFieldTypesEnum[checklistFieldObj.type]);
        const option = this.fieldTypeSelector.$('.ng-option');
        option.waitForDisplayed({ timeout: 40000 });
        option.click();
      }

      // pdf type
      if (
        checklistFieldObj.pathToFiles &&
        checklistFieldObj.pathToFiles.length > 0
      ) {
        for (let i = 0; i < checklistFieldObj.pathToFiles.length; i++) {
          const file = browser.uploadFile(checklistFieldObj.pathToFiles[i]);
          $(`#pdfInput${i}`).addValue(file);
        }
      }

      // number type
      if (checklistFieldObj.minValue) {
        $('#minValueEdit').setValue(checklistFieldObj.minValue);
      }
      if (checklistFieldObj.maxValue) {
        $('#maxValueEdit').setValue(checklistFieldObj.maxValue);
      }
      if (checklistFieldObj.defaultValue) {
        $('#defaultValueEdit').setValue(checklistFieldObj.defaultValue);
      }
      if (checklistFieldObj.decimalCount) {
        $('#decimalCountEdit').setValue(checklistFieldObj.decimalCount);
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
        $('#isChecked').$('..').click();
      }
    }
  }

  closeVisualTemplateFieldCreateModal(clickCancel = false) {
    if (clickCancel) {
      this.changeFieldSaveCancelBtn.click();
    } else {
      this.changeFieldSaveBtn.click();
    }
    this.manageTags.waitForClickable({ timeout: 40000 });
  }

  clickSave() {
    this.saveCreateEformBtn.click();
    myEformsPage.newEformBtn.waitForClickable({ timeout: 40000 });
  }

  openAllLanguages() {
    for (let i = 0; i < applicationLanguages.length; i++) {
      this.clickLanguageCheckbox(true, i);
    }
  }

  clickLanguageCheckbox(value: boolean, index: number) {
    const checkbox = $(`#languageCheckbox${index}`);
    if (checkbox.getValue() !== value.toString()) {
      checkbox.$('..').click();
    }
  }
}

const eformVisualEditorPage = new EformVisualEditorPage();
export default eformVisualEditorPage;

export class MainCheckListRowObj {
  constructor(openAllLanguages = false) {
    if (openAllLanguages) {
      eformVisualEditorPage.openAllLanguages();
    }
    const countField = eformVisualEditorPage.fieldsCountOnFirsLevel;
    for (let i = 0; i < countField; i++) {
      this.fields.push(new ChecklistFieldRowObj(i));
    }
    for (let i = 0; i < applicationLanguages.length; i++) {
      const checkbox = $(`#languageCheckbox${i}`);
      if (checkbox.getValue() !== false.toString()) {
        this.translations.push({
          languageId: i,
          name: $(`#mainCheckListNameTranslation_${i}`).getValue(),
          description: $(
            `#mainCheckListDescriptionTranslation_${i} .pell-content`
          ).getText(),
          id: null,
        });
      }
    }
  }
  fields: ChecklistFieldRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  edit(checklist: ChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          const checkbox = $(`#languageCheckbox${i}`);
          if (checkbox.getValue() === false.toString()) {
            checkbox.$('..').click();
          }
          $(`#mainCheckListNameTranslation_${i}`).setValue(
            checklist.translations[i].name
          );
          $(`#mainCheckListDescriptionTranslation_${i} .pell-content`).setValue(
            checklist.translations[i].description
          );
        }
      }
      if (checklist.tags) {
        for (let i = 0; i < checklist.tags.length; i++) {
          eformVisualEditorPage.mainCheckListTagsSelector
            .$('input')
            .setValue(checklist.tags[i]);
          const option = eformVisualEditorPage.mainCheckListTagsSelector.$(
            '.ng-option'
          );
          option.waitForDisplayed({ timeout: 40000 });
          option.click();
        }
      }
    }
    if (clickSave) {
      eformVisualEditorPage.clickSave();
    }
  }
}

export class ChecklistFieldRowObj {
  constructor(index: number, isNested = false, fieldIndex = 0) {
    if (isNested) {
      this.element = $$(
        `#field_${fieldIndex} #nestedFields app-visual-editor-field`
      )[index];
    } else {
      this.element = $(`#field_${index}`);
    }
    if (this.element) {
      const str: string[] = this.element
        .$('.col-6')
        .getText()
        .replace('drag_handle ', '') // delete not need word
        .split('; '); // split name and type
      this.name = str[0];
      this.type = EformFieldTypesEnum[str[1]];
      this.deleteBtn = this.element.$('#deleteBtn');
      this.editBtn = this.element.$('#editBtn');
      this.copyBtn = this.element.$('#copyBtn');
      this.fieldIsNotComplete = !!this.element.$('#isNotFieldComplete');
      const backgroundColor = this.element
        .$('div>div')
        .getCSSProperty('background-color').parsed.hex;
      this.color = eformVisualEditorElementColors.find(
        (x) => x.name === backgroundColor.replace('#', '')
      );
      const colorMas = this.element.$$('#colors >*');
      this.colorsBtn = {
        standard: colorMas[0],
        green: colorMas[1],
        blue: colorMas[2],
        yellow: colorMas[3],
        red: colorMas[4],
        grey: colorMas[5],
      };
      if (this.type === EformFieldTypesEnum.FieldGroup) {
        this.addNestedFieldBtn = this.element.$('#addNewNestedField');
        this.collapseToggleBtn = this.element.$('#collapseToggleBtn');
        this.nestedFields = [];
        for (
          let i = 0;
          i < this.element.$$('#nestedFields app-visual-editor-field').length;
          i++
        ) {
          this.nestedFields.push(new ChecklistFieldRowObj(i, true, index));
        }
      }
    }
  }
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

  changeColor(colorName: string) {
    this.colorsBtn[colorName].click();
  }

  makeCopy() {
    this.copyBtn.click();
  }

  addNewNestedField(checklistFieldObj: ChecklistFieldObj) {
    eformVisualEditorPage.createVisualTemplateField(
      checklistFieldObj,
      false,
      this.addNestedFieldBtn
    );
  }

  collapseToggle() {
    this.collapseToggleBtn.click();
  }

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }

  openDeleteModal() {
    this.deleteBtn.click();
    eformVisualEditorPage.fieldDeleteCancelBtn.waitForClickable({
      timeout: 40000,
    });
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      eformVisualEditorPage.fieldDeleteCancelBtn.click();
    } else {
      eformVisualEditorPage.fieldDeleteDeleteBtn.click();
    }
    eformVisualEditorPage.manageTags.waitForClickable({ timeout: 40000 });
  }
}

export class ChecklistObj {
  translations: CommonTranslationsModel[];
  tags: string[];
  fields: ChecklistFieldObj[];
}

export class ChecklistFieldObj {
  translations: CommonTranslationsModel[];
  type: EformFieldTypesEnum;
  mandatory?: boolean;
  pathToFiles?: string[];
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  decimalCount?: number;
}
