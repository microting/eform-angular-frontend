import { CommonTranslationsModel } from 'src/app/common/models';

export class EformVisualEditorOptionsModel {
  id?: number;
  displayOrder: number;
  selected: boolean;
  key: number;
  translates: CommonTranslationsModel[] = [];
}
