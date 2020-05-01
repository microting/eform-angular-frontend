import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NgSelectComponent} from '@ng-select/ng-select';
import {UserInfoModel, UserInfoModelList, PaginationModel, SecurityGroupCreateModel} from 'src/app/common/models';
import {SecurityGroupsService, AdminService} from 'src/app/common/services';

@Component({
  selector: 'app-security-group-create',
  templateUrl: './security-group-create.component.html',
  styleUrls: ['./security-group-create.component.scss']
})
export class SecurityGroupCreateComponent implements OnInit {
  securityGroupUsers: Array<any> = [];
  securityGroupCreateModel: SecurityGroupCreateModel = new SecurityGroupCreateModel();
  spinnerStatus = false;
  paginationModel = new PaginationModel(1, 1000, 0);
  users: UserInfoModelList = new UserInfoModelList();

  constructor(private adminService: AdminService,
              private securityGroupsService: SecurityGroupsService,
              private router: Router
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.adminService.getAllUsers(this.paginationModel).subscribe((data) => {
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
      email: selectedUser.email
    });
    usersSelector.clearModel();
    // Updating user list after working with model
    this.users.userList = this.users.userList.filter(x => x.id !== selectedUser.id);
  }

  deleteUserFromGroup(selectedUserModel: any) {
    this.securityGroupUsers = this.securityGroupUsers.filter(x => x.id !== selectedUserModel.id);
    // Updating user list after working with model
    this.users.userList = [...this.users.userList, new UserInfoModel(selectedUserModel)];
  }

  createSecurityGroup() {
    this.securityGroupCreateModel.userIds = this.securityGroupUsers.map(x => x.id);
    this.securityGroupsService.createSecurityGroup(this.securityGroupCreateModel).subscribe(() => {
      this.router.navigate(['/security']);
    });
  }
}
