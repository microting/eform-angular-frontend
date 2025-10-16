export class FolderDto {
  createdAt?: Date;
  updatedAt?: Date;
  id: number;
  name: string;
  description?: string;
  parent?: FolderDto;
  parentId?: number;
  microtingUId?: number;
  children?: FolderDto[];
  isLocked: boolean;
  isEditable: boolean;
  managedByPlugin: boolean;
}
