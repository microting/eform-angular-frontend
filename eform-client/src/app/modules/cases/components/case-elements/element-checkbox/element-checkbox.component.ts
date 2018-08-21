import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'element-checkbox',
  templateUrl: './element-checkbox.component.html',
  styleUrls: ['./element-checkbox.component.scss']
})
export class ElementCheckboxComponent implements OnInit {
  test = false;
  constructor() { }

  ngOnInit() {
  }

  checked(e: any) {
    this.test = !this.test;
  }

}
