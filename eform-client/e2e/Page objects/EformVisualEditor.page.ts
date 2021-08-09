// noinspection JSIgnoredPromiseFromCall

import { PageWithNavbarPage } from './PageWithNavbar.page';
import { EformFieldTypesEnum } from '../../src/app/common/const';
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
    return $$('#editorFields > app-visual-editor-field').length;
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

  get mainCheckListLanguageSelector() {
    const ele = $('#mainCheckListLanguageSelector');
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
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

  get newFieldLanguageSelector() {
    const ele = $('#newFieldLanguageSelector');
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
          // const languageCheckbox = $(
          //   `#languageCheckbox${checklist.translations[i].languageId}`
          // );
          // if (languageCheckbox.getValue() !== 'true') {
          //   languageCheckbox.setValue(`true`);
          // }
          $(
            `#mainCheckListNameTranslation_${checklist.translations[i].languageId}`
          ).setValue(checklist.translations[i].name);
          $(
            `#mainCheckListDescriptionTranslation_${checklist.translations[i].languageId} .pell-content`
          ).setValue(checklist.translations[i].description);
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
          $(
            `#fieldNameTranslation_${checklistFieldObj.translations[i].languageId}`
          ).setValue(checklistFieldObj.translations[i].name);
          $(
            `#newFieldDescriptionTranslation_${checklistFieldObj.translations[i].languageId} .pell-content`
          ).setValue(checklistFieldObj.translations[i].description);
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

export class CheckListRowObj {
  constructor(rowNum) {
    const element = $(`checkList_${rowNum - 1}`);
    if (element) {
      try {
        this.folderElement = element.$('#folderTreeId');
      } catch (e) {}
      try {
        this.name = element.$('#folderTreeName').getText();
      } catch (e) {}
      // try {
      //   this.description = element.$('#folderTreeDescription').getText();
      // } catch (e) {
      // }
      this.folderTreeOpenClose = element.$('#folderTreeOpenClose');
      this.editBtn = this.folderElement.$('#editFolderTreeBtn');
      this.deleteBtn = this.folderElement.$('#deleteFolderTreeBtn');
      this.createFolderChildBtn = this.folderElement.$('#createFolderChildBtn');
    }
  }

  folderElement;
  name;
  // description;
  editBtn;
  deleteBtn;
  createFolderChildBtn;
  folderTreeOpenClose;
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
