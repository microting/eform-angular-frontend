import {PermissionModel} from '../permission.model';

export class SecurityGroupGeneralPermissionsUpdateModel {
  groupId: number;
  permissions: Array<PermissionModel> = [];
}
