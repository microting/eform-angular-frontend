
export class EformsPermissionsModel {
  total: number;
  eformsList: Array<EformPermissionsModel> = [];
}

export class EformPermissionsModel {
  eformInGroupId: number;
  templateId: number;
  label: string;
  createdAt: Date;
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
