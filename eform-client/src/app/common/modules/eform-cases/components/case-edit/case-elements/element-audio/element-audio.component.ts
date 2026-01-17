import { Component, Input} from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormattingTextEditorComponent } from '../../../../../eform-imported/formatting-text-editor/formatting-text-editor.component';
import { AuthAudioPipe, SafeHtmlPipe } from 'src/app/common/pipes';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-audio',
    templateUrl: './element-audio.component.html',
    styleUrls: ['./element-audio.component.scss'],
    imports: [NgFor, NgIf, FormattingTextEditorComponent, AuthAudioPipe, SafeHtmlPipe, AsyncPipe]
})
export class ElementAudioComponent {
  fieldValueObjects: Array<FieldValueDto> = [];

  @Input()
  get fieldValues() {
    return this.fieldValueObjects;
  }

  set fieldValues(val) {
    this.fieldValueObjects = val;
  }

  constructor() {}
}
