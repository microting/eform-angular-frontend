import {FieldValueDto} from './field-value.dto';

export class DataItemDto {
  // DataItem
  id: number;
  mandatory: Boolean;
  readOnly: Boolean;
  label: string;
  description: Description;
  color: string;
  displayOrder: number;
  // Field
  fieldType: string;
  fieldValue: string;
  fieldValues: Array<FieldValueDto> = [];
  dataItemList: Array<DataItemDto> = [];
  entityGroupId: string;
  // Picture
  multi: number;
  geolocationEnabled: number;
}

export class Description {
  inderValue: string;
}
