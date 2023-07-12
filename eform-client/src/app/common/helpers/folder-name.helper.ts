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

/**
 Finds the full name of a folder by its ID in a hierarchical data structure.
 @param {number} id - The ID of the folder to search for.
 @param {FolderDto[]} data - The hierarchical data structure to search in.
 @param {string} [path=''] - The path to the current folder.
 @returns {string} The full name of the folder, or an empty string if not found.
 */
export function findFullNameById(id: number, data: FolderDto[], path: string = ''): string {
  for (let item of data) {
    if (item.id === id) {
      return path ? `${path} - ${item.name}` : item.name;
    } else if (item.children.length) {
      let found = findFullNameById(id, item.children, path ? `${path} - ${item.name}` : item.name);
      if (found) {
        return found;
      }
    }
  }
}

/**
 Finds the full name of a folder by its name in a hierarchical data structure.
 @param {string} name - The name of the folder to search for.
 @param {FolderDto[]} data - The hierarchical data structure to search in.
 @param {string} [path=''] - The path to the current folder.
 @returns {string} The full name of the folder, or an empty string if not found.
 */
export function findFullNameByName(name: string, data: FolderDto[], path: string = ''): string {
  for (let item of data) {
    if (item.name === name) {
      return path ? `${path} - ${item.name}` : item.name;
    } else if (item.children.length) {
      let found = findFullNameByName(name, item.children, path ? `${path} - ${item.name}` : item.name);
      if (found) {
        return found;
      }
    }
  }
}
