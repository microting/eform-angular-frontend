import {Component, Inject, OnInit,} from '@angular/core';
import {EformPermissionsModel} from 'src/app/common/models';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-security-group-eforms-delete',
    templateUrl: './security-group-eforms-delete.component.html',
    styleUrls: ['./security-group-eforms-delete.component.scss'],
    standalone: false
})
export class SecurityGroupEformsDeleteComponent implements OnInit {
  eformSecurityModel: EformPermissionsModel = new EformPermissionsModel();
  groupId: number;
  constructor(
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    public dialogRef: MatDialogRef<SecurityGroupEformsDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) model: {model: EformPermissionsModel, selectedGroupId: number}
  ) {
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
