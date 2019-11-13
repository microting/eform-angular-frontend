import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SiteDto} from 'src/app/common/models/dto';
import {DeviceUserService} from 'src/app/common/services/device-users';

@Component({
  selector: 'app-delete-device-user-modal',
  templateUrl: './delete-device-user-modal.component.html',
  styleUrls: ['./delete-device-user-modal.component.scss']
})
export class DeleteDeviceUserModalComponent implements OnInit {
  @Input() selectedDeviceUser: SiteDto = new SiteDto();
  @Output() onUserDeleted: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  spinnerStatus = false;

  constructor(private deviceUserService: DeviceUserService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  deleteSingle() {
    this.spinnerStatus = true;
    this.deviceUserService.deleteSingleDeviceUser(this.selectedDeviceUser.siteId).subscribe(operation => {
      if (operation && operation.success) {
        this.onUserDeleted.emit();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    });
  }
}
