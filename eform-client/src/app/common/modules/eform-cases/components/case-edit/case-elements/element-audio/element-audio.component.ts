import { Component, Input} from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-audio',
    templateUrl: './element-audio.component.html',
    styleUrls: ['./element-audio.component.scss'],
    standalone: false
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
