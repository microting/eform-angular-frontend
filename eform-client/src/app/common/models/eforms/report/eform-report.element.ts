import {KeyValuePairDto} from 'src/app/common/models/dto/key-value-pair.dto';

export class EformReportMainElement {
  id: number;
  label: string;
  elementList: Array<EformReportElement> = [];
}

export class EformReportElement {
  id: string;
  elementId: number;
  label: string;
  dataItemList: Array<EformReportDataItem> = [];
  elementList: Array<EformReportElement> = [];
}

export class EformReportDataItem {
  id: number;
  dataItemId: number;
  label: string;
  fieldType: string;
  visibility: boolean;
  position: number;
  fieldValues: Array<EformReportDataItemValue> = [];
  dataItemList: Array<EformReportDataItem> = [];
}

export class EformReportDataItemValue {

  fieldId: number;
  fieldType: string;
  value: string;
  keyValuePairList: Array<KeyValuePairDto> = [];

}
