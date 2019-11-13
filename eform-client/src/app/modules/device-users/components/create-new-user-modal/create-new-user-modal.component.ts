import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SimpleSiteModel} from 'src/app/common/models/device-users';
import {DeviceUserService} from 'src/app/common/services/device-users';

@Component({
  selector: 'app-create-new-user-modal',
  templateUrl: './create-new-user-modal.component.html',
  styleUrls: ['./create-new-user-modal.component.scss']
})
export class CreateNewUserModalComponent implements OnInit {
  @Output() onDeviceUserCreated: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  simpleSiteModel: SimpleSiteModel = new SimpleSiteModel();
  spinnerStatus = false;
  constructor(private deviceUserService: DeviceUserService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createDeviceUser() {
    this.spinnerStatus = true;
    this.deviceUserService.createSingleSimpleSite(this.simpleSiteModel).subscribe(operation => {
      this.spinnerStatus = false;
      if (operation && operation.success) {
        this.onDeviceUserCreated.emit();
        this.simpleSiteModel = new SimpleSiteModel;
        this.frame.hide();
      }
    });
  }

}
