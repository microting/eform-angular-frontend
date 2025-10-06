import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-entity-import-list',
    templateUrl: './entity-import-list.component.html',
    styleUrls: ['./entity-import-list.component.scss'],
    standalone: false
})
export class EntityImportListComponent implements OnInit {
  dialogRef = inject<MatDialogRef<EntityImportListComponent>>(MatDialogRef);

  importString = '';
  public importStringSubmit: EventEmitter<string> = new EventEmitter<string>();

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
