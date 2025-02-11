import {Component, Inject, OnInit, } from '@angular/core';
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
  constructor(
    private deviceUserService: DeviceUserService,
    public dialogRef: MatDialogRef<DeleteDeviceUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedDeviceUser: SiteDto = new SiteDto()) {
  }

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
