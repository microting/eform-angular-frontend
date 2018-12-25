import {Component, Input, OnInit} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  selector: 'element-audio',
  templateUrl: './element-audio.component.html',
  styleUrls: ['./element-audio.component.scss']
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

  constructor() {
  }

}
