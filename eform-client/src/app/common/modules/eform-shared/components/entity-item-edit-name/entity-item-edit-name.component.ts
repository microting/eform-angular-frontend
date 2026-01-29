import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {EntityItemModel} from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-entity-item-edit-name',
    templateUrl: './entity-item-edit-name.component.html',
    styleUrls: ['./entity-item-edit-name.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, MatDialogActions, TranslatePipe]
})
export class EntityItemEditNameComponent implements OnInit {
  dialogRef = inject<MatDialogRef<EntityItemEditNameComponent>>(MatDialogRef);

  selectedEntityItemModel: EntityItemModel = new EntityItemModel();
  public changedEntityItem: EventEmitter<EntityItemModel> = new EventEmitter<EntityItemModel>();
  constructor() {
    const selectedEntityItemModel = inject<EntityItemModel>(MAT_DIALOG_DATA) ?? new EntityItemModel();

    this.selectedEntityItemModel = {...selectedEntityItemModel};
  }

  ngOnInit() {
  }

  hide() {
    this.dialogRef.close();
    this.selectedEntityItemModel = new EntityItemModel();
  }

  emitValue() {
    this.dialogRef.close({result: true, data: this.selectedEntityItemModel});
    this.changedEntityItem.emit(this.selectedEntityItemModel);
  }
}
