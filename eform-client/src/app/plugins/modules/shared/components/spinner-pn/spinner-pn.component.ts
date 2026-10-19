import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'spinner-pn',
    templateUrl: './spinner-pn.component.html',
    styleUrls: ['./spinner-pn.component.scss'],
    imports: [NgIf],
})
export class SpinnerPnComponent implements OnInit {
  @Input() spinnerVisibility = false;
  constructor() {}

  ngOnInit() {}
}
