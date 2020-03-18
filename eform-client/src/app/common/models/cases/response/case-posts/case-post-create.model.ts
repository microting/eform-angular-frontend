export class CasePostCreateModel {
  from: number;
  toRecipientsIds: number[];
  toTagsIds: number[];
  title: string;
  subject: string;
  text: string;
  attachReport: boolean;
  attachLinkToCase: boolean;
}
