import {CommonDictionaryModel, EformVisualEditorFieldTypeModel} from 'src/app/common/models';

export enum EformVisualEditorElementTypesEnum {
  InfoBox = 'InfoBox',
}

export const eformVisualEditorElementTypes: EformVisualEditorFieldTypeModel[] = [
  {
    id: 'InfoBox',
    text: 'InfoBox',
    previewImage: '../../../../../../../assets/images/visual-editor-preview/infobox.png'
  }
];

export const eformVisualEditorElementColors: CommonDictionaryModel[] = [
  {
    id: 1,
    name: 'Standard',
    description: '#FFFFFF'
  },
  {
    id: 2,
    name: 'Blue',
    description: '#e2f4fb'
  },
  {
    id: 3,
    name: 'Purple',
    description: '#f5eafa'
  }
  ,  {
    id: 4,
    name: 'Green',
    description: '#FFFFFF'
  },
  {
    id: 5,
    name: 'Yellow',
    description: '#FFFFFF'
  },
  {
    id: 6,
    name: 'Red',
    description: '#FFFFFF'
  },
  {
    id: 7,
    name: 'Grey',
    description: '#FFFFFF'
  }
];

