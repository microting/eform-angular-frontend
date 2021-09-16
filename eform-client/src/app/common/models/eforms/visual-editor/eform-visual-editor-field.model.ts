import { CommonTranslationsModel } from 'src/app/common/models';
import { getRandomInt } from 'src/app/common/helpers';

export class EformVisualEditorFieldModel {
  id?: number = null;
  tempId?: number = getRandomInt(1000, 10000);
  checklistId: number;
  fieldType: number;
  position: number;
  translations: CommonTranslationsModel[] = [];
  color = 'e7e7e7'; // set default color for field
  collapsed = true;
  mandatory = false;
  maxValue: number;
  minValue: number;
  decimalCount: number;
  value: string;
  parentFieldId?: number;
  fields: EformVisualEditorFieldModel[] = [];
}
