import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  UserInfoModel,
  Paged,
  SecurityGroupModel,
  PaginationModel,
} from 'src/app/common/models';
import {
  SecurityGroupsService,
  AdminService,
  GoogleAuthService,
} from 'src/app/common/services';
import {UsersStateService} from '../store';
import {AuthStateService} from 'src/app/common/store';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {
  UserModalComponent,
  RemoveUserModalComponent,
  UserSetPasswordComponent
} from 'src/app/modules/account-management/components';
import {catchError} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {
  selectUsersIsSortDsc,
  selectUsersPagination,
  selectUsersSort,
  selectCurrentUserClaimsUsersUpdate,
  selectCurrentUserIsAdmin
} from 'src/app/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent implements OnInit, OnDestroy {

  userInfoModelList: Paged<UserInfoModel> = new Paged<UserInfoModel>();
  securityGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();
  public selectCurrentUserIsAdmin$ = this.store.select(selectCurrentUserIsAdmin);

  spinnerStatus: boolean;
  isChecked = true;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Email'), sortProp: {id: 'Email'}, field: 'email', sortable: true},
    {header: this.translateService.stream('Full Name'), sortProp: {id: 'FullName'}, field: 'fullName', sortable: true},
    {header: this.translateService.stream('Role'), sortProp: {id: 'Role'}, field: 'role', sortable: true},
    {header: this.translateService.stream('GroupName'), sortProp: {id: 'GroupName'}, field: 'groupName', sortable: true},
    {header: this.translateService.stream('Language'), sortProp: {id: 'Language'}, field: 'language', sortable: true},
    {
      header: this.translateService.stream('Archive Model & OS version'),
      sortProp: {id: 'ArchiveManufacturer'},
      field: 'archiveManufacturer', sortable: true
    },
    {
      header: this.translateService.stream('Archive Software version'),
      sortProp: {id: 'ArchiveSoftwareVersion'},
      field: 'archiveSoftwareVersion', sortable: true
    },
    {
      header: this.translateService.stream('Time Model & OS version'),
      sortProp: {id: 'TimeRegistrationManufacturer'},
      field: 'timeRegistrationManufacturer', sortable: true
    },
    {
      header: this.translateService.stream('Time Software version'),
      sortProp: {id: 'TimeRegistrationSoftwareVersion'},
      field: 'timeRegistrationSoftwareVersion', sortable: true
    },
    {header: this.translateService.stream('Actions'), field: 'actions', sortable: false},
  ];
  userDeletedSub$: Subscription;
  newUserModalComponentAfterClosedSub$: Subscription;
  editUserModalComponentAfterClosedSub$: Subscription;
  setUserPasswordModalComponentAfterClosedSub$: Subscription;
  public selectCurrentUserClaimsUsersCreate$ = this.store.select(selectCurrentUserClaimsUsersUpdate);
  public selectCurrentUserClaimsUsersUpdate$ = this.store.select(selectCurrentUserClaimsUsersUpdate);
  public selectCurrentUserClaimsUsersDelete$ = this.store.select(selectCurrentUserClaimsUsersUpdate);

  public selectUsersPagination$ = this.store.select(selectUsersPagination);
  public selectUsersSort$ = this.store.select(selectUsersSort);
  public selectUsersIsSortDsc$ = this.store.select(selectUsersIsSortDsc);

  constructor(
    private adminService: AdminService,
    private store: Store,
    public authStateService: AuthStateService,
    private googleAuthService: GoogleAuthService,
    private securityGroupsService: SecurityGroupsService,
    public usersStateService: UsersStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }


  ngOnInit() {
    this.getUserInfoList();
    this.getTwoFactorInfo();
    this.getSecurityGroups();
    // this.getCurrentUserClaimsAsyncSub$ = this.authStateService.currentUserClaimsAsync.subscribe(x => {
    //   if(x.usersUpdate || x.usersDelete) {
    //     this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
    //       {
    //         header: this.translateService.stream('Actions'),
    //         field: 'actions',
    //         type: 'button',
    //         buttons: [
    //           {
    //             type: 'icon',
    //             icon: 'edit',
    //             color: 'accent',
    //             tooltip: 'Edit User',
    //             click: (rowData) => this.openEditModal(rowData.id),
    //             iif: () => this.userClaims.usersUpdate,
    //           },
    //           {
    //             type: 'icon',
    //             icon: 'delete',
    //             color: 'warn',
    //             tooltip: 'Delete user',
    //             click: (rowData) => this.openRemoveUserModal(rowData),
    //             iif: () => this.userClaims.usersDelete,
    //           }
    //         ]
    //       },
    //     ];
    //   }
    // })
  }

  getTwoFactorInfo() {
    this.googleAuthService.twoFactorAuthInfo()
      .pipe(catchError(
        (error, caught) => {
          this.spinnerStatus = false;
          return caught;
        }))
      .subscribe(
        (data) => {
          this.isChecked = data.model;
        },
      );
  }

  getUserInfoList() {
    this.usersStateService.getAllUsers()
      .subscribe((data) => {
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
    this.editUserModalComponentAfterClosedSub$ = this.dialog.open(UserModalComponent,
      dialogConfigHelper(this.overlay, {availableGroups: this.securityGroups, selectedId: userId}))
      .afterClosed().subscribe(result => result.result && result.edit ? this.getUserInfoList() : undefined);
  }

  openNewUserModal() {
    this.newUserModalComponentAfterClosedSub$ = this.dialog.open(UserModalComponent,
      dialogConfigHelper(this.overlay, {availableGroups: this.securityGroups}))
      .afterClosed().subscribe(result => result.result && !result.edit ? this.getUserInfoList() : undefined);
  }

  openRemoveUserModal(selectedUser: UserInfoModel) {
    const modalId = this.dialog.open(RemoveUserModalComponent,
      dialogConfigHelper(this.overlay, selectedUser)).id;
    this.userDeletedSub$ = this.dialog.getDialogById(modalId).componentInstance.userDeleted
      .subscribe(x => this.onUserDeleted(x, modalId));
  }

  openSetPasswordModal(selectedUser: UserInfoModel) {

    const modalId = this.dialog.open(UserSetPasswordComponent,
      dialogConfigHelper(this.overlay, selectedUser)).id;
    this.setUserPasswordModalComponentAfterClosedSub$ = this.dialog.getDialogById(modalId).componentInstance.userPasswordSet
      .subscribe(x => this.dialog.getDialogById(modalId).close());
  }

  checked(e: any) {
    if (e.target && e.target.checked) {
      this.adminService.enableTwoFactorAuth().pipe(catchError(
        (error, caught) => {
          this.spinnerStatus = false;
          return caught;
        }))
        .subscribe(
          () => {
            this.isChecked = true;
          }
        );
    } else if (e.target && !e.target.checked) {
      this.adminService.disableTwoFactorAuth().pipe(catchError(
        (error, caught) => {
          this.spinnerStatus = false;
          return caught;
        }))
        .subscribe(
          () => {
            this.isChecked = false;
          },
        );
    } else {
      return;
    }
  }

  onSortTable(sort: Sort) {
    this.usersStateService.onSortTable(sort.active);
    this.getUserInfoList();
  }

  onUserDeleted(selectedUser: UserInfoModel, modalId: string) {
    this.adminService.deleteUser(selectedUser.id).subscribe((data) => {
      if (data.success) {
        this.dialog.getDialogById(modalId).close();
        this.usersStateService.onDelete();
        this.getUserInfoList();
      }
    });
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.usersStateService.updatePagination(paginationModel);
    this.getUserInfoList();
  }

  ngOnDestroy(): void {
  }

  openResetPasswordModal(id) {
    this.adminService.resetPassword(id).subscribe((data) => {
      if (data.success) {
        this.getUserInfoList();
      }
    });
  }

  // openSetPasswordModal(id) {
  //   // this.adminService.resetPassword(id).subscribe((data) => {
  //   //   if (data.success) {
  //   //     this.getUserInfoList();
  //   //   }
  //   // });
  // }
}
