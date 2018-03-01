import {Component, OnInit, ViewChild} from '@angular/core';
import {UserEditComponent} from 'app/modules/admin/components/user-edit/user-edit.component';
import {UserInfoModel, UserRegisterModel} from 'app/models/user';
import {UserInfoModelList} from 'app/models/user/user-info-model-list';
import {PaginationModel} from 'app/models/common';
import {AdminService} from 'app/services';

@Component({
  selector: 'eform-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('userEditComponent') userEditComponent: UserEditComponent;
  userInfoModelList: UserInfoModelList = new UserInfoModelList;
  userFullModel: UserRegisterModel = new UserRegisterModel;
  paginationModel: PaginationModel = new PaginationModel;
  spinnerStatus: boolean;
  selectedUserId: number;
  isChecked = false;

  constructor(private adminService: AdminService) {
    this.paginationModel = new PaginationModel(1, 10, 0);
  }

  showCreateUserModal() {
    this.userFullModel = new UserRegisterModel;
    this.userEditComponent.createUserModal.open();
  }


  ngOnInit() {
    this.getUserInfoList();
  }

  getUserInfoList() {
    this.adminService.getAllUsers(this.paginationModel).subscribe((data) => {
      if (data && data.model) {
        this.userInfoModelList = data.model;
      }
    });
  }

  onUserSelectedForEdit(userId: any) {
    this.selectedUserId = userId;
    this.userEditComponent.editUserModal.open();
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

  checkBoxChanged(e: any) {
    if (e.target && e.target.checked) {
      this.isChecked = true;
    } else if (e.target && !e.target.checked) {
      this.isChecked = false;
    } else {
      return;
    }
  }

}
