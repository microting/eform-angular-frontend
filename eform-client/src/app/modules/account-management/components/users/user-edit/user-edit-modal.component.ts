import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SecurityGroupsModel} from 'src/app/common/models/security';
import {UserRegisterModel} from 'src/app/common/models/user';
import {AdminService} from 'src/app/common/services/users';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() availableGroups: SecurityGroupsModel = new SecurityGroupsModel();
  @Output() onUserUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedUserModel: UserRegisterModel = new UserRegisterModel;
  newUserModel: UserRegisterModel = new UserRegisterModel;
  spinnerStatus = false;

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
  }

  show(selectedId: number) {
    this.getUserInfo(selectedId);
    this.frame.show();
  }

  getUserInfo(selectedId: number) {
    this.spinnerStatus = true;
    this.adminService.getUser(selectedId).subscribe((data) => {
      if (data && data.model) {
        this.selectedUserModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  updateUser() {
    this.spinnerStatus = true;
    this.adminService.updateUser(this.selectedUserModel).subscribe((data) => {
      if (data && data.success) {
        this.onUserUpdated.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }
}
