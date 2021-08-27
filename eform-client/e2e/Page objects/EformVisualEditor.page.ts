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

  get changeChecklistSaveCancelBtn() {
    const ele = $('#changeChecklistSaveCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get changeChecklistSaveBtn() {
    const ele = $('#changeChecklistSaveBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get selectedLanguages(): number[] {
    const selectedLanguages = [];
    for (let i = 0; i < applicationLanguages.length; i++) {
      const checkbox = $(`#languageCheckbox${i}`);
      if (checkbox.getValue() === true.toString()) {
        selectedLanguages.push(i);
      }
    }
    return selectedLanguages;
  }

  goToVisualEditor() {
    this.eformsVisualEditor.click();
    this.manageTags.waitForClickable({ timeout: 40000 });
  }

  createVisualTemplate(checklist: MainChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          this.clickLanguageCheckbox(true, i);
          this.mainCheckListNameTranslationByLanguageId(i).setValue(
            checklist.translations[i].name
          );
          this.mainCheckListDescriptionTranslationByLanguageId(i)
            .$(`.pell-content`)
            .setValue(checklist.translations[i].description);
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
      if (checklist.checklists) {
        for (let i = 0; i < checklist.checklists.length; i++) {
          this.createNestedVisualTemplate(checklist.checklists[i], i);
        }
      }
    }
    if (clickSave) {
      this.clickSave();
    }
  }

  createNestedVisualTemplate(
    checklist: MainChecklistObj,
    index: number
    /*, clickCancel = false*/
  ) {
    this.initialChecklistCreateBtn.click();
    this.changeChecklistSaveCancelBtn.waitForClickable({ timeout: 40000 });
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
          $(`#newChecklistNameTranslation_${i}`).setValue(
            checklist.translations[i].name
          );
          $(`#newChecklistDescriptionTranslation_${i} .pell-content`).setValue(
            checklist.translations[i].description
          );
        }
      }
      // if (clickCancel) {
      //   this.changeChecklistSaveCancelBtn.click();
      // } else {
      this.changeChecklistSaveBtn.click();
      // }
      this.manageTags.waitForClickable({ timeout: 40000 });
      if (checklist.fields) {
        for (let i = 0; i < checklist.fields.length; i++) {
          this.createVisualTemplateField(
            checklist.fields[i],
            false,
            $(`#addNewNestedField${index}`)
          ); // addNewNestedField0 - 0 it's index
        }
      }
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
    const countChecklist = eformVisualEditorPage.checkListCountAll;
    for (let i = 0; i < countChecklist; i++) {
      this.checklists.push(new ChecklistRowObj(i));
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
  checklists: ChecklistRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  edit(checklist: MainChecklistObj, clickSave = false) {
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

  collapseToggle() {
    eformVisualEditorPage.expandAllBtn.click();
    browser.pause(500);
  }
}

export class ChecklistFieldRowObj {
  constructor(
    index: number,
    isNested = false,
    fieldIndex = 0,
    isNestedInChecklist = false
  ) {
    if (isNested) {
      this.element = $$(
        `#field_${fieldIndex} #nestedFields app-visual-editor-field`
      )[index];
    } else if (isNestedInChecklist) {
      this.element = $$(`#fields_${fieldIndex}>app-visual-editor-field`)[index];
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
      this.moveFieldBtn = this.element.$('#moveFieldBtn');
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
  moveFieldBtn: WebdriverIO.Element;

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

  edit(field: ChecklistFieldObj, clickCancel = false) {
    this.openEditModal(field);
    this.closeEditModal(clickCancel);
  }

  openEditModal(field: ChecklistFieldObj) {
    eformVisualEditorPage.openVisualTemplateFieldCreateModal(
      field,
      this.editBtn
    );
  }

  closeEditModal(clickCancel = false) {
    if (clickCancel) {
      eformVisualEditorPage.changeFieldSaveCancelBtn.click();
    } else {
      eformVisualEditorPage.changeFieldSaveBtn.click();
    }
    eformVisualEditorPage.manageTags.waitForClickable({ timeout: 40000 });
  }

  changePosition(targetField: ChecklistFieldRowObj) {
    this.moveFieldBtn.dragAndDrop(targetField.element);
  }
}

export class ChecklistRowObj {
  constructor(index: number) {
    this.element = $(`#checkList_${index}`);
    if (this.element) {
      this.moveBtn = this.element.$('#moveBtn');
      this.addNewNestedChecklistBtn = this.element.$(
        `#addNewNestedChecklist${index}`
      );
      this.addNewNestedFieldBtn = this.element.$(`#addNewNestedField${index}`);
      this.editChecklistBtn = this.element.$(`#editChecklistBtn${index}`);
      this.deleteChecklistBtn = this.element.$(`#deleteChecklistBtn${index}`);
      for (
        let i = 0;
        i < this.element.$$(`#fields_${index}>app-visual-editor-field`).length;
        i++
      ) {
        this.fields.push(new ChecklistFieldRowObj(i, false, index, true));
      }
      const selectedLanguages = eformVisualEditorPage.selectedLanguages;
      this.openEditModal();
      for (let i = 0; i < selectedLanguages.length; i++) {
        const translation: CommonTranslationsModel = {
          languageId: selectedLanguages[i],
          name: '',
          description: '',
          id: null,
        };
        translation.name = $(
          `#newChecklistNameTranslation_${selectedLanguages[i]}`
        ).getValue();
        translation.description = $(
          `#newChecklistDescriptionTranslation_${selectedLanguages[i]} .pell-content`
        ).getText();
        this.translations.push(translation);
      }
      this.closeEditModal(true);
    }
  }
  element: WebdriverIO.Element;
  moveBtn: WebdriverIO.Element;
  addNewNestedChecklistBtn: WebdriverIO.Element;
  addNewNestedFieldBtn: WebdriverIO.Element;
  editChecklistBtn: WebdriverIO.Element;
  deleteChecklistBtn: WebdriverIO.Element;
  fields: ChecklistFieldRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }

  openDeleteModal() {
    this.deleteChecklistBtn.click();
    eformVisualEditorPage.fieldDeleteCancelBtn.waitForClickable({
      timeout: 40000,
    });
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      eformVisualEditorPage.checklistDeleteCancelBtn.click();
    } else {
      eformVisualEditorPage.checklistDeleteDeleteBtn.click();
    }
    eformVisualEditorPage.manageTags.waitForClickable({ timeout: 40000 });
  }

  edit(translations?: CommonTranslationsModel[], clickCancel = false) {
    this.openEditModal(translations);
    this.closeEditModal(clickCancel);
  }

  openEditModal(translations?: CommonTranslationsModel[]) {
    this.editChecklistBtn.click();
    eformVisualEditorPage.changeChecklistSaveCancelBtn.waitForClickable({
      timeout: 40000,
    });
    if (translations) {
      for (let i = 0; i < translations.length; i++) {
        $(`newChecklistNameTranslation_${i}`).setValue(translations[i].name);
        $(`newChecklistDescriptionTranslation_${i} .pell-content`).setValue(
          translations[i].description
        );
      }
    }
  }

  closeEditModal(clickCancel: boolean) {
    if (clickCancel) {
      eformVisualEditorPage.changeChecklistSaveCancelBtn.click();
    } else {
      eformVisualEditorPage.changeChecklistSaveBtn.click();
    }
    eformVisualEditorPage.manageTags.waitForClickable({ timeout: 40000 });
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
