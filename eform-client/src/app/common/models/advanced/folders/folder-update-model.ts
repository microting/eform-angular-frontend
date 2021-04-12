import { FolderTranslationModel } from './folder-translation.model';

export class FolderUpdateModel {
  id: number;
  parentId: number;
  translations: FolderTranslationModel[];
}
