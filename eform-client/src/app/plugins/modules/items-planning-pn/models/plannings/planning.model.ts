import { CommonTranslationModel, SharedTagModel } from 'src/app/common/models';
import { PlanningEformModel } from './planning-eform.model';
import { PlanningReiterationModel } from './planning-reiteration.model';
import { PlanningFolderModel } from './planning-folder.model';
import { PlanningFieldsModel } from './planning-fields.model';

export class PlanningModel {
  id: number;
  translatedName: string;
  translationsName: CommonTranslationModel[];
  description: string;

  assignedSites: PlanningAssignedSitesModel[] = [];
  tags: SharedTagModel[];
  tagsIds: number[];

  itemNumber: string;
  locationCode: string;
  buildYear: string;
  type: string;

  folder: PlanningFolderModel = new PlanningFolderModel();
  reiteration: PlanningReiterationModel = new PlanningReiterationModel();
  boundEform: PlanningEformModel = new PlanningEformModel();
  enabledFields: PlanningFieldsModel = new PlanningFieldsModel();
}

export class PlanningAssignedSitesModel {
  siteId: number;
  name: string;
  siteUId: number;
}
