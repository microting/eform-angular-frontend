import { CaseEditRequest } from 'src/app/common/models';

export class ReplyRequest {
  id: number;
  label: string;
  elementList: Array<CaseEditRequest> = [];
  doneAt: Date;
  isDoneAtEditable: boolean;
  extraId: number;
  siteId: number;
}
