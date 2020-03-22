import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {SecurityGroupsModel} from 'src/app/common/models/security';
import {UserRegisterModel} from 'src/app/common/models/user';
import {AdminService} from 'src/app/common/services/users';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss']
})
export class NewUserModalComponent implements OnInit {
  @Input() availableGroups: SecurityGroupsModel = new SecurityGroupsModel();
  @Output() onUserCreated: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(('frame'), {static: false}) frame;
  newUserModel: UserRegisterModel = new UserRegisterModel;
  spinnerStatus = false;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createUser() {
    this.spinnerStatus = true;
    this.adminService.createUser(this.newUserModel).subscribe((data) => {
      if (data && data.success) {
        this.newUserModel = new UserRegisterModel;
        this.onUserCreated.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

}
