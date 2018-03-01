import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CaseFieldValue, CommonDictionaryTextModel} from 'app/models';
import {FormControl} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'element-singleselect',
  templateUrl: './element-singleselect.component.html',
  styleUrls: ['./element-singleselect.component.css']
})
export class ElementSingleselectComponent implements OnInit, OnDestroy {
  sub:  ISubscription;
  fieldValueObj: CaseFieldValue = new CaseFieldValue();
  selectControl = new FormControl();
  items: Array<CommonDictionaryTextModel> = [];

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {
  }

  ngOnInit() {
    this.sub = this.selectControl.valueChanges.subscribe(value => this.onSelectedChanged(value));

    this.fieldValueObj.keyValuePairList.forEach(function(key, value) {
      let kvp = new CommonDictionaryTextModel();
      kvp.id = key.key;
      kvp.text = key.value;
      this.push(kvp);
    }, this.items);
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelectedChanged(value: string) {
    this.fieldValue.value = value;
  }

}
