import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { applicationLanguages } from 'src/app/common/const';
import {
  EformVisualEditorModel,
  EformVisualEditorRecursionChecklistModel,
} from 'src/app/common/models';
import { fixTranslations } from 'src/app/common/helpers';
import * as R from 'ramda';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-visual-editor-checklist-modal',
  templateUrl: './visual-editor-checklist-modal.component.html',
  styleUrls: ['./visual-editor-checklist-modal.component.scss'],
})
export class VisualEditorChecklistModalComponent implements OnInit {
  selectedLanguages: number[];
  recursionModel: EformVisualEditorRecursionChecklistModel = new EformVisualEditorRecursionChecklistModel();
  isChecklistSelected = false;

  get languages() {
    return applicationLanguages;
  }

  constructor(
    public dialogRef: MatDialogRef<VisualEditorChecklistModalComponent>,
    @Inject(MAT_DIALOG_DATA) model: {selectedLanguages: number[], model?: EformVisualEditorRecursionChecklistModel }
  ) {
    this.selectedLanguages = model.selectedLanguages;
    if (model.model) {
      this.recursionModel = R.clone(model.model);
      this.isChecklistSelected = false;
    }
    if (model.model && model.model.checklist) {
      this.isChecklistSelected = true;

      // if there are not enough translations
      this.recursionModel.checklist.translations = fixTranslations(
        this.recursionModel.checklist.translations
      );
    } else {
      if (!model.model) {
        this.isChecklistSelected = false;
        this.recursionModel = new EformVisualEditorRecursionChecklistModel();
      }
      this.initForm();
    }
  }

  ngOnInit() {
    // this.selectedLanguage = applicationLanguages.find(
    //   (x) => x.locale === this.localeService.getCurrentUserLocale()
    // ).id;
  }

  // get isAllNamesEmpty() {
  //   return !this.recursionModel.checklist.translations.find(
  //     (x) => x.name !== ''
  //   );
  // }

  initForm() {
    this.recursionModel.checklist = new EformVisualEditorModel();
    for (const language of applicationLanguages) {
      this.recursionModel.checklist.translations = [
        ...this.recursionModel.checklist.translations,
        { id: null, languageId: language.id, description: '', name: '' },
      ];
    }
  }

  onCreateChecklist() {
    this.hide(true, this.recursionModel, true);
  }

  onUpdateChecklist() {
    this.hide(true, this.recursionModel, false);
  }

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): string {
    return this.languages.find((x) => x.id === languageId).text;
  }

  hide(result = false, model?: EformVisualEditorRecursionChecklistModel, create?: boolean) {
    this.dialogRef.close({result: result, create: create, model: result ? model : null});
  }
}
