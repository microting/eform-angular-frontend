import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  UserInfoModel,
  SecurityGroupUpdateModel,
  SecurityGroupModel,
  Paged,
} from 'src/app/common/models';
import {SecurityGroupsService, AdminService} from 'src/app/common/services';
import {MtxSelect} from '@ng-matero/extensions/select';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-security-group-update',
    templateUrl: './security-group-update.component.html',
    styleUrls: ['./security-group-update.component.scss'],
    standalone: false
})
export class SecurityGroupUpdateComponent implements OnInit {
  securityGroupModel: SecurityGroupModel = new SecurityGroupModel();
  securityGroupUpdateModel: SecurityGroupUpdateModel = new SecurityGroupUpdateModel();
  selectedGroupId: number;
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

  constructor(
    private adminService: AdminService,
    private securityGroupsService: SecurityGroupsService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
  ) {
    this.route.params.subscribe((params) => {
      this.selectedGroupId = params['id'];
      this.getSecurityGroup(this.selectedGroupId);
    });
  }

  ngOnInit() {
  }

  getSecurityGroup(id: number) {
    this.securityGroupsService.getSecurityGroup(id).subscribe((data) => {
      if (data && data.success) {
        this.securityGroupModel = data.model;
        this.getUsers();
      }
    });
  }

  getUsers() {
    this.adminService
      .getAllUsers({
        sort: 'Id',
        pageSize: 100000,
        offset: 0,
        isSortDsc: false,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.users = data.model;
          this.users.entities = this.users.entities.filter(
            (y) => !this.securityGroupModel.usersList.some((x) => x.id === y.id)
          );
        }
      });
  }

  addUserToGroup(usersSelector: MtxSelect) {
    const selectedUser = <any>usersSelector.ngSelect.selectedValues[0];
    if (selectedUser) {
      this.securityGroupModel.usersList = [...this.securityGroupModel.usersList, {
        id: selectedUser.id,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
      }];
      usersSelector.ngSelect.clearModel();
      // Updating user list after working with model
      this.users.entities = this.users.entities.filter(
        (x) => x.id !== selectedUser.id
      );
    }
  }

  deleteUserFromGroup(selectedUserModel: any) {
    this.securityGroupModel.usersList = this.securityGroupModel.usersList.filter(
      (x) => x.id !== selectedUserModel.id
    );
    // Updating user list after working with model
    this.users.entities = [
      ...this.users.entities,
      new UserInfoModel(selectedUserModel),
    ];
  }

  updateSecurityGroup() {
    this.securityGroupUpdateModel.userIds = this.securityGroupModel.usersList.map(
      (x) => x.id
    );
    this.securityGroupUpdateModel.id = this.selectedGroupId;
    this.securityGroupUpdateModel.name = this.securityGroupModel.groupName;
    this.securityGroupsService
      .updateSecurityGroup(this.securityGroupUpdateModel)
      .subscribe(() => {
        this.router.navigate(['/security']).then();
      });
  }
}
