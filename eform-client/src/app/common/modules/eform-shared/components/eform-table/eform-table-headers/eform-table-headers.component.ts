import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableHeaderElementModel} from 'src/app/common/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[table-headers]',
  templateUrl: './eform-table-headers.component.html',
  styleUrls: ['./eform-table-headers.component.scss']
})
export class EformTableHeadersComponent implements OnInit {
  @Input() isSortDsc: boolean;
  @Input() currentSortName: string;
  @Output() sortChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() tableHeaders: TableHeaderElementModel[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  onSortClick(name: string) {
    this.sortChanged.emit(name);
  }
}
