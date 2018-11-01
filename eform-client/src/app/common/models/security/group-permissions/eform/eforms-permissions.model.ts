export class EformsPermissionsModel {
  total: number;
  groupName: string = '';
  groupId: number;
  eformsList: Array<EformPermissionsModel> = [];
}

export class EformPermissionsModel {
  eformInGroupId: number;
  templateId: number;
  label: string;
  createdAt: Date;
  permissionTypes: Array<EformPermissionsTypeModel> = [];
}

export class EformPermissionsTypeModel {
  name: string;
  permissions: Array<EformPermissionModel> = [];
}

export class EformPermissionModel {
  id: number;
  eformPermissionId: number;
  permissionName: string;
  claimName: string;
  permissionTypeId: number;
  permissionType: string;
  isEnabled: boolean;
}
