import { FolderTranslationModel } from 'src/app/common/models';

export class FolderUpdateModel {
  id: number;
  parentId: number;
  translations: FolderTranslationModel[];
}
