import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'src/app/common/models/cases';

@Component({
  selector: 'element-audio',
  templateUrl: './element-audio.component.html',
  styleUrls: ['./element-audio.component.scss']
})
export class ElementAudioComponent {
  fieldValueObjects: Array<CaseFieldValue> = [];

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
