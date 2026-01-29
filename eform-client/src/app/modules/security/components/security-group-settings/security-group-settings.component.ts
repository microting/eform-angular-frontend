import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  SecurityGroupModel,
  SecurityGroupSettingsUpdateModel,
} from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-security-group-settings',
    templateUrl: './security-group-settings.component.html',
    styleUrls: ['./security-group-settings.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, MatDialogActions, TranslatePipe]
})
export class SecurityGroupSettingsComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SecurityGroupSettingsComponent>>(MatDialogRef);

  settingsUpdate: EventEmitter<SecurityGroupSettingsUpdateModel> = new EventEmitter<SecurityGroupSettingsUpdateModel>();
  settingsUpdateModel: SecurityGroupSettingsUpdateModel = new SecurityGroupSettingsUpdateModel();

  constructor() {
    const securityGroup = inject<SecurityGroupModel>(MAT_DIALOG_DATA) ?? new SecurityGroupModel();

    this.settingsUpdateModel = {
      id: securityGroup.id,
      redirectLink: securityGroup.redirectLink,
    };
  }

  hide() {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  updateGroupSettings() {
    this.settingsUpdate.emit(this.settingsUpdateModel);
  }
}
