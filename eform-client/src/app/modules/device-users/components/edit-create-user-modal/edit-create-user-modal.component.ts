import { Component, OnInit, inject } from '@angular/core';
import { DeviceUserModel } from 'src/app/common/models/device-users';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {tap} from 'rxjs/operators';
import {AppSettingsStateService} from 'src/app/modules/application-settings/components/store';
import {Subscription} from 'rxjs';
import {LanguagesModel} from 'src/app/common/models';

@Component({
    selector: 'app-edit-create-user-modal',
    templateUrl: './edit-create-user-modal.component.html',
    styleUrls: ['./edit-create-user-modal.component.scss'],
    standalone: false
})
export class EditCreateUserModalComponent implements OnInit {
  private deviceUserService = inject(DeviceUserService);
  dialogRef = inject<MatDialogRef<EditCreateUserModalComponent>>(MatDialogRef);
  simpleSiteModel = inject<DeviceUserModel>(MAT_DIALOG_DATA) ?? new DeviceUserModel();
  private appSettingsStateService = inject(AppSettingsStateService);

  edit: boolean = false;
  getLanguagesSub$: Subscription;
  appLanguages: LanguagesModel = new LanguagesModel();
  activeLanguages: Array<any> = [];

  ngOnInit() {
    this.getEnabledLanguages();
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

  getEnabledLanguages() {
    this.getLanguagesSub$ = this.appSettingsStateService.getLanguages()
      .pipe(tap(data => {
        if (data && data.success && data.model) {
          this.appLanguages = data.model;
          this.activeLanguages = this.appLanguages.languages.filter((x) => x.isActive);
          if(this.simpleSiteModel.id) {
            this.edit = true;
          }
          if(!this.edit) {
            this.simpleSiteModel.languageCode = this.activeLanguages[1].languageCode;
          }
        }
      }))
      .subscribe();
  }
}
