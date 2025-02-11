import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CommonDictionaryModel,
  EformVisualEditorModel, LanguagesModel,
} from 'src/app/common/models';
import {AuthStateService} from 'src/app/common/store';
import {TranslationRequestModel, TranslationService} from 'src/app/common/services/translation.service';

@Component({
    selector: 'app-eform-visual-editor-header',
    templateUrl: './eform-visual-editor-header.component.html',
    styleUrls: ['./eform-visual-editor-header.component.scss'],
    standalone: false
})
export class EformVisualEditorHeaderComponent implements OnInit {
  @Input()
  visualEditorModel: EformVisualEditorModel = new EformVisualEditorModel();
  @Input() selectedLanguages: number[];
  @Input() availableTags: CommonDictionaryModel[];
  @Output() addOrDeleteLanguage: EventEmitter<number> = new EventEmitter();
  @Input() appLanguages: LanguagesModel = new LanguagesModel();
  @Input() translationPossible: boolean;

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  constructor(private authStateService: AuthStateService,
              private translationService: TranslationService) {}

  ngOnInit() {
  }

  onAddOrDeleteLanguage(languageId: number) {
    this.addOrDeleteLanguage.emit(languageId);
  }

  getLanguage(languageId: number): any {
    const language = this.languages.find((x) => x.id === languageId);
    return language;
  }

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  displayCheckbox(languageId: number): boolean {
    // const languageIdsForDisplayCheckboxOnlyAdmins = [this.languages.find(x => x.name === 'German').id];
    // if(languageIdsForDisplayCheckboxOnlyAdmins.includes(languageId)){
    //   return this.authStateService.isAdmin;
    // }
    return true;
  }

  translateFromEnglishTo(targetLanguageId: number) {
    const englishLanguageId = this.appLanguages.languages.find(x => x.name === 'Dansk').id;
    this.translationService.getTranslation(new TranslationRequestModel({
      sourceText: this.visualEditorModel.translations.find(x => x.languageId === englishLanguageId).name,
      sourceLanguageCode: 'da',
      targetLanguageCode: this.languages.find(x => x.id === targetLanguageId).languageCode,
    })).subscribe((operationDataResult) => {
      if (operationDataResult && operationDataResult.success) {
        this.visualEditorModel.translations.find(x => x.languageId === targetLanguageId).name = operationDataResult.model;
      }
    });
  }
}
