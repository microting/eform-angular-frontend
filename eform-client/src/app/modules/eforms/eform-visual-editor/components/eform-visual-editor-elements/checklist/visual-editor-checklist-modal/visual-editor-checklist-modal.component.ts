import {
  Component,
  Inject, Input,
  OnInit,
} from '@angular/core';
import {
  EformVisualEditorModel,
  EformVisualEditorRecursionChecklistModel, LanguagesModel,
} from 'src/app/common/models';
import { fixTranslations } from 'src/app/common/helpers';
import * as R from 'ramda';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslationRequestModel, TranslationService} from 'src/app/common/services';

@Component({
  selector: 'app-visual-editor-checklist-modal',
  templateUrl: './visual-editor-checklist-modal.component.html',
  styleUrls: ['./visual-editor-checklist-modal.component.scss'],
})
export class VisualEditorChecklistModalComponent implements OnInit {
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

  constructor(
    public dialogRef: MatDialogRef<VisualEditorChecklistModalComponent>,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) model: {selectedLanguages: number[], model?: EformVisualEditorRecursionChecklistModel, appLanguages: LanguagesModel, translationPossible: boolean }
  ) {
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
