import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-remove-case-modal',
  templateUrl: './remove-case-modal.component.html',
  styleUrls: ['./remove-case-modal.component.scss']
})
export class RemoveCaseModalComponent implements OnInit {

  @ViewChild('frame') frame;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }
}
