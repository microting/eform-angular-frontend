import { CommonDictionaryModel } from 'src/app/common/models';

export class EformVisualEditorFieldModel {
  id: number;
  tempId: string;
  fieldType: number;
  position: number;
  translations: CommonDictionaryModel[] = [];
  color: string;
  collapsed: boolean;
  mandatory: boolean;
}
