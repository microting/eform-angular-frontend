import {Component, Input} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-text',
    templateUrl: './element-text.component.html',
    styleUrls: ['./element-text.component.scss'],
    standalone: false
})
export class ElementTextComponent  {
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
