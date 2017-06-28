import {CaseKeyValuePair} from './key-value-pair.model';
import {CaseUploadedData} from './uploaded-data.model';
import {CaseDataItem} from './data-item.model';


export class CaseFieldValue extends CaseDataItem {
  // FieldValue
  fieldId: number;
  fieldType: string;
  dateOfDoing: Date;
  value: string;
  valueReadable: string;

  latitude: string;
  longitude: string;
  heading: string;
  accuracy: string;
  date: Date;
  uploadedData: string;
  uploadedDataObj: CaseUploadedData;
  keyValuePairList: Array<CaseKeyValuePair> = [];
}
