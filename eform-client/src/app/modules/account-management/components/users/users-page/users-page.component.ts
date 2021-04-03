import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UserInfoModel,
  PaginationModel,
  PageSettingsModel,
  Paged,
  SecurityGroupModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
import {
  AuthService,
  SecurityGroupsService,
  AdminService,
  GoogleAuthService,
} from 'src/app/common/services';
import { UsersStateService } from 'src/app/modules/account-management/components/users/state/users-state.service';

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
  userInfoModelList: Paged<UserInfoModel> = new Paged<UserInfoModel>();
  selectedUser: UserInfoModel = new UserInfoModel();
  securityGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();

  spinnerStatus: boolean;
  isChecked = true;

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: '', sortable: true },
    { name: 'Email', elementId: '', sortable: true },
    { name: 'Full Name', elementId: '', sortable: false },
    { name: 'Role', elementId: '', sortable: true },
    this.userClaims.usersUpdate || this.userClaims.usersDelete
      ? { name: 'Actions', elementId: '', sortable: false }
      : null,
  ];

  get userClaims() {
    return this.authService.userClaims;
  }
  get userRole() {
    return this.authService.currentRole;
  }

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private securityGroupsService: SecurityGroupsService,
    public usersStateService: UsersStateService
  ) {}

  ngOnInit() {
    this.getUserInfoList();
    this.getTwoFactorInfo();
    this.getSecurityGroups();
  }

  getTwoFactorInfo() {
    this.googleAuthService.twoFactorAuthInfo().subscribe(
      (data) => {
        this.isChecked = data.model;
      },
      () => (this.spinnerStatus = false)
    );
  }

  getUserInfoList() {
    this.paginationModel.pageSize = this.localPageSettings.pageSize;
    this.usersStateService.getAllUsers().subscribe((data) => {
      if (data && data.model) {
        this.userInfoModelList = data.model;
      }
    });
  }

  getSecurityGroups() {
    this.securityGroupsService
      .getAllSecurityGroups({
        sort: 'Id',
        pageSize: 10000,
        pageIndex: 0,
        offset: 0,
        nameFilter: '',
        isSortDsc: false,
      })
      .subscribe((data) => {
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

  changePage(offset: number) {
    this.usersStateService.changePage(offset);
    this.getUserInfoList();
  }

  checked(e: any) {
    if (e.target && e.target.checked) {
      this.adminService.enableTwoFactorAuth().subscribe(
        () => {
          this.isChecked = true;
        },
        () => (this.spinnerStatus = false)
      );
    } else if (e.target && !e.target.checked) {
      this.adminService.disableTwoFactorAuth().subscribe(
        () => {
          this.isChecked = false;
        },
        () => (this.spinnerStatus = false)
      );
    } else {
      return;
    }
  }

  onSortTable(sort: string) {
    this.usersStateService.onSortTable(sort);
    this.getUserInfoList();
  }

  onPageSizeChanged(pageSize: number) {
    this.usersStateService.updatePageSize(pageSize);
    this.getUserInfoList();
  }

  onUserDeleted() {
    this.adminService.deleteUser(this.selectedUser.id).subscribe((data) => {
      if (data.success) {
        this.usersStateService.onDelete();
        this.getUserInfoList();
      }
    });
  }
}
