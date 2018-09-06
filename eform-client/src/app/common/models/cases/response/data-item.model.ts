import {CaseFieldValue} from './case-field-value';

export class CaseDataItem {
  // DataItem
  id: number;
  mandatory: Boolean;
  readOnly: Boolean;
  label: string;
  color: string;
  displayOrder: number;
  // Field
  fieldType: string;
  fieldValue: string;
  fieldValues: Array<CaseFieldValue> = [];
  dataItemList: Array<CaseDataItem> = [];
  entityGroupId: string;
  // Picture
  multi: number;
  geolocationEnabled: number;
}
