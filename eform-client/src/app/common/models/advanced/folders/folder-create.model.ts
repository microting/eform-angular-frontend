import { FolderTranslationModel } from './folder-translation.model';

export class FolderCreateModel {
  parentId: number | null;
  translations: FolderTranslationModel[] = [];
}
