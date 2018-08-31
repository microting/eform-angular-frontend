import {CaseEditRequest} from './edit-request.model';

export class ReplyRequest {
  id: number;
  label: string;
  elementList: Array<CaseEditRequest> = [];
}
