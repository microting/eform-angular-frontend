import { ElementDto } from 'src/app/common/models';

export class ReplyElementDto {
  id: number;
  label: string;
  isDoneAtEditable: boolean;
  doneUserEditable: Date;
  elementList: ElementDto[] = [];
}
