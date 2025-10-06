import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, inject } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FieldValueDto } from 'src/app/common/models';
import { CommonDictionaryTextModel } from 'src/app/common/models/common';
import { EntitySearchService } from 'src/app/common/services/advanced';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-entitysearch',
    templateUrl: './element-entitysearch.component.html',
    styleUrls: ['./element-entitysearch.component.scss'],
    standalone: false
})
export class ElementEntitysearchComponent implements AfterViewInit {
  private entitySearchService = inject(EntitySearchService);
  private cd = inject(ChangeDetectorRef);

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

  constructor() {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((searchString) =>
          this.entitySearchService.getEntitySearchableGroupDictionary(
            this.entityGroupUid,
            searchString
          )
        )
      )
      .subscribe(
        (items) => {
          this.items = items.model;
          this.cd.markForCheck();
        },
        (err) => {
          console.debug('error', err);
          this.items = [];
          this.cd.markForCheck();
        }
      );
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
