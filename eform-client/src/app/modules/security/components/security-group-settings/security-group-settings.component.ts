import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {
  SecurityGroupModel,
  SecurityGroupSettingsUpdateModel,
} from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-security-group-settings',
  templateUrl: './security-group-settings.component.html',
  styleUrls: ['./security-group-settings.component.scss'],
})
export class SecurityGroupSettingsComponent implements OnInit {
  settingsUpdate: EventEmitter<SecurityGroupSettingsUpdateModel> = new EventEmitter<SecurityGroupSettingsUpdateModel>();
  settingsUpdateModel: SecurityGroupSettingsUpdateModel = new SecurityGroupSettingsUpdateModel();

  constructor(
    public dialogRef: MatDialogRef<SecurityGroupSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) securityGroup: SecurityGroupModel = new SecurityGroupModel()
  ) {
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
