import {Component, Input} from '@angular/core';

@Component({
  selector: 'report-element-text',
  templateUrl: './element-text.component.html',
  styleUrls: ['./element-text.component.scss']
})
export class ElementTextComponent  {
  @Input() placeholder = '';
  @Input() prefixIcon = '';

  constructor() {
  }

}
