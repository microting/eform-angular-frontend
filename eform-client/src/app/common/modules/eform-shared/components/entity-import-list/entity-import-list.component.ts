import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-entity-import-list',
    templateUrl: './entity-import-list.component.html',
    styleUrls: ['./entity-import-list.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatInput, ReactiveFormsModule, FormsModule, MatDialogActions, MatButton, TranslatePipe]
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
