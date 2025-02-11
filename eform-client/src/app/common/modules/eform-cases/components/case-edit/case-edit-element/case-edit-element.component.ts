import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {
  DataItemDto,
  CaseEditRequest,
  CaseEditRequestField,
  CaseEditRequestFieldValue,
  ElementDto
} from 'src/app/common/models';

@Component({
    selector: 'app-case-edit-element',
    templateUrl: './case-edit-element.component.html',
    styleUrls: ['./case-edit-element.component.scss'],
    standalone: false
})
export class CaseEditElementComponent implements OnInit {
  @ViewChildren(CaseEditElementComponent) editElements: QueryList<CaseEditElementComponent>;
  @Input() element: ElementDto = new ElementDto();
  @Output() needUpdate: EventEmitter<void> = new EventEmitter<void>();
  requestModel: CaseEditRequest = new CaseEditRequest();
  requestModels: Array<CaseEditRequest> = [];
  constructor() { }

  ngOnInit() {
  }

  clearRequestModel() {
    this.requestModel.fields = [];
    this.requestModel.groupFields = [];
    this.requestModel.status = '';
    this.requestModel.id = 0;
    //
    this.requestModels = [];
  }

  extractDataItemList(dataItemList: Array<DataItemDto> ) {
    dataItemList.forEach(item => {
      const elem = new CaseEditRequestField();
      elem.fieldType = item.fieldType;
      if (item.fieldValues && item.fieldValues.length > 0) {
        item.fieldValues.forEach(fieldValue => {
          const val = new CaseEditRequestFieldValue();
          val.fieldId = fieldValue.id;
          val.value = fieldValue.value;
          elem.fieldValues.push(val);
        });
      }
      if (item.dataItemList && item.dataItemList.length > 0) {
        this.extractDataItemList(item.dataItemList);
      }
      this.requestModel.fields.push(elem);
    });
  }

  extractData() {
    this.clearRequestModel();
    this.requestModel.status = this.element.status;
    this.requestModel.id = this.element.id;
    if (this.element.dataItemList) {
      this.extractDataItemList(this.element.dataItemList);
    }
    this.editElements.forEach(x => {
      x.extractData();
      this.requestModels.push(x.requestModel);
    });
    this.requestModel.elementList = this.requestModels;
  }

  emitNeedUpdate(){
    this.needUpdate.emit()
  }
}
