import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'spinner-pn',
  templateUrl: './spinner-pn.component.html',
  styleUrls: ['./spinner-pn.component.scss']
})
export class SpinnerPnComponent implements OnInit {
  @Input() spinnerVisibility = false;
  constructor() { }

  ngOnInit() {
  }

}
