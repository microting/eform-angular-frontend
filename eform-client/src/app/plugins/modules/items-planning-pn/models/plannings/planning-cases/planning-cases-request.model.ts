import { PagedEntityRequest } from 'src/app/common/models';

export class PlanningCasesRequestModel extends PagedEntityRequest {
  nameFilter: string;
  planningId: number;
  dateTo: string;
  dateFrom: string;

  constructor() {
    super();
    this.nameFilter = '';
  }
}
