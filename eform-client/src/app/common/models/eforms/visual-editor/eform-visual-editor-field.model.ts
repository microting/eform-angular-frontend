import { CommonDictionaryModel } from 'src/app/common/models';

export class EformVisualEditorFieldModel {
  fieldType: string;
  translations: CommonDictionaryModel[];
  color: string;
  collapsed: boolean;
  mandatory: boolean;
}
