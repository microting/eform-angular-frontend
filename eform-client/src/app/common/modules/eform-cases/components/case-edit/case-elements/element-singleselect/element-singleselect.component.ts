import {Component, Input} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';
import { NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-singleselect',
    templateUrl: './element-singleselect.component.html',
    styleUrls: ['./element-singleselect.component.scss'],
    imports: [NgIf, MatFormField, MatLabel, MtxSelect]
})
export class ElementSingleselectComponent {
  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }
  fieldValueObj: FieldValueDto = new FieldValueDto();
  constructor() { }

  onSelectedChanged(e: any) {
    this.fieldValue.value = e.key;
  }

}
