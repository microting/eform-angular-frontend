import {CasePostModel} from './case-post.model';
import {KeyValue} from '@angular/common';

export class CasePostsListModel {
  eFormName: string;
  workerName: string;
  pdfReportAvailable: boolean;
  additionalFields: KeyValue<string, string>[];
  total: number;
  casePostsList: CasePostModel[];
  caseDoneAt: string;
  caseId: number;
}
