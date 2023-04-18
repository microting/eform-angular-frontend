import {KeyValuePairDto} from './key-value-pair.dto';
import {CaseUploadedData} from '../cases/response/case-uploaded-data.model';
import {DataItemDto} from './data-item.dto';


export class FieldValueDto extends DataItemDto {
  // FieldValue
  fieldId: number;
  declare fieldType: string;
  dateOfDoing: Date;
  value: string;
  microtingUuid: string;
  valueReadable: string;
  declare description: any;

  latitude: string;
  longitude: string;
  heading: string;
  accuracy: string;
  date: Date;
  uploadedData: string;
  uploadedDataObj: CaseUploadedData;
  keyValuePairList: Array<KeyValuePairDto> = [];
}
