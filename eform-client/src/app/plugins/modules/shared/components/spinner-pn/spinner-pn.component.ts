import { Component, Input, OnInit } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'spinner-pn',
    templateUrl: './spinner-pn.component.html',
    styleUrls: ['./spinner-pn.component.scss'],
    standalone: false
})
export class SpinnerPnComponent implements OnInit {
  @Input() spinnerVisibility = false;
  constructor() {}

  ngOnInit() {}
}
