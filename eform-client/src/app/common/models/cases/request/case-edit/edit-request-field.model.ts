import {CaseEditRequestFieldValue} from './edit-request-field-value.model';

export class CaseEditRequestField {
  // Field
  fieldType: string;
  fieldValues: Array<CaseEditRequestFieldValue> = [];
}
