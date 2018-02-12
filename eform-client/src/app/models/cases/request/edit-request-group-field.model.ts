import {CaseEditRequestField} from './edit-request-field.model';

export class CaseEditRequestGroupField {
  id: number;
  label: string;
  description: string;
  color: string;
  displayOrder: number;
  fields: Array<CaseEditRequestField> = [];
}
