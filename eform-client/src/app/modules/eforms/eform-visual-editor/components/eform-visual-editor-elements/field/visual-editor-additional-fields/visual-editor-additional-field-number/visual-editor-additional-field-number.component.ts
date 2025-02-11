import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {EformVisualEditorFieldModel, LanguagesModel} from 'src/app/common/models';

@Component({
    selector: 'app-visual-editor-additional-field-number',
    templateUrl: './visual-editor-additional-field-number.component.html',
    styleUrls: ['./visual-editor-additional-field-number.component.scss'],
    standalone: false
})
export class VisualEditorAdditionalFieldNumberComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];
  @Input() appLanguages: LanguagesModel = new LanguagesModel();

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): any {
    return this.languages.find((x) => x.id === languageId);
  }
}
