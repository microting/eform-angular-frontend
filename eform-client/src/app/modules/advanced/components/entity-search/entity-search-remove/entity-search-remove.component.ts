import { Component, OnInit, inject } from '@angular/core';
import {EntityGroupModel} from 'src/app/common/models/advanced';
import {EntitySearchService} from 'src/app/common/services/advanced';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DateFormatterComponent } from '../../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-entity-search-remove',
    templateUrl: './entity-search-remove.component.html',
    styleUrls: ['./entity-search-remove.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DateFormatterComponent, MatDialogActions, TranslatePipe]
})
export class EntitySearchRemoveComponent implements OnInit {
  private entitySearchService = inject(EntitySearchService);
  dialogRef = inject<MatDialogRef<EntitySearchRemoveComponent>>(MatDialogRef);
  selectedGroupModel = inject<EntityGroupModel>(MAT_DIALOG_DATA) ?? new EntityGroupModel();


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
