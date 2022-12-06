import {Component, Input, OnInit} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'element-multiselect',
  templateUrl: './element-multiselect.component.html',
  styleUrls: ['./element-multiselect.component.scss']
})
export class ElementMultiselectComponent implements OnInit {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
    this.initCheckBoxes();
  }

  constructor() {
  }

  ngOnInit() {
  }

  updateCheckedOptions(item: any, e: any) {
    if (!item || !e.target) {
      return;
    }
    item.selected = !!e.target.checked;
    this.refreshValue();
  }

  initCheckBoxes() {
    const str = this.fieldValueObj.value;
    if (!str) {
      return;
    }
    const res = str.split('|');
    this.fieldValueObj.keyValuePairList.forEach(x => {
      x.selected = this.arrayContains(x.key.toString(), res);
    });
  }

  arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

  refreshValue() {
    const str = [];
    this.fieldValueObj.keyValuePairList.forEach(x => {
      if (x.selected) {
        str.push(x.key);
      }
    });
    this.fieldValueObj.value = str.join('|');
  }
}
