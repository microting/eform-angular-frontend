import {SecurityGroupUserModel} from './security-group-user.model';

export class SecurityGroupsModel {
  total: number;
  securityGroupList: Array<SecurityGroupModel> = [];
}

export class SecurityGroupModel {
  id: number;
  name: string;
  userAmount: number;
  usersList: Array<SecurityGroupUserModel> = [];
  redirectLink: string;
}
