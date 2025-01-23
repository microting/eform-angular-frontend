import { EformFieldTypesEnum } from '../../../../common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldTypeModel,
} from 'src/app/common/models';
import {TranslateService} from '@ngx-translate/core';

export function getTranslatedTypes(translateService: TranslateService): EformVisualEditorFieldTypeModel[] {
  let translatedTypes: EformVisualEditorFieldTypeModel[] = [];
  eformVisualEditorElementTypes.map((x) => {
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
    id: EformFieldTypesEnum.Comment,
    name: 'Comment',
    description: 'Simple comment field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/comment.png',
  },
  {
    id: EformFieldTypesEnum.Number,
    name: 'Number',
    description: 'Simple number field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/number.png',
  },
  {
    id: EformFieldTypesEnum.Picture,
    name: 'Picture',
    description: 'Simple picture field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/picture-screenshot.png',
  },
  {
    id: EformFieldTypesEnum.None,
    name: 'None',
    description: 'Simple text to be displayed',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/infobox.png',
  },
  {
    id: EformFieldTypesEnum.Date,
    name: 'Date',
    description: 'Date selection',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/date.png',
  },
  {
    id: EformFieldTypesEnum.SaveButton,
    name: 'SaveButton',
    description: 'Save eForm.',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/save-screenshot.png',
  },
  {
    id: EformFieldTypesEnum.ShowPdf,
    name: 'ShowPDF',
    description: 'Show PDF',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/show-pdf-screenshot.png',
  },
  {
    id: EformFieldTypesEnum.FieldGroup,
    name: 'FieldGroup',
    description: 'Field group',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/group.png',
  },
  {
    id: EformFieldTypesEnum.NumberStepper,
    name: 'NumberStepper',
    description: 'Number stepper field',
    previewImage: '',
  },
  {
    id: EformFieldTypesEnum.Signature,
    name: 'Signature',
    description: 'Simple signature field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/signature.png',
  },
  {
    id: EformFieldTypesEnum.Timer,
    name: 'Timer',
    description: 'Simple timer field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/timer-screenshot.png',
  },
  {
    id: EformFieldTypesEnum.EntitySearch,
    name: 'EntitySearch',
    description: 'Autofilled searchable items field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/entity-search.png',
  },
  {
    id: EformFieldTypesEnum.EntitySelect,
    name: 'EntitySelect',
    description: 'Autofilled single selection list',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/entity-select.png',
  },
  {
    id: EformFieldTypesEnum.Text,
    name: 'Text (TextSingleLine)',
    description: 'Simple text field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/text.png',
  },
  {
    id: EformFieldTypesEnum.Audio,
    name: 'Audio',
    description: 'Simple audio field',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/audio-screenshot.png',
  },
  {
    id: EformFieldTypesEnum.Movie,
    name: 'Movie',
    description: 'Simple movie field',
    previewImage:
      '',
  },
  {
    id: EformFieldTypesEnum.MultiSelect,
    name: 'MultiSelect',
    description: 'Simple multi select list',
    previewImage:
      '../../../../../../../assets/images/visual-editor-preview/multi-select.png',
  },
  {
    id: EformFieldTypesEnum.ShowPicture,
    name: 'Show picture',
    description: 'Show a single picture field',
    previewImage:
      '',
  },
];

export const eformVisualEditorElementColors: CommonDictionaryModel[] = [
  {
    id: 1,
    description: 'Standard',
    name: 'e8eaf6',
  },
  {
    id: 2,
    description: 'Green',
    name: 'f0f8db',
  },
  {
    id: 3,
    description: 'Blue',
    name: 'e2f4fb',
  },
  {
    id: 4,
    description: 'Yellow',
    name: 'fff6df',
  },
  {
    id: 5,
    description: 'Red',
    name: 'ffe4e4',
  },
  {
    id: 6,
    description: 'Grey',
    name: 'e7e7e7',
  },
];
