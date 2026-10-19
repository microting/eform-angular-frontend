import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  CommonDictionaryModel,
  EformVisualEditorModel, LanguagesModel,
} from 'src/app/common/models';
import {AuthStateService} from 'src/app/common/store';
import {TranslationRequestModel, TranslationService} from 'src/app/common/services/translation.service';
import { MatCardContent, MatCard, MatCardHeader } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormattingTextEditorComponent } from '../../../../../../common/modules/eform-imported/formatting-text-editor/formatting-text-editor.component';
import { MtxSelect } from '@ng-matero/extensions/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-visual-editor-header',
    templateUrl: './eform-visual-editor-header.component.html',
    styleUrls: ['./eform-visual-editor-header.component.scss'],
    imports: [MatCardContent, NgFor, NgIf, MatCheckbox, ReactiveFormsModule, FormsModule, MatCard, MatCardHeader, MatIconButton, MatIcon, MatFormField, MatLabel, MatInput, FormattingTextEditorComponent, MtxSelect, MatSlideToggle, TranslatePipe]
})
export class EformVisualEditorHeaderComponent implements OnInit {
  private authStateService = inject(AuthStateService);
  private translationService = inject(TranslationService);

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
