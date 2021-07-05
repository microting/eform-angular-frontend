import { EformVisualEditorElementTranslateModel } from './eform-visual-editor-element-translate.model';
import { EformVisualEditorFieldModel } from './eform-visual-editor-field.model';

export class EformVisualEditorModel {
  id: number;
  translations: EformVisualEditorElementTranslateModel[] = [];
  tagIds: number[];
  position: number;
  collapsed: boolean;
  fields: EformVisualEditorFieldModel[] = [];
  checkLists: EformVisualEditorModel[] = [];
}
