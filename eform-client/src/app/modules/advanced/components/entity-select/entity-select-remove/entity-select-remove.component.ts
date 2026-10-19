import { Component, OnInit, inject } from '@angular/core';
import {EntityGroupModel} from 'src/app/common/models';
import {EntitySelectService} from 'src/app/common/services';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DateFormatterComponent } from '../../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-entity-select-remove',
    templateUrl: './entity-select-remove.component.html',
    styleUrls: ['./entity-select-remove.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DateFormatterComponent, MatDialogActions, MatButton, TranslatePipe]
})
export class EntitySelectRemoveComponent implements OnInit {
  private entitySelectService = inject(EntitySelectService);
  dialogRef = inject<MatDialogRef<EntitySelectRemoveComponent>>(MatDialogRef);
  selectedGroupModel = inject<EntityGroupModel>(MAT_DIALOG_DATA) ?? new EntityGroupModel();


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
