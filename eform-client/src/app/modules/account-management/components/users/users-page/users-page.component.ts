import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationPages} from 'src/app/common/enums';

import {
  UserInfoModel,
  UserInfoModelList,
  PaginationModel,
  PageSettingsModel
} from 'src/app/common/models';
import {AuthService, AdminService, UserSettingsService} from 'src/app/common/services';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent implements OnInit {
  @ViewChild('userEditModal') userEditModal;
  @ViewChild('removeUserModal') removeUserModal;
  @ViewChild('newUserModal') newUserModal;

  localPageSettings: PageSettingsModel = new PageSettingsModel();
  paginationModel: PaginationModel = new PaginationModel(1, 5, 0);
  userInfoModelList: UserInfoModelList = new UserInfoModelList;
  selectedUser: UserInfoModel = new UserInfoModel;

  spinnerStatus: boolean;
  isChecked = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    public userSettingsService: UserSettingsService
  ) {
  }

  ngOnInit() {
    this.getLocalPageSettings();
    this.getTwoFactorInfo();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.AccountManagementUsers])
      .settings;
    this.getUserInfoList();
  }

  updateLocalPageSettings(localStorageItemName: string) {
    this.userSettingsService.updateLocalPageSettings
    (localStorageItemName, this.localPageSettings, ApplicationPages[ApplicationPages.AccountManagementUsers]);
    this.getLocalPageSettings();
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
    this.paginationModel.pageSize = this.localPageSettings.pageSize;
    this.adminService.getAllUsers(this.paginationModel).subscribe((data) => {
      if (data && data.model) {
        this.userInfoModelList = data.model;
      }
      this.spinnerStatus = false;
    });
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
}
