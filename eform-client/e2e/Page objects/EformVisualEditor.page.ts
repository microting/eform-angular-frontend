// noinspection JSIgnoredPromiseFromCall

import { PageWithNavbarPage } from './PageWithNavbar.page';
import {
  applicationLanguages,
  EformFieldTypesEnum,
} from '../../src/app/common/const';
import { CommonTranslationsModel } from '../../src/app/common/models';
import myEformsPage from './MyEforms.page';

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

  goToVisualEditor() {
    this.eformsVisualEditor.click();
    this.saveCreateEformBtn.waitForClickable({ timeout: 40000 });
  }

  createVisualTemplate(checklist: ChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
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
      this.saveCreateEformBtn.click();
      myEformsPage.newEformBtn.waitForClickable({ timeout: 40000 });
    }
  }

  createVisualTemplateField(
    checklistFieldObj: ChecklistFieldObj,
    clickCancel = false
  ) {
    if (checklistFieldObj) {
      this.initialFieldCreateBtn.click();
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
      if (clickCancel) {
        this.changeFieldSaveCancelBtn.click();
      } else {
        this.changeFieldSaveBtn.click();
      }
      this.saveCreateEformBtn.waitForClickable({ timeout: 40000 });
    }
  }
}

const eformVisualEditorPage = new EformVisualEditorPage();
export default eformVisualEditorPage;

export class MainCheckListRowObj {
  constructor() {
    const countField = eformVisualEditorPage.fieldsCountOnFirsLevel;
    for (let i = 0; i < countField; i++) {
      this.fields.push(new ChecklistFieldRowObj(i));
    }
    for (let i = 0; i < applicationLanguages.length; i++) {
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
  fields: ChecklistFieldRowObj[] = [];
  translations: CommonTranslationsModel[] = [];

  edit(checklist: ChecklistObj, clickSave = false) {
    if (checklist) {
      if (checklist.translations) {
        for (let i = 0; i < checklist.translations.length; i++) {
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
      eformVisualEditorPage.saveCreateEformBtn.click();
      myEformsPage.newEformBtn.waitForClickable({ timeout: 40000 });
    }
  }
}

export class ChecklistFieldRowObj {
  constructor(index: number, isNested = false) {
    let element: WebdriverIO.Element;
    if (isNested) {
      element = $$('#nestedFields')[index];
    } else {
      element = $(`#field_${index}`);
    }
    if (element) {
      const str: string[] = element
        .getText()
        .replace('drag_handle ', '') // delete not need word
        .split('; '); // split name and type
      this.name = str[0];
      this.type = EformFieldTypesEnum[str[1]];
      this.deleteBtn = element.$('#deleteBtn');
      this.editBtn = element.$('#editBtn');
      this.copyBtn = element.$('#copyBtn');
      this.fieldIsNotComplete = !!element.$('fa-icon');
    }
  }
  name: string;
  type: EformFieldTypesEnum;
  deleteBtn: WebdriverIO.Element;
  editBtn: WebdriverIO.Element;
  copyBtn: WebdriverIO.Element;
  fieldIsNotComplete: boolean;
}

export class ChecklistObj {
  translations: CommonTranslationsModel[];
  tags: string[];
  fields: ChecklistFieldObj[];
}

export class ChecklistFieldObj {
  translations: CommonTranslationsModel[];
  type: EformFieldTypesEnum;
  mandatory: boolean;
}
