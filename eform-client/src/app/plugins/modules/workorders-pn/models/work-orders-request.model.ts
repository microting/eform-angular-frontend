import { PagedEntityRequest } from 'src/app/common/models';

export class WorkOrdersRequestModel extends PagedEntityRequest {
  searchString: string;

  constructor() {
    super();
    this.searchString = '';
  }
}
