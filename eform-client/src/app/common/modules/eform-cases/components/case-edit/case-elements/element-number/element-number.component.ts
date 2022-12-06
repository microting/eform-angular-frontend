import {Component, Input} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'element-number',
  templateUrl: './element-number.component.html',
  styleUrls: ['./element-number.component.scss']
})
export class ElementNumberComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  valid: boolean;
  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
    this.fieldValueObj.value = val.value.replace('.', ',');
  }

  constructor() {

  }

  validateInput(e) {
    const value = e.target.value + String.fromCharCode(e.keyCode);
    let rgx = /^(\d+,?(?:\d+,|\d*)+)$/;
    if (value.match(rgx)) {
      if (value.includes(',')) {
        rgx = /(,)/g;
        const b = value.match(rgx);
        this.valid = b.length <= 1;
        return;
      } else {
        this.valid = true;
        return;
      }
    } else {
      this.valid = false;
      return;
    }
  }
}
