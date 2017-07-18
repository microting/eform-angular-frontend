import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'simple-layout',
  template: `<router-outlet></router-outlet>`
})
export class SimpleLayoutComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

}
