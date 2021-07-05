import {CommonDictionaryModel, EformVisualEditorElementTranslateModel} from 'src/app/common/models';

export class EformVisualEditorFieldModel {
  id: number;
  tempId: string;
  fieldType: number;
  position: number;
  translations: EformVisualEditorElementTranslateModel[] = [];
  color: string;
  collapsed: boolean;
  mandatory: boolean;
}
