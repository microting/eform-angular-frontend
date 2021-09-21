import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { applicationLanguages } from 'src/app/common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorModel,
} from 'src/app/common/models';

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
  @Output() addOrDeleteLanguage: EventEmitter<{
    addTranslate: boolean;
    languageId: number;
  }> = new EventEmitter();

  get languages() {
    return applicationLanguages;
  }

  constructor() {}

  ngOnInit() {}

  onAddOrDeleteLanguage(addTranslate: boolean, languageId: number) {
    this.addOrDeleteLanguage.emit({ addTranslate, languageId });
  }

  getLanguage(languageId: number): string {
    return this.languages.find((x) => x.id === languageId).text;
  }

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }
}
