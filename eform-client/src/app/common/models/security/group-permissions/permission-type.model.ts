import {PermissionModel} from './permission.model';

export class PermissionTypeModel {
  name: string;
  permissions: Array<PermissionModel> = [];
}
