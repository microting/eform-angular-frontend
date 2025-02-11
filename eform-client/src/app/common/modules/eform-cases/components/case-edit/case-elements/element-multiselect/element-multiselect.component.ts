import {Component, Input, OnInit} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-multiselect',
    templateUrl: './element-multiselect.component.html',
    styleUrls: ['./element-multiselect.component.scss'],
    standalone: false
})
export class ElementMultiselectComponent implements OnInit {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  firstTime: boolean = true;

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
    const str = [];
    this.fieldValueObj.keyValuePairList.forEach(x => {
      if (x.key === item.key && item.selected) {
        str.push(x.key);
      }
      if (x.key !== item.key && x.selected) {
        str.push(x.key);
      }
    });
    this.fieldValueObj.value = str.join('|');
    this.fieldValue = this.fieldValueObj;
  }

  initCheckBoxes() {
    if (!this.firstTime) {
      return;
    }
    this.firstTime = false
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
}
