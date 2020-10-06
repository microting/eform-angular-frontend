import { FolderDto } from 'src/app/common/models';

export function composeFolderName(
  folderId: number,
  folders: FolderDto[],
  folderNameString: string = ''
): string {
  const foundFolder = folders.find((x) => x.id === folderId);

  if (!foundFolder) {
    return '';
  }

  const composedName = folderNameString
    ? `${foundFolder.name} - ${folderNameString}`
    : foundFolder.name;

  if (!foundFolder.parentId) {
    return composedName;
  }

  return composeFolderName(foundFolder.parentId, folders, composedName);
}
