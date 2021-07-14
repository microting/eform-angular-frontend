import {
  EformVisualEditorFieldModel,
  CommonTranslationsModel,
} from 'src/app/common/models';

export class EformVisualEditorModel {
  id: number;
  translations: CommonTranslationsModel[] = [];
  tagIds: number[];
  position: number;
  collapsed: boolean;
  fields: EformVisualEditorFieldModel[] = [];
  checkLists: EformVisualEditorModel[] = [];
  tempId?: number;
}
