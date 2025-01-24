import {
  CommonTranslationsModel,
  EformVisualEditorOptionsModel,
  EformVisualEditorTranslationWithDefaultValue,
  EformVisualEditorUploadPdfFileForFieldModel, EformVisualEditorUploadPngFileForFieldModel,
} from 'src/app/common/models';
import { getRandomInt } from 'src/app/common/helpers';

export class EformVisualEditorFieldModel {
  id?: number = null;
  tempId?: number = getRandomInt(1000, 10000);
  checklistId: number;
  fieldType: number;
  position: number;
  translations: EformVisualEditorTranslationWithDefaultValue[] = [];
  color = 'e8eaf6'; // set default color for field
  collapsed = true;
  mandatory = false;
  maxValue: number;
  minValue: number;
  decimalCount: number;
  parentFieldId?: number;
  fields: EformVisualEditorFieldModel[] = [];
  pdfFiles: EformVisualEditorUploadPdfFileForFieldModel[] = [];
  options: EformVisualEditorOptionsModel[] = [];
  entityGroupId?: number;
  pngFiles: EformVisualEditorUploadPngFileForFieldModel[] = [];
}
