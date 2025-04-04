import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {EntityItemModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-entity-item-edit-name',
    templateUrl: './entity-item-edit-name.component.html',
    styleUrls: ['./entity-item-edit-name.component.scss'],
    standalone: false
})
export class EntityItemEditNameComponent implements OnInit {
  selectedEntityItemModel: EntityItemModel = new EntityItemModel();
  public changedEntityItem: EventEmitter<EntityItemModel> = new EventEmitter<EntityItemModel>();
  constructor(
    public dialogRef: MatDialogRef<EntityItemEditNameComponent>,
    @Inject(MAT_DIALOG_DATA) selectedEntityItemModel: EntityItemModel = new EntityItemModel()
  ) {
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
