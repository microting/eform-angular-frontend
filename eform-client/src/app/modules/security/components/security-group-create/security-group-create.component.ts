import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  UserInfoModel,
  SecurityGroupCreateModel,
  Paged,
} from 'src/app/common/models';
import { SecurityGroupsService, AdminService } from 'src/app/common/services';
import {MtxSelect} from '@ng-matero/extensions/select';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-security-group-create',
    templateUrl: './security-group-create.component.html',
    styleUrls: ['./security-group-create.component.scss'],
    standalone: false
})
export class SecurityGroupCreateComponent implements OnInit {
  private adminService = inject(AdminService);
  private securityGroupsService = inject(SecurityGroupsService);
  private router = inject(Router);
  private translateService = inject(TranslateService);

  securityGroupUsers: Array<UserInfoModel> = [];
  securityGroupCreateModel: SecurityGroupCreateModel = new SecurityGroupCreateModel();
  users: Paged<UserInfoModel> = new Paged<UserInfoModel>();
  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('ID'), field: 'id'},
    {header: this.translateService.stream('First name'), field: 'firstName'},
    {header: this.translateService.stream('Last name'), field: 'lastName',},
    {header: this.translateService.stream('Email'), field: 'email',},
    {
      header: this.translateService.stream('Actions'),
      field: 'actions',
      type: 'button',
      buttons: [
        {
          color: 'warn',
          type: 'icon',
          icon: 'delete',
          tooltip: this.translateService.stream('Remove user from group'),
          click: (record) => this.deleteUserFromGroup(record),
        },
      ]
    },
  ];

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.adminService
      .getAllUsers({
        isSortDsc: false,
        offset: 0,
        pageSize: 10000,
        sort: 'Id',
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.users = data.model;
        }
      });
  }

  addUserToGroup(usersSelector: MtxSelect) {
    const selectedUser = <any>usersSelector.ngSelect.selectedValues[0];
    if(selectedUser) {
      this.securityGroupUsers = [...this.securityGroupUsers, {
        id: selectedUser.id,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: '',
        darkTheme: selectedUser.darkTheme,
        isDeviceUser: selectedUser.isDeviceUser,
        language: selectedUser.language,
        timeZone: selectedUser.timeZone,
        formats: selectedUser.formats,
        fullName: '',
        groupName: '',
        profilePicture: selectedUser.profilePicture,
        profilePictureSnapshot: selectedUser.profilePictureSnapshot,
        emailSha256: selectedUser.emailSha256,
      }];
      usersSelector.ngSelect.clearModel();
      // Updating user list after working with model
      this.users.entities = this.users.entities.filter(
        (x) => x.id !== selectedUser.id
      );
    }
  }

  deleteUserFromGroup(selectedUserModel: any) {
    this.securityGroupUsers = this.securityGroupUsers.filter(
      (x) => x.id !== selectedUserModel.id
    );
    // Updating user list after working with model
    this.users.entities = [
      ...this.users.entities,
      new UserInfoModel(selectedUserModel),
    ];
  }

  createSecurityGroup() {
    this.securityGroupCreateModel.userIds = this.securityGroupUsers.map(
      (x) => x.id
    );
    this.securityGroupsService
      .createSecurityGroup(this.securityGroupCreateModel)
      .subscribe(() => {
        this.router.navigate(['/security']).then();
      });
  }
}
