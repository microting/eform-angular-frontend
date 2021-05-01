import { CommonTranslationModel } from 'src/app/common/models';
import { PlanningEformModel } from './planning-eform.model';
import { PlanningReiterationModel } from './planning-reiteration.model';
import { PlanningFolderModel } from './planning-folder.model';
import { PlanningFieldsModel } from './planning-fields.model';

export class PlanningUpdateModel {
  id: number;
  translationsName: CommonTranslationModel[];
  description: string;

  itemNumber: string;
  locationCode: string;
  buildYear: string;
  type: string;
  tagsIds: number[] = [];

  folder: PlanningFolderModel = new PlanningFolderModel();
  reiteration: PlanningReiterationModel = new PlanningReiterationModel();
  boundEform: PlanningEformModel = new PlanningEformModel();
  enabledFields: PlanningFieldsModel = new PlanningFieldsModel();
}
