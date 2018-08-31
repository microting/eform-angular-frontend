import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-entity-search-import-list',
  templateUrl: './entity-search-import-list.component.html',
  styleUrls: ['./entity-search-import-list.component.scss']
})
export class EntitySearchImportListComponent implements OnInit {
  @Output() onImportSubmitted: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('frame') frame;
  importString: string;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  submitImport() {
    this.frame.hide();
    this.onImportSubmitted.emit(this.importString);
  }

}
