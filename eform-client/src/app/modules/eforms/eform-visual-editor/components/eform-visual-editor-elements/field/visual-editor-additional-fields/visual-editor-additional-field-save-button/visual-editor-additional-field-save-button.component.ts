import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {EformVisualEditorFieldModel, LanguagesModel} from 'src/app/common/models';
import {TranslationRequestModel, TranslationService} from 'src/app/common/services';

@Component({
    selector: 'app-visual-editor-additional-field-save-button',
    templateUrl: './visual-editor-additional-field-save-button.component.html',
    styleUrls: ['./visual-editor-additional-field-save-button.component.scss'],
    standalone: false
})
export class VisualEditorAdditionalFieldSaveButtonComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];
  @Input() appLanguages: LanguagesModel = new LanguagesModel();
  @Input() translationPossible = false;

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  constructor(
    private translationService: TranslationService) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): any {
    return this.languages.find((x) => x.id === languageId);
  }

  translateFromEnglishTo(targetLanguageId: number) {
    const englishLanguageId = this.appLanguages.languages.find(x => x.name === 'Dansk').id;
    this.translationService.getTranslation(new TranslationRequestModel({
      sourceText: this.field.translations.find(x => x.languageId === englishLanguageId).defaultValue,
      sourceLanguageCode: 'da',
      targetLanguageCode: this.languages.find(x => x.id === targetLanguageId).languageCode,
    })).subscribe((operationDataResult) => {
      if (operationDataResult && operationDataResult.success) {
        this.field.translations.find(x => x.languageId === targetLanguageId).defaultValue = operationDataResult.model;
      }
    });
  }
}
