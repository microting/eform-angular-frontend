import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CaseFieldValue, CommonDictionaryTextModel} from 'app/models';
import {EntitySearchService} from 'app/services';
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
      this.entitySearchService.getEntitySearchableGroupDictionary(this.entityGroupUid, searchString).subscribe((operation => {
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
