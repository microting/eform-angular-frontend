import { PagedEntityRequest } from 'src/app/common/models';

export class TrashInspectionsPnRequestModel extends PagedEntityRequest {
  nameFilter: string;

  constructor() {
    super();
    this.nameFilter = '';
  }
}
