import { EformFieldTypesEnum } from '../../../../common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldTypeModel,
} from 'src/app/common/models';
import {TranslateService} from '@ngx-translate/core';

export function getTranslatedTypes(
  translateService: TranslateService,
  dbFieldTypes?: {id: number; type: string}[]
): EformVisualEditorFieldTypeModel[] {
  let types = [...eformVisualEditorElementTypes];

  if (dbFieldTypes && dbFieldTypes.length > 0) {
    types = types.map(t => {
      const enumName = EformFieldTypesEnum[t.id];
      const dbEntry = dbFieldTypes.find(db => db.type.toLowerCase() === (enumName || '').toLowerCase());
      return dbEntry ? {...t, id: dbEntry.id} : t;
    });
  }

  let translatedTypes: EformVisualEditorFieldTypeModel[] = [];
  types.map((x) => {
    translateService.get(x.name).
    subscribe(y => translatedTypes = [...translatedTypes, {...x, name: y}]);
  });
  return translatedTypes;
}

export const eformVisualEditorElementTypes: EformVisualEditorFieldTypeModel[] = [
  {
    id: EformFieldTypesEnum.CheckBox,
    name: 'CheckBox',
    description: 'Simple check box field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/checkbox-screenshot.png',
  },
  {
    id: EformFieldTypesEnum.SingleSelect,
    name: 'SingleSelect',
    description: 'Single selection list',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/single-select.png',
  },
  {
    id: EformFieldTypesEnum.MultiSelect,
    name: 'MultiSelect',
    description: 'Multi selection list',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/multi-select.png',
  },
  {
    id: EformFieldTypesEnum.Date,
    name: 'Date',
    description: 'Simple date selection field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/date.png',
  },
  {
    id: EformFieldTypesEnum.Number,
    name: 'Number',
    description: 'Simple number field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/number.png',
  },
  {
    id: EformFieldTypesEnum.Text,
    name: 'Text',
    description: 'Text field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/text.png',
  },
  {
    id: EformFieldTypesEnum.Comment,
    name: 'Comment',
    description: 'Simple comment field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/comment.png',
  },
  {
    id: EformFieldTypesEnum.Picture,
    name: 'Picture',
    description: 'Simple picture field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/picture.png',
  },
  {
    id: EformFieldTypesEnum.None,
    name: 'InfoBox',
    description: 'Simple info box field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/infobox.png',
  },
  {
    id: EformFieldTypesEnum.Timer,
    name: 'Timer',
    description: 'Timer field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/timer.png',
  },
  {
    id: EformFieldTypesEnum.SaveButton,
    name: 'SaveButton',
    description: 'Save button field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/save-button.png',
  },
  {
    id: EformFieldTypesEnum.ShowPdf,
    name: 'ShowPDF',
    description: 'Show PDF field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/show-pdf.png',
  },
  {
    id: EformFieldTypesEnum.FieldGroup,
    name: 'FieldGroup',
    description: 'Field group / container',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/field-group.png',
  },
  {
    id: EformFieldTypesEnum.Signature,
    name: 'Signature',
    description: 'Signature field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/signature.png',
  },
  {
    id: EformFieldTypesEnum.EntitySearch,
    name: 'EntitySearch',
    description: 'Searchable entity field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/entity-search.png',
  },
  {
    id: EformFieldTypesEnum.EntitySelect,
    name: 'EntitySelect',
    description: 'Selectable entity field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/entity-select.png',
  },
  {
    id: EformFieldTypesEnum.ShowPicture,
    name: 'ShowPicture',
    description: 'Show picture field',
    previewImage: '',
  },
  {
    id: EformFieldTypesEnum.Audio,
    name: 'Audio',
    description: 'Audio field',
    previewImage: '',
  },
  {
    id: EformFieldTypesEnum.Movie,
    name: 'Movie',
    description: 'Movie field',
    previewImage: '',
  },
  {
    id: EformFieldTypesEnum.NumberStepper,
    name: 'NumberStepper',
    description: 'Number stepper field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/number-stepper.png',
  },
];

export const eformVisualEditorElementColors: CommonDictionaryModel[] = [
  { id: 0, name: 'e8eaf6', description: 'Standard' },
  { id: 1, name: 'c8e6c9', description: 'Green' },
  { id: 2, name: 'bbdefb', description: 'Blue' },
  { id: 3, name: 'fff9c4', description: 'Yellow' },
  { id: 4, name: 'ffccbc', description: 'Red' },
  { id: 5, name: 'f5f5f5', description: 'Grey' },
];
