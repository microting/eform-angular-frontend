import { Component, OnInit, inject } from '@angular/core';
import {EformPermissionsModel} from 'src/app/common/models';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DateFormatterComponent } from '../../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-security-group-eforms-delete',
    templateUrl: './security-group-eforms-delete.component.html',
    styleUrls: ['./security-group-eforms-delete.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DateFormatterComponent, MatDialogActions, MatButton, TranslatePipe]
})
export class SecurityGroupEformsDeleteComponent implements OnInit {
  private securityGroupEformsService = inject(SecurityGroupEformsPermissionsService);
  dialogRef = inject<MatDialogRef<SecurityGroupEformsDeleteComponent>>(MatDialogRef);

  eformSecurityModel: EformPermissionsModel = new EformPermissionsModel();
  groupId: number;
  constructor() {
    const model = inject<{
    model: EformPermissionsModel;
    selectedGroupId: number;
}>(MAT_DIALOG_DATA);

    this.eformSecurityModel = model.model;
    this.groupId = model.selectedGroupId;
  }

  ngOnInit() {
  }

  deleteEformFromSecurityGroup() {
    this.securityGroupEformsService.deleteEformFromGroup(
      {
        eformId : this.eformSecurityModel.templateId,
        groupId: this.groupId,
      }).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
      }
    });
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

}
