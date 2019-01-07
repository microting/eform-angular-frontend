import {ElementDto} from 'src/app/common/models/dto/element.dto';

export class MainElementDto {
  id: number;
  label: string;
  status: string;
  elementList: Array<ElementDto> = [];
}
