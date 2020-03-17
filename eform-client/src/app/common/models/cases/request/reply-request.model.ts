import {CaseEditRequest} from './case-edit/edit-request.model';

export class ReplyRequest {
  id: number;
  label: string;
  elementList: Array<CaseEditRequest> = [];
}
