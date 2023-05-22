import {Component, Inject, OnInit,} from '@angular/core';
import {EntityGroupModel} from 'src/app/common/models';
import {EntitySelectService} from 'src/app/common/services';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-entity-select-remove',
  templateUrl: './entity-select-remove.component.html',
  styleUrls: ['./entity-select-remove.component.scss']
})
export class EntitySelectRemoveComponent implements OnInit {
  constructor(
    private entitySelectService: EntitySelectService,
    public dialogRef: MatDialogRef<EntitySelectRemoveComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedGroupModel: EntityGroupModel = new EntityGroupModel()
  ) {
  }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  deleteSelectedAdvEntitySelectableGroup() {
    this.entitySelectService.deleteEntitySelectableGroup(this.selectedGroupModel.microtingUUID)
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
  }

}
