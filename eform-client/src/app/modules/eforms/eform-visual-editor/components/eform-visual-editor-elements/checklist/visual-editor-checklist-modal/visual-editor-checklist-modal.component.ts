import { Component, Input, OnInit, inject } from '@angular/core';
import {
  EformVisualEditorModel,
  EformVisualEditorRecursionChecklistModel, LanguagesModel,
} from 'src/app/common/models';
import { fixTranslations } from 'src/app/common/helpers';
import * as R from 'ramda';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {TranslationRequestModel, TranslationService} from 'src/app/common/services';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormattingTextEditorComponent } from '../../../../../../../common/modules/eform-imported/formatting-text-editor/formatting-text-editor.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-visual-editor-checklist-modal',
    templateUrl: './visual-editor-checklist-modal.component.html',
    styleUrls: ['./visual-editor-checklist-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgFor, NgIf, MatCard, MatCardHeader, MatCardContent, MatIconButton, MatIcon, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, FormattingTextEditorComponent, MatDialogActions, TranslatePipe]
})
export class VisualEditorChecklistModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<VisualEditorChecklistModalComponent>>(MatDialogRef);
  private translationService = inject(TranslationService);

  selectedLanguages: number[];
  recursionModel: EformVisualEditorRecursionChecklistModel = new EformVisualEditorRecursionChecklistModel();
  isChecklistSelected = false;
  @Input() appLanguages: LanguagesModel = new LanguagesModel();
  translationPossible = false;

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  constructor() {
    const model = inject<{
    selectedLanguages: number[];
    model?: EformVisualEditorRecursionChecklistModel;
    appLanguages: LanguagesModel;
    translationPossible: boolean;
}>(MAT_DIALOG_DATA);

    this.translationPossible = model.translationPossible;
    this.selectedLanguages = model.selectedLanguages;
    this.appLanguages = model.appLanguages;
    if (model.model) {
      this.recursionModel = R.clone(model.model);
      this.isChecklistSelected = false;
    }
    if (model.model && model.model.checklist) {
      this.isChecklistSelected = true;

      // if there are not enough translations
      this.recursionModel.checklist.translations = fixTranslations(
        this.recursionModel.checklist.translations, this.appLanguages
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
    for (const language of this.appLanguages.languages) {
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

  getLanguage(languageId: number): any {
    return this.languages.find((x) => x.id === languageId);
  }

  translateFromEnglishTo(targetLanguageId: number) {
    const englishLanguageId = this.appLanguages.languages.find(x => x.name === 'Dansk').id;
    this.translationService.getTranslation(new TranslationRequestModel({
      sourceText: this.recursionModel.checklist.translations.find(x => x.languageId === englishLanguageId).name,
      sourceLanguageCode: 'da',
      targetLanguageCode: this.languages.find(x => x.id === targetLanguageId).languageCode,
    })).subscribe((operationDataResult) => {
      if (operationDataResult && operationDataResult.success) {
        this.recursionModel.checklist.translations.find(x => x.languageId === targetLanguageId).name = operationDataResult.model;
      }
    });
  }


  hide(result = false, model?: EformVisualEditorRecursionChecklistModel, create?: boolean) {
    this.dialogRef.close({result: result, create: create, model: result ? model : null});
  }
}
