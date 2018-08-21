import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'eform-spinner',
  templateUrl: './eform-spinner.component.html',
  styleUrls: ['./eform-spinner.component.scss']
})
export class EformSpinnerComponent implements OnInit {
  @Input() spinnerVisibility = false;
  constructor() { }

  ngOnInit() {
  }

}
