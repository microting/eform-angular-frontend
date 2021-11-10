import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EformVisualEditorFieldModel } from 'src/app/common/models';
import { applicationLanguages } from 'src/app/common/const';

@Component({
  selector: 'app-visual-editor-additional-field-save-button',
  templateUrl: './visual-editor-additional-field-save-button.component.html',
  styleUrls: ['./visual-editor-additional-field-save-button.component.scss'],
})
export class VisualEditorAdditionalFieldSaveButtonComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): string {
    return applicationLanguages.find((x) => x.id === languageId).text;
  }
}
