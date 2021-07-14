import { CommonTranslationsModel } from 'src/app/common/models';

export class EformVisualEditorFieldModel {
  id: number;
  tempId?: number;
  checklistId: number;
  fieldType: number;
  position: number;
  translations: CommonTranslationsModel[] = [];
  color = 'e7e7e7'; // set default color for field
  collapsed: boolean;
  mandatory: boolean;
  maxValue: number;
  minValue: number;
  decimalCount: number;
  value: string;
}
