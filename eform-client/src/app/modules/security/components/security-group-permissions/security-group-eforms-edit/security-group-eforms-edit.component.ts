import { Component, OnInit, inject } from '@angular/core';
import {EformPermissionsModel} from 'src/app/common/models/security/group-permissions/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor } from '@angular/common';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-security-group-eforms-edit',
    templateUrl: './security-group-eforms-edit.component.html',
    styleUrls: ['./security-group-eforms-edit.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgFor, MatCard, MatCardHeader, MatCardContent, MatCheckbox, ReactiveFormsModule, FormsModule, MatDialogActions, MatButton, TranslatePipe]
})
export class SecurityGroupEformsEditComponent implements OnInit {
  private securityGroupEformsService = inject(SecurityGroupEformsPermissionsService);
  dialogRef = inject<MatDialogRef<SecurityGroupEformsEditComponent>>(MatDialogRef);
  eformSecurityModel = inject<EformPermissionsModel>(MAT_DIALOG_DATA) ?? new EformPermissionsModel();


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
