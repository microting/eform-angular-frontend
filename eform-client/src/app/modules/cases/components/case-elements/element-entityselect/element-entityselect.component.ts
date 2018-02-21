import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CaseFieldValue, CommonDictionaryTextModel} from 'app/models';
import {ISubscription} from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'element-entityselect',
  templateUrl: './element-entityselect.component.html',
  styleUrls: ['./element-entityselect.component.css']
})
export class ElementEntityselectComponent implements OnInit, OnDestroy {
  sub:  ISubscription;
  selectControl = new FormControl();
  fieldValueObj: CaseFieldValue = new CaseFieldValue();
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
    for (const keyValuePair of this.fieldValueObj.keyValuePairList) {
      this.items.push({id: keyValuePair.key, text: keyValuePair.value});
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelectedChanged(value: string) {
    this.fieldValue.value = value;
  }

}
