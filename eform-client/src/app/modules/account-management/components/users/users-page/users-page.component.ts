import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationPages} from 'src/app/common/const';

import {
  SecurityGroupsModel,
  UserInfoModel,
  UserInfoModelList,
  PaginationModel,
  SecurityGroupsRequestModel, ApplicationPageModel, PageSettingsModel
} from 'src/app/common/models';
import {AuthService, SecurityGroupsService, AdminService, UserSettingsService, GoogleAuthService} from 'src/app/common/services';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent implements OnInit {
  @ViewChild('userEditModal', { static: true }) userEditModal;
  @ViewChild('removeUserModal', { static: true }) removeUserModal;
  @ViewChild('newUserModal', { static: true }) newUserModal;

  localPageSettings: PageSettingsModel = new PageSettingsModel();
  paginationModel: PaginationModel = new PaginationModel(1, 5, 0);
  userInfoModelList: UserInfoModelList = new UserInfoModelList;
  selectedUser: UserInfoModel = new UserInfoModel;
  securityGroups: SecurityGroupsModel = new SecurityGroupsModel();

  spinnerStatus: boolean;
  isChecked = true;

  get userClaims() { return this.authService.userClaims; }
  get userRole() { return this.authService.currentRole; }

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private securityGroupsService: SecurityGroupsService,
    public userSettingsService: UserSettingsService
  ) {
  }

  ngOnInit() {
    this.getLocalPageSettings();
    this.getTwoFactorInfo();
    this.getSecurityGroups();
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
    this.googleAuthService.twoFactorAuthInfo().subscribe((data) => {
      this.isChecked = data.model;
    }, () => this.spinnerStatus = false);
  }

  getUserInfoList() {
    this.paginationModel.pageSize = this.localPageSettings.pageSize;
    this.adminService.getAllUsers(this.paginationModel).subscribe((data) => {
      if (data && data.model) {
        this.userInfoModelList = data.model;
      }
    });
  }

  getSecurityGroups() {
    const securityGroupRequestModel = new SecurityGroupsRequestModel();
    securityGroupRequestModel.pageSize = 10000;
    this.securityGroupsService.getAllSecurityGroups(securityGroupRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.securityGroups = data.model;
      }
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
    if (e.target && e.target.checked) {
      this.adminService.enableTwoFactorAuth().subscribe(() => {
        this.isChecked = true;
      }, () => this.spinnerStatus = false);
    } else if (e.target && !e.target.checked) {
      this.adminService.disableTwoFactorAuth().subscribe(() => {
        this.isChecked = false;
      }, () => this.spinnerStatus = false);
    } else {
      return;
    }
  }
}
