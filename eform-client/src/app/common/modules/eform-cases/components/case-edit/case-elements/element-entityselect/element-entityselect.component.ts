import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';
import { CommonDictionaryTextModel } from 'src/app/common/models/common';
import { EntitySelectService } from 'src/app/common/services/advanced';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-entityselect',
    templateUrl: './element-entityselect.component.html',
    styleUrls: ['./element-entityselect.component.scss'],
    standalone: false
})
export class ElementEntityselectComponent implements OnInit, AfterViewInit {
  items: Array<CommonDictionaryTextModel> = [];
  fieldValueObj: FieldValueDto = new FieldValueDto();
  @Input() entityGroupUid: string;

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor(private entitySelectService: EntitySelectService) {}

  ngOnInit() {
    this.entitySelectService
      .getEntitySelectableGroupDictionary(this.entityGroupUid)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.items = operation.model;
        }
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
