export class CasePostCreateModel {
  templateId: number;
  caseId: number;
  toRecipientsIds: number[] = [];
  toTagsIds: number[] = [];
  subject: string;
  text: string;
  attachReport: boolean;
  attachLinkToCase: boolean;
}
