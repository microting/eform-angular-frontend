import {CasePostModel} from './case-post.model';
import {KeyValue} from '@angular/common';

export class CasePostsListModel {
  eFormName: string;
  workerName: string;
  additionalFields: KeyValue<string, string>[];
  total: number;
  casePostsList: CasePostModel[];
}
