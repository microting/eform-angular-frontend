import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CaseFieldValue, CommonDictionaryTextModel} from 'app/models';
import {EntitySearchService, EntitySelectService} from 'app/services';
import {FormControl} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'element-entityselect',
  templateUrl: './element-entityselect.component.html',
  styleUrls: ['./element-entityselect.component.css']
})
export class ElementEntityselectComponent implements OnInit, OnDestroy {
  sub:  ISubscription;
  selectControl = new FormControl();
  items: Array<CommonDictionaryTextModel> = [];

  fieldValueObj: CaseFieldValue = new CaseFieldValue();
  @Input() entityGroupUid: string;

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor(private entitySelectService: EntitySelectService) {
  }

  ngOnInit() {
    this.sub = this.selectControl.valueChanges.subscribe(value => this.onSelectedChanged(value));

    this.entitySelectService.getEntitySelectableGroupDictionary(this.entityGroupUid).subscribe((operation => {
      if (operation && operation.success) {
        this.items  = operation.model;
      }
    }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelectedChanged(value: string) {
    this.fieldValue.value = value;
  }
}
