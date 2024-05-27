import {
  EformVisualEditorFieldModel,
  CommonTranslationsModel, EformDocxReportHeadersModel,
} from 'src/app/common/models';
import { getRandomInt } from 'src/app/common/helpers';

export class EformVisualEditorModel {
  id: number;
  translations: CommonTranslationsModel[] = [];
  tagIds: number[] = [];
  position: number;
  collapsed: boolean;
  fields: EformVisualEditorFieldModel[] = [];
  checkLists: EformVisualEditorModel[] = [];
  tempId?: number = getRandomInt(1000, 10000);
  parentChecklistId?: number;
  quickSync: boolean = false;
  doneButtonEnabled: boolean = false;

  // only for create
  docxReportHeaders?: EformDocxReportHeadersModel;
}
