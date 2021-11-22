import { ElementDto } from 'src/app/common/models';

export class ReplyElementDto {
  id: number;
  label: string;
  doneUserEditable: Date;
  elementList: ElementDto[] = [];
}
