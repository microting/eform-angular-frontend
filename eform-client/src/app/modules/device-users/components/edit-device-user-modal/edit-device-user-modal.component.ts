import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SimpleSiteModel} from 'src/app/common/models/device-users';
import {DeviceUserService} from 'src/app/common/services/device-users';

@Component({
  selector: 'app-edit-device-user-modal',
  templateUrl: './edit-device-user-modal.component.html',
  styleUrls: ['./edit-device-user-modal.component.scss']
})
export class EditDeviceUserModalComponent implements OnInit {
  @Input() selectedDeviceUser: SimpleSiteModel = new SimpleSiteModel();
  @Output() onUserEdited: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor(private deviceUserService: DeviceUserService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  updateSingle() {
    this.spinnerStatus = true;
    this.deviceUserService.updateSingleSimpleSite(this.selectedDeviceUser).subscribe(operation => {
      if (operation && operation.success) {
        this.onUserEdited.emit();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    });
  }
}
