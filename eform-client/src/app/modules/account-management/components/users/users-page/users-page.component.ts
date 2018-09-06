import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {PaginationModel} from 'src/app/common/models/common';
import {UserInfoModel, UserInfoModelList} from 'src/app/common/models/user';
import {AuthService} from 'src/app/common/services/auth';
import {AdminService} from 'src/app/common/services/users';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent implements OnInit {
  isChecked = true;
  @ViewChild('userEditModal') userEditModal;
  @ViewChild('removeUserModal') removeUserModal;
  @ViewChild('newUserModal') newUserModal;

  paginationModel: PaginationModel = new PaginationModel;
  userInfoModelList: UserInfoModelList = new UserInfoModelList;
  selectedUser: UserInfoModel = new UserInfoModel;
  spinnerStatus: boolean;

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit() {
    this.paginationModel = new PaginationModel(1, 5, 0);
    this.getUserInfoList();
    this.getTwoFactorInfo();
  }

  checked(e: any) {
    this.spinnerStatus = true;
    if (e.target && e.target.checked) {
      this.adminService.enableTwoFactorAuth().subscribe(() => {
        this.isChecked = true;
        this.spinnerStatus = false;
      }, () => this.spinnerStatus = false);
    } else if (e.target && !e.target.checked) {
      this.adminService.disableTwoFactorAuth().subscribe(() => {
        this.isChecked = false;
        this.spinnerStatus = false;
      }, () => this.spinnerStatus = false);
    } else {
      return;
    }
  }

  openEditModal(userId: number) {
    this.userEditModal.show(userId);
  }

  openNewUserModal() {
    this.newUserModal.show();
  }

  openRemoveUserModal(selectedUser: UserInfoModel) {
    this.selectedUser = selectedUser;
    this.removeUserModal.show();
  }

  getTwoFactorInfo() {
    this.spinnerStatus = true;
    this.authService.twoFactorAuthInfo().subscribe((data) => {
      this.isChecked = data.model;
      this.spinnerStatus = false;
    }, () => this.spinnerStatus = false);
  }

  getUserInfoList() {
    this.spinnerStatus = true;
    this.adminService.getAllUsers(this.paginationModel).subscribe((data) => {
      if (data && data.model) {
        this.userInfoModelList = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.paginationModel.offset = e;
      if (e === 0) {
        this.paginationModel.pageIndex = 0;
      } else {
        this.paginationModel.pageIndex = Math.floor(e / this.paginationModel.pageSize);
      }
      this.getUserInfoList();
    }
  }
}
