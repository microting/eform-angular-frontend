import { PagedEntityRequest } from 'src/app/common/models';

export class SecurityGroupsRequestModel extends PagedEntityRequest {
  nameFilter: string;

  constructor() {
    super();
    this.nameFilter = '';
  }
}
