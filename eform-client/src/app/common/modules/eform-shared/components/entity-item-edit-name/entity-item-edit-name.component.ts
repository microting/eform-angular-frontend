import {Component, Inject, OnInit} from '@angular/core';
import {EntityItemModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-entity-item-edit-name',
  templateUrl: './entity-item-edit-name.component.html',
  styleUrls: ['./entity-item-edit-name.component.scss']
})
export class EntityItemEditNameComponent implements OnInit {
  public selectedEntityItemModel: EntityItemModel = new EntityItemModel();
  constructor(
    public dialogRef: MatDialogRef<EntityItemEditNameComponent>,
    @Inject(MAT_DIALOG_DATA) selectedEntityItemModel: EntityItemModel = new EntityItemModel()
  ) {
    this.selectedEntityItemModel = {...selectedEntityItemModel};
  }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close({result, data: result ? this.selectedEntityItemModel : null});
    this.selectedEntityItemModel = new EntityItemModel();
  }
}
