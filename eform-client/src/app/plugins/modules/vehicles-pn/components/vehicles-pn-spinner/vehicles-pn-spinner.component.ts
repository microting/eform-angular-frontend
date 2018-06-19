import {Component, Input} from '@angular/core';

@Component({
  selector: 'vehicles-pn-spinner',
  templateUrl: './vehicles-pn-spinner.component.html',
  styleUrls: ['./vehicles-pn-spinner.component.css']
})
export class VehiclesPnSpinnerComponent {
  @Input() middleActive;
  @Input() smallActive;
  @Input() adaptiveActive;

  public constructor() {
  }

}


