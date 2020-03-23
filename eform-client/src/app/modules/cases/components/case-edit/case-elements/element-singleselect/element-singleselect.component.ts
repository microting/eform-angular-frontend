import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FieldValueDto} from 'src/app/common/models';
import {CommonDictionaryTextModel} from 'src/app/common/models/common';

@Component({
  selector: 'element-singleselect',
  templateUrl: './element-singleselect.component.html',
  styleUrls: ['./element-singleselect.component.scss']
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
