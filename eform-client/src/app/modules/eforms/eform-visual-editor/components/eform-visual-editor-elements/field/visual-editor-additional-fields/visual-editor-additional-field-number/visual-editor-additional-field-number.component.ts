import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EformVisualEditorFieldModel } from 'src/app/common/models';
import { applicationLanguages } from 'src/app/common/const';

@Component({
  selector: 'app-visual-editor-additional-field-number',
  templateUrl: './visual-editor-additional-field-number.component.html',
  styleUrls: ['./visual-editor-additional-field-number.component.scss'],
})
export class VisualEditorAdditionalFieldNumberComponent
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
