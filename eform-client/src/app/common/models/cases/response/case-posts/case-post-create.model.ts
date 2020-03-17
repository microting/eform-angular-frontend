export class CasePostCreateModel {
  from: string;
  toRecipientsIds: number[];
  toTagsIds: number[];
  title: string;
  subject: string;
  text: string;
  attachReport: boolean;
}
