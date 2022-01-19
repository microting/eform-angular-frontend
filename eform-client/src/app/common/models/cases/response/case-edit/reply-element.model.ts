import { ElementDto } from 'src/app/common/models';

export class ReplyElementDto {
  id: number;
  label: string;
  doneAt: Date;
  doneUserEditable: Date;
  elementList: ElementDto[] = [];
}
