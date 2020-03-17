import {CasePostModel} from './case-post.model';

export class CasePostsListModel {
  eFormName: string;
  description: string;
  locationName: string;
  status: string;
  total: number;
  casePostsList: CasePostModel[];
}
