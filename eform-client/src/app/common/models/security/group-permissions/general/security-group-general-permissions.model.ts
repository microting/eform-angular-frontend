import {PermissionTypeModel} from '../permission-type.model';

export class SecurityGroupGeneralPermissionsModel {
  groupId: number;
  groupName: string = '';
  permissionTypes: Array<PermissionTypeModel> = [];
}


