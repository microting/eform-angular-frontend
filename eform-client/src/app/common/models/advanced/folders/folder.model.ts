import { FolderTranslationModel } from './folder-translation.model';

export class FolderModel {
  id: number;
  parentId: number | null;
  translations: FolderTranslationModel[];
}
