import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CommonDictionaryModel,
  EformVisualEditorModel, LanguagesModel,
} from 'src/app/common/models';
import {AuthStateService} from 'src/app/common/store';

@Component({
  selector: 'app-eform-visual-editor-header',
  templateUrl: './eform-visual-editor-header.component.html',
  styleUrls: ['./eform-visual-editor-header.component.scss'],
})
export class EformVisualEditorHeaderComponent implements OnInit {
  @Input()
  visualEditorModel: EformVisualEditorModel = new EformVisualEditorModel();
  @Input() selectedLanguages: number[];
  @Input() availableTags: CommonDictionaryModel[];
  @Output() addOrDeleteLanguage: EventEmitter<number> = new EventEmitter();
  @Input() appLanguages: LanguagesModel = new LanguagesModel();

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
  }

  onAddOrDeleteLanguage(languageId: number) {
    this.addOrDeleteLanguage.emit(languageId);
  }

  getLanguage(languageId: number): string {
    return this.languages.find((x) => x.id === languageId).name;
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
}
