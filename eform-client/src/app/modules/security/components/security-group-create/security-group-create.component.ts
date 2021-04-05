import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  UserInfoModel,
  UserInfoModelList,
  PaginationModel,
  SecurityGroupCreateModel,
  Paged,
  TableHeaderElementModel,
} from 'src/app/common/models';
import { SecurityGroupsService, AdminService } from 'src/app/common/services';

@Component({
  selector: 'app-security-group-create',
  templateUrl: './security-group-create.component.html',
  styleUrls: ['./security-group-create.component.scss'],
})
export class SecurityGroupCreateComponent implements OnInit {
  securityGroupUsers: Array<UserInfoModel> = [];
  securityGroupCreateModel: SecurityGroupCreateModel = new SecurityGroupCreateModel();
  users: Paged<UserInfoModel> = new Paged<UserInfoModel>();
  tableHeaders: TableHeaderElementModel[] = [
    { name: 'ID', sortable: false, elementId: '' },
    { name: 'First name', sortable: false, elementId: '' },
    { name: 'Last name', sortable: false, elementId: '' },
    { name: 'Email', sortable: false, elementId: '' },
    { name: 'Actions', sortable: false, elementId: '' },
  ];

  constructor(
    private adminService: AdminService,
    private securityGroupsService: SecurityGroupsService,
    private router: Router
  ) {}

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

  addUserToGroup(usersSelector: NgSelectComponent) {
    const selectedUser = <any>usersSelector.selectedValues[0];
    this.securityGroupUsers.push({
      id: selectedUser.id,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      role: '',
    });
    usersSelector.clearModel();
    // Updating user list after working with model
    this.users.entities = this.users.entities.filter(
      (x) => x.id !== selectedUser.id
    );
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
        this.router.navigate(['/security']);
      });
  }
}
