import {Component, Input, OnInit} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
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
    if (e.target.checked) {
      item.selected = true;
    } else {
      item.selected = false;
    }
    this.refreshValue();
  }

  initCheckBoxes() {
    const str = this.fieldValueObj.value;
    const res = str.split('|');
    this.fieldValueObj.keyValuePairList.forEach(x => {
      if (this.arrayContains(x.key.toString(), res)) {
        x.selected = true;
      } else {
        x.selected = false;
      }
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
