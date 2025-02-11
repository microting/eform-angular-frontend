import {Component, EventEmitter, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-entity-import-list',
    templateUrl: './entity-import-list.component.html',
    styleUrls: ['./entity-import-list.component.scss'],
    standalone: false
})
export class EntityImportListComponent implements OnInit {
  importString = '';
  public importStringSubmit: EventEmitter<string> = new EventEmitter<string>();
  constructor(public dialogRef: MatDialogRef<EntityImportListComponent>,) { }

  ngOnInit() {
  }

  hide() {
    this.dialogRef.close();
  }

  submitImport() {
    this.importStringSubmit.emit(this.importString);
    this.hide();
  }

}
