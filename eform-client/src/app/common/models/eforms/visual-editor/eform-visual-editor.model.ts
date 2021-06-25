import { CommonDictionaryModel } from 'src/app/common/models';
import { EformVisualEditorFieldModel } from './eform-visual-editor-field.model';

export class EformVisualEditorModel {
  id: number;
  translations: CommonDictionaryModel[] = [];
  tagIds: number[];
  position: number;
  collapsed: boolean;
  fields: EformVisualEditorFieldModel[] = [];
  checkLists: EformVisualEditorModel[] = [];
}

