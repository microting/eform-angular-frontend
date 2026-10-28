import { Component, Input} from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';

export function isCheckboxValueChecked(fieldValue: FieldValueDto): boolean {
  return !!fieldValue && (fieldValue.value === 'checked' || fieldValue.value === '1');
}

/**
 * Flips a CheckBox field value between '1' and '0'. Used by the box itself and
 * by the surrounding field, so a click anywhere in the field toggles the tick.
 */
export function toggleCheckboxValue(fieldValue: FieldValueDto) {
  if (fieldValue) {
    fieldValue.value = isCheckboxValueChecked(fieldValue) ? '0' : '1';
  }
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-checkbox',
    templateUrl: './element-checkbox.component.html',
    styleUrls: ['./element-checkbox.component.scss']
})
export class ElementCheckboxComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  /** Id of the field's title, so the input is announced with it. */
  @Input() labelledBy?: string;

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  // Derived from the value, so a toggle from the surrounding field shows here too.
  get isChecked(): boolean {
    return isCheckboxValueChecked(this.fieldValueObj);
  }

  constructor() {}

  checkBoxChanged(e: any) {
    if (e.target && e.target.checked !== this.isChecked) {
      this.toggle();
    }
  }

  toggle() {
    toggleCheckboxValue(this.fieldValueObj);
  }
}
