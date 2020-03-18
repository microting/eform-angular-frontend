import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, switchMap} from 'rxjs/operators';
import {FieldValueDto} from 'src/app/common/models';
import {CommonDictionaryTextModel} from 'src/app/common/models/common';
import {EntitySearchService} from 'src/app/common/services/advanced';

@Component({
  selector: 'element-entitysearch',
  templateUrl: './element-entitysearch.component.html',
  styleUrls: ['./element-entitysearch.component.scss']
})
export class ElementEntitysearchComponent implements AfterViewInit {
  items: Array<CommonDictionaryTextModel> = [];
  fieldValueObj: FieldValueDto = new FieldValueDto();
  typeahead = new EventEmitter<string>();
  @Input() entityGroupUid: string;

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor(private entitySearchService: EntitySearchService, private cd: ChangeDetectorRef) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(searchString =>
          this.entitySearchService.getEntitySearchableGroupDictionary(this.entityGroupUid, searchString))
      )
      .subscribe(items => {
        this.items = items.model;
        this.cd.markForCheck();
      }, (err) => {
        console.log('error', err);
        this.items = [];
        this.cd.markForCheck();
      });
  }

  onSelectedChanged(e: any) {
    this.fieldValue.value = e.id;
  }

  ngAfterViewInit(): void {
    if (this.fieldValueObj.valueReadable === 'null') {
      this.fieldValueObj.valueReadable = '';
    }
  }
}
