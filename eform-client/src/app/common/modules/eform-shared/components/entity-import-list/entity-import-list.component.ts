import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-entity-import-list',
  templateUrl: './entity-import-list.component.html',
  styleUrls: ['./entity-import-list.component.scss']
})
export class EntityImportListComponent implements OnInit {
  importString = '';

  constructor(public dialogRef: MatDialogRef<EntityImportListComponent>,) { }

  ngOnInit() {
  }


  hide(result = false) {
    this.dialogRef.close({result, data: result ? this.importString : ''});
  }

  submitImport() {
    this.hide(true);
  }

}
