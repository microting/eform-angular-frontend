import {Component, Inject, OnInit, } from '@angular/core';
import {EformPermissionsModel} from 'src/app/common/models/security/group-permissions/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-security-group-eforms-edit',
    templateUrl: './security-group-eforms-edit.component.html',
    styleUrls: ['./security-group-eforms-edit.component.scss'],
    standalone: false
})
export class SecurityGroupEformsEditComponent implements OnInit {
  constructor(
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    public dialogRef: MatDialogRef<SecurityGroupEformsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public eformSecurityModel: EformPermissionsModel = new EformPermissionsModel()
  ) {}

  ngOnInit() {
  }

  updateEformGroupPermissions() {
    this.securityGroupEformsService.updateGroupEformPermissions(this.eformSecurityModel).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
      }
    });
  }


  hide(result = false) {
    this.dialogRef.close(result);
  }

}
