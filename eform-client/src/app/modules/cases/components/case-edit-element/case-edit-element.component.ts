import {Component, Input, QueryList, ViewChildren} from '@angular/core';
import {
  CaseEditRequest,
  CaseEditRequestField,
  CaseEditRequestFieldValue,
  CaseElement
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

  extractData() {
    this.clearRequestModel();
    this.requestModel.status = this.element.status;
    this.requestModel.id = this.element.id;
    // if it is single element
    if (this.element.dataItemList) {
      this.element.dataItemList.forEach(item => {
        const elem = new CaseEditRequestField();
        elem.fieldType = item.fieldType;
        if (item.fieldValues && item.fieldValues.length > 0) {
          item.fieldValues.forEach(fieldValue => {
            const val = new CaseEditRequestFieldValue();
            val.fieldId = fieldValue.fieldId;
            val.value = fieldValue.value;
            elem.fieldValues.push(val);
          });
        }
        if (item.dataItemList && item.dataItemList.length > 0) {

        }
        this.requestModel.fields.push(elem);
      });
    }

    // else if (this.element.dataItemGroupList ) {
    //   this.element.dataItemGroupList.forEach(y => {
    //     const group = new CaseEditRequestGroupField();
    //     group.id = y.id;
    //     group.label = y.label;
    //     y.dataItemList.forEach(item => {
    //       const elem = new CaseEditRequestField();
    //       elem.fieldType = item.fieldType;
    //       item.fieldValues.forEach(fieldValue => {
    //         const val = new CaseEditRequestFieldValue();
    //         val.fieldId = fieldValue.fieldId;
    //         val.value = fieldValue.value;
    //         elem.fieldValues.push(val);
    //       });
    //       group.fields.push(elem);
    //     });
    //     this.requestModel.groupFields.push(group);
    //   });
    // }

    this.editElements.forEach(x => {
      x.extractData();
      this.requestModels.push(x.requestModel);
    });
    this.requestModel.elementList = this.requestModels;
  }

  getStyleColorFromDataItem(dataItem: any) {
    let style = '';
    if (dataItem.Color) {
      style = '#' + dataItem.Color + '';
    }
    return style;
  }
}
