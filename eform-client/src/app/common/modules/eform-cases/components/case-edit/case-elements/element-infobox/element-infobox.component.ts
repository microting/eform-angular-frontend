import {Component, Input, OnInit} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
    selector: 'element-infobox',
    templateUrl: './element-infobox.component.html',
    styleUrls: ['./element-infobox.component.scss'],
    standalone: false
})
export class ElementInfoboxComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {
  }

}
