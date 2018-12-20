export class SecurityGroupCreateModel {
  name: string;
  userIds: Array<number> = [];
}

export class SecurityGroupUpdateModel {
  id: number;
  name: string;
  userIds: Array<number> = [];
}

