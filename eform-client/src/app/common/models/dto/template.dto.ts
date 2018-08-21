import {SiteNameDto} from './site-name.dto';
import {FieldDto} from './field.dto';
import {KeyValueModel} from '../common/key-value.model';

export class TemplateDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  label: String;
  description: String;
  repeated: Number;
  folderName: String;
  workflowState: String;
  hasCases: Boolean;
  deployedSites: Array<SiteNameDto>;
  tags: Array<KeyValueModel> = [];

  field1: FieldDto;
  field2: FieldDto;
  field3: FieldDto;
  field4: FieldDto;
  field5: FieldDto;
  field6: FieldDto;
  field7: FieldDto;
  field8: FieldDto;
  field9: FieldDto;
  field10: FieldDto;
}
