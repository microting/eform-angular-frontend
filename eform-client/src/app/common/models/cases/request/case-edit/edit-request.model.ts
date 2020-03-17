import {CaseEditRequestGroupField} from './edit-request-group-field.model';
import {CaseEditRequestField} from './edit-request-field.model';

export class CaseEditRequest {
  id: number;
  status: string;
  fields: Array<CaseEditRequestField> = [];
  groupFields: Array<CaseEditRequestGroupField> = [];
  elementList: Array<CaseEditRequest> = [];
}
