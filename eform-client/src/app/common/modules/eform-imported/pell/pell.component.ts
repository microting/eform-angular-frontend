import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as pell from './pell';


@Component({
  selector: 'pell-editor',
  templateUrl: './pell.component.html'
})
export class PellComponent implements OnInit {
  actions = Object.keys(pell.actions).map(action => pell.actions[action]);
  actionBarClass = 'pell-actionbar';
  actionButtonClass = 'pell-button';
  contentClass = 'pell-content';

  @Output()
  onChange = new EventEmitter<string>()
  constructor() { }

  ngOnInit() {
  }

  onInput(event: any) {
    this.onChange.emit(event.target.innerHTML);
  }
}
