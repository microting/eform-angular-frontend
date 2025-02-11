import {Component, Inject, OnInit,} from '@angular/core';
import {EntityGroupModel} from 'src/app/common/models/advanced';
import {EntitySearchService} from 'src/app/common/services/advanced';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-entity-search-remove',
    templateUrl: './entity-search-remove.component.html',
    styleUrls: ['./entity-search-remove.component.scss'],
    standalone: false
})
export class EntitySearchRemoveComponent implements OnInit {
  constructor(
    private entitySearchService: EntitySearchService,
    public dialogRef: MatDialogRef<EntitySearchRemoveComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedGroupModel: EntityGroupModel = new EntityGroupModel()
  ) { }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  deleteSelectedAdvEntitySearchableGroup() {
    this.entitySearchService.deleteEntitySearchableGroup(this.selectedGroupModel.microtingUUID).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
      }
    });
  }
}
