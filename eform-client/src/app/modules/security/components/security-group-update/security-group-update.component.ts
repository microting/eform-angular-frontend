import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgSelectComponent} from '@ng-select/ng-select';
import {
  UserInfoModel,
  UserInfoModelList,
  PaginationModel,
  SecurityGroupUpdateModel, SecurityGroupModel
} from 'src/app/common/models';
import {SecurityGroupsService, AdminService} from 'src/app/common/services';

@Component({
  selector: 'app-security-group-update',
  templateUrl: './security-group-update.component.html',
  styleUrls: ['./security-group-update.component.scss']
})
export class SecurityGroupUpdateComponent implements OnInit {
  securityGroupModel: SecurityGroupModel = new SecurityGroupModel();
  securityGroupUpdateModel: SecurityGroupUpdateModel = new SecurityGroupUpdateModel();
  selectedGroupId: number;
  spinnerStatus = false;
  paginationModel = new PaginationModel(1, 1000, 0);
  users: UserInfoModelList = new UserInfoModelList();

  constructor(private adminService: AdminService,
              private securityGroupsService: SecurityGroupsService,
              private router: Router,
              private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.selectedGroupId = params['id'];
      this.getSecurityGroup(this.selectedGroupId);
    });
  }

  ngOnInit() {

  }

  getSecurityGroup(id: number) {
    this.spinnerStatus = true;
    this.securityGroupsService.getSecurityGroup(id).subscribe((data) => {
      if (data && data.success) {
        this.securityGroupModel = data.model;
        this.getUsers();
      }
      this.spinnerStatus = false;
    });
  }

  getUsers() {
    this.spinnerStatus = true;
    this.adminService.getAllUsers(this.paginationModel).subscribe((data) => {
      if (data && data.success) {
        this.users = data.model;
        this.users.userList =
          this.users.userList.filter(y => !this.securityGroupModel.usersList.some(x => x.id === y.id));
      }
      this.spinnerStatus = false;
    });

  }

  addUserToGroup(usersSelector: NgSelectComponent) {
    const selectedUser = <any>usersSelector.selectedValues[0];
    this.securityGroupModel.usersList.push({
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
    this.securityGroupModel.usersList = this.securityGroupModel.usersList.filter(x => x.id !== selectedUserModel.id);
    // Updating user list after working with model
    this.users.userList = [...this.users.userList, new UserInfoModel(selectedUserModel)];
  }

  updateSecurityGroup() {
    this.spinnerStatus = true;
    this.securityGroupUpdateModel.userIds = this.securityGroupModel.usersList.map(x => x.id);
    this.securityGroupUpdateModel.id = this.selectedGroupId;
    this.securityGroupUpdateModel.name = this.securityGroupModel.name;
    this.securityGroupsService.updateSecurityGroup(this.securityGroupUpdateModel).subscribe(() => {
      this.spinnerStatus = false;
      this.router.navigate(['/security']);
    });
  }
}
