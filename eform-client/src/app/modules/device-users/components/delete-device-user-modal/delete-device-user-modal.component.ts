import { Component, OnInit, inject } from '@angular/core';
import {SiteDto} from 'src/app/common/models/dto';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-delete-device-user-modal',
    templateUrl: './delete-device-user-modal.component.html',
    styleUrls: ['./delete-device-user-modal.component.scss'],
    standalone: false
})
export class DeleteDeviceUserModalComponent implements OnInit {
  private deviceUserService = inject(DeviceUserService);
  dialogRef = inject<MatDialogRef<DeleteDeviceUserModalComponent>>(MatDialogRef);
  selectedDeviceUser = inject<SiteDto>(MAT_DIALOG_DATA) ?? new SiteDto();


  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  deleteSingle() {
    this.deviceUserService.deleteSingleDeviceUser(this.selectedDeviceUser.siteUid)
      .subscribe(operation => {
        if (operation && operation.success) {
          this.hide(true);
        }
    });
  }
}
