export class CasePostModel {
  id: number;
  date: Date | string;
  from: string;
  toRecipients: string[];
  toRecipientsTags: string[];
  subject: string;
  text: string;
}
