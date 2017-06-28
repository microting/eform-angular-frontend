import {SiteNameDto} from './site-name.dto';

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
}
