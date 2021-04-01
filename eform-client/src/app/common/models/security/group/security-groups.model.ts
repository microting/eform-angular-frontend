import { SecurityGroupUserModel } from './security-group-user.model';

export class SecurityGroupModel {
  id: number;
  groupName: string;
  userAmount: number;
  usersList: Array<SecurityGroupUserModel> = [];
  redirectLink: string;
}
