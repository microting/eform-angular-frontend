import { CommonTranslationModel } from 'src/app/common/models';
import { PlanningFolderModel } from './planning-folder.model';
import { PlanningReiterationModel } from './planning-reiteration.model';
import { PlanningEformModel } from './planning-eform.model';

export class PlanningCreateModel {
  translationsName: CommonTranslationModel[];
  description: string;
  tagsIds: number[];

  planningNumber: string;
  locationCode: string;
  buildYear: string;
  type: string;

  folder: PlanningFolderModel = new PlanningFolderModel();
  reiteration: PlanningReiterationModel = new PlanningReiterationModel();
  boundEform: PlanningEformModel = new PlanningEformModel();
}
