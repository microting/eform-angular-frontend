export class EmailRecipientsCreateModel {
  tagsIds: number[];
  newTags: string;
  emailRecipientsList: EmailRecipientCreateModel[] = [];
}

export class EmailRecipientCreateModel {
  name: string;
  email: string;
}
