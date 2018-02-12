import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';
import {EntitySearchService} from 'app/services';
import {CommonDictionaryTextModel} from 'app/models/common';
import {FormControl} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'element-entitysearch',
  templateUrl: './element-entitysearch.component.html',
  styleUrls: ['./element-entitysearch.component.css']
})
export class ElementEntitysearchComponent implements OnInit, OnDestroy {
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

  constructor(private entitySearchService: EntitySearchService) {
  }

  ngOnInit() {
    this.sub = this.selectControl.valueChanges.subscribe(value => this.onSelectedChanged(value));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelectInputChanged(searchString: string) {
    if (searchString.length > 2) {
      this.entitySearchService.getEntityGroupDictionary(this.entityGroupUid, searchString).subscribe((operation => {
        if (operation && operation.success) {
          this.items  = operation.model;
        }
      }));
    }
  }

  onSelectedChanged(value: string) {
    this.fieldValue.value = value;
  }
}
