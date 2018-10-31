import {PermissionModel} from 'src/app/common/models/security/group-permissions/permission.model';

export class EformsPermissionsModel {
  total: number;
  eformsList: Array<EformPermissionsModel> = [];
}

export class EformPermissionsModel {
  eformInGroupId: number;
  templateId: number;
  label: string;
  createdAt: Date;
  permissions: Array<PermissionModel> = [];
}
