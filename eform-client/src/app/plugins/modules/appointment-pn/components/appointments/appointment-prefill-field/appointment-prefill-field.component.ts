import {Component, Input} from '@angular/core';
import {FieldDto} from '../../../../../../common/models/dto/field.dto';

@Component({
  selector: 'app-appointment-prefill-field',
  templateUrl: './appointment-prefill-field.component.html',
  styleUrls: ['./appointment-prefill-field.component.scss']
})
export class AppointmentPrefillFieldComponent {
  @Input() fieldsList: FieldDto[] = [];
  supportedFieldTypes = [
    'CheckBox', 'Number', 'NumberStepper', 'Comment', 'Text', 'Date',
    'SingleSelect', 'MultiSelect', 'FieldContainer', 'EntitySearch', 'EntitySelect'
  ];

  constructor() { }

  getHeaderColor(field: FieldDto) {
    return field.fieldValues && field.fieldValues.length && field.fieldValues[0].color ? '#' + field.fieldValues[0].color : '';
  }
}
