import {EformVisualEditorFieldTypeModel} from 'src/app/common/models';

export enum EformVisualEditorElementTypesEnum {
  TextBox = 'TextBox',
}

export const eformVisualEditorElementTypes: EformVisualEditorFieldTypeModel[] = [
  {
    id: 'TextBox',
    text: 'TextBox',
    previewImage: '../../../../../../../assets/images/visual-editor-preview/infobox.png'
  }
];
