import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-entity-select-import-list',
  templateUrl: './entity-select-import-list.component.html',
  styleUrls: ['./entity-select-import-list.component.scss']
})
export class EntitySelectImportListComponent implements OnInit {
  @Output() onImportSubmitted: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('frame') frame;
  importString: string;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
    this.importString = '';
  }

  submitImport() {
    this.frame.hide();
    this.onImportSubmitted.emit(this.importString);
  }

}
