import {ElementDto} from '../../dto/element.dto';

export class ReplyElementDto {
  id: number;
  label: string;
  elementList: Array<ElementDto> = [];
}
