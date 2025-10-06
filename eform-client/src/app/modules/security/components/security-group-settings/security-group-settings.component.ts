import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  SecurityGroupModel,
  SecurityGroupSettingsUpdateModel,
} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-security-group-settings',
    templateUrl: './security-group-settings.component.html',
    styleUrls: ['./security-group-settings.component.scss'],
    standalone: false
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
