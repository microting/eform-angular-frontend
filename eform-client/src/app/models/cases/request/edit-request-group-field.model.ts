import {CaseEditRequestField} from 'app/models';

export class CaseEditRequestGroupField {
  id: number;
  label: string;
  description: string;
  color: string;
  displayOrder: number;
  fields: Array<CaseEditRequestField> = [];
}
