import {EmailRecipientTagModel} from './email-recipient-tag.model';

export class EmailRecipientModel {
  id: number;
  name: string;
  email: string;
  tags: EmailRecipientTagModel[];
}

