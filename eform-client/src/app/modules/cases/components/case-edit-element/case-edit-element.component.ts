import {Component, Input, QueryList, ViewChildren} from '@angular/core';
import {
  CaseEditRequest,
  CaseEditRequestField,
  CaseEditRequestFieldValue,
  CaseElement,
  CaseDataItem
} from 'app/models';

@Component({
  selector: 'case-edit-element',
  templateUrl: './case-edit-element.component.html'
})

export class CaseEditElementComponent {
  @ViewChildren(CaseEditElementComponent) editElements: QueryList<CaseEditElementComponent>;
  @Input() element: CaseElement = new CaseElement();
  requestModel: CaseEditRequest = new CaseEditRequest();
  requestModels: Array<CaseEditRequest> = [];

  constructor() {
  }

  clearRequestModel() {
    this.requestModel.fields = [];
    this.requestModel.groupFields = [];
    this.requestModel.status = '';
    this.requestModel.id = 0;
    //
    this.requestModels = [];
  }

  extractDataItemList(dataItemList: Array<CaseDataItem> ) {
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
}
