import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DeviceUserModel} from 'src/app/common/models/device-users';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {applicationLanguages, applicationLanguages2} from 'src/app/common/const/application-languages.const';

@Component({
  selector: 'app-edit-device-user-modal',
  templateUrl: './edit-device-user-modal.component.html',
  styleUrls: ['./edit-device-user-modal.component.scss']
})
export class EditDeviceUserModalComponent implements OnInit {
  @Input() selectedDeviceUser: DeviceUserModel = new DeviceUserModel();
  @Output() onUserEdited: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;

  constructor(private deviceUserService: DeviceUserService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  updateSingle() {
    this.deviceUserService.updateSingleDeviceUser(this.selectedDeviceUser).subscribe(operation => {
      if (operation && operation.success) {
        this.onUserEdited.emit();
        this.frame.hide();
      }
    });
  }

  get languages() {
    return applicationLanguages2;
  }
}
