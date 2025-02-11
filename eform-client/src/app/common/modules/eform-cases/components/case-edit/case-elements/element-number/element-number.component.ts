import {Component, Input} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-number',
    templateUrl: './element-number.component.html',
    styleUrls: ['./element-number.component.scss'],
    standalone: false
})
export class ElementNumberComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  @Input()
  get fieldValue() {
    debugger;
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
    this.fieldValueObj.value = val.value.replace('.', ',');
  }

  constructor() {
  }

  validateInput(e) {
    e.target.value = this.removeNonNumeric(e.target.value);
  }

  removeNonNumeric(str: string) {
    //Remove all none numeric characters except one comma
    let newString = str.replace(/[^0-9,]/g, '');
    //Check if there's more than one comma in the string
    if (newString.match(/,/g) !== null) {
      if (newString.match(/,/g).length > 1) {
        newString = this.fieldValueObj.value;
      } else {
        this.fieldValueObj.value = newString;
      }
    } else {
      this.fieldValueObj.value = newString;
    }
    return newString;
  }
}
