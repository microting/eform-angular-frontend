import {Component, Input} from '@angular/core';

@Component({
  selector: 'eform-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  @Input() middleActive;
  @Input() smallActive;

  public constructor() {
  }

}


