import { Component, Input} from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-checkbox',
    templateUrl: './element-checkbox.component.html',
    styleUrls: ['./element-checkbox.component.scss'],
    standalone: false
})
export class ElementCheckboxComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  isChecked: boolean;

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
    if (val) {
      this.isChecked = val.value === 'checked' || val.value === '1';
    } else {
      this.isChecked = false;
    }
  }

  constructor() {}

  checkBoxChanged(e: any) {
    if (e.target && e.target.checked) {
      this.isChecked = true;
      this.fieldValueObj.value = '1';
    } else if (e.target && !e.target.checked) {
      this.isChecked = false;
      this.fieldValueObj.value = '0';
    } else {
      return;
    }
    this.fieldValue = this.fieldValueObj;
  }
}
