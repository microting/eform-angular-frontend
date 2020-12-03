import {SharedTagModel} from 'src/app/common/models';

export class EmailRecipientModel {
  id: number;
  name: string;
  email: string;
  tags: SharedTagModel[];
}

