import { PagedEntityRequest } from 'src/app/common/models';

export class PlanningsRequestModel extends PagedEntityRequest {
  nameFilter: string;
  descriptionFilter: string;
  tagIds: number[];

  constructor() {
    super();
    this.nameFilter = '';
    this.descriptionFilter = '';
    this.tagIds = [];
  }
}
