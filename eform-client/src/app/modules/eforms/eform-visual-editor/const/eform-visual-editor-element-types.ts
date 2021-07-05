import {EformFieldTypesEnum} from 'src/app/common/const';
import {CommonDictionaryModel, EformVisualEditorFieldTypeModel} from 'src/app/common/models';

export enum EformVisualEditorElementTypesEnum {
  InfoBox = 'InfoBox',
}

export const eformVisualEditorElementTypes: EformVisualEditorFieldTypeModel[] = [
  {
    id: EformFieldTypesEnum.Text,
    text: 'Text',
    previewImage: '../../../../../../../assets/images/visual-editor-preview/infobox.png'
  }
];

export const eformVisualEditorElementColors: CommonDictionaryModel[] = [
  {
    id: 1,
    description: 'Standard',
    name: 'FFFFFF'
  },
  {
    id: 2,
    description: 'Blue',
    name: 'e2f4fb'
  },
  {
    id: 3,
    description: 'Purple',
    name: 'f5eafa'
  }
  ,  {
    id: 4,
    description: 'Green',
    name: 'f0f8db'
  },
  {
    id: 5,
    description: 'Yellow',
    name: 'fff6df'
  },
  {
    id: 6,
    description: 'Red',
    name: 'ffe4e4'
  },
  {
    id: 7,
    description: 'Grey',
    name: 'e7e7e7'
  }
];

