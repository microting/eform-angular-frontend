export class FolderDto {
  createdAt?: Date;
  updatedAt?: Date;
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  microtingUId?: number;
  children?: FolderDto[];
}
