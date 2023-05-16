import {Component, Inject, OnInit} from '@angular/core';
import { DeviceUserModel } from 'src/app/common/models/device-users';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {applicationLanguages} from 'src/app/common/const/application-languages.const';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-edit-create-user-modal',
  templateUrl: './edit-create-user-modal.component.html',
  styleUrls: ['./edit-create-user-modal.component.scss']
})
export class EditCreateUserModalComponent implements OnInit {
  edit: boolean = false;
  constructor(
    private deviceUserService: DeviceUserService,
    public dialogRef: MatDialogRef<EditCreateUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public simpleSiteModel: DeviceUserModel = new DeviceUserModel()) { }

  ngOnInit() {
    if(this.simpleSiteModel.id) {
      this.edit = true;
    }
    if(!this.edit) {
      this.simpleSiteModel.languageCode = this.languages[1].locale;
    }
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  createDeviceUser() {
    this.deviceUserService.createSingleDeviceUser(this.simpleSiteModel).subscribe(operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }

  updateSingle() {
    this.deviceUserService.updateSingleDeviceUser(this.simpleSiteModel).subscribe(operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }

  get languages() {
    return applicationLanguages;
  }
}
