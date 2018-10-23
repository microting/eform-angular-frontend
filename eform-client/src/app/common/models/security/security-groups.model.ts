import {SecurityGroupUserModel} from './security-group-user.model';

export class SecurityGroupsModel {
  total: number;
  securityGroupList: Array<SecurityGroupModel> = [];
}

export class SecurityGroupModel {
  id: number;
  name: string;
  usersAmount: number;
  usersList: Array<SecurityGroupUserModel> = [];
}
