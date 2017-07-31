import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {UserInfoModel} from 'app/models/user';
import {AdminService} from 'app/services';
import {NotifyService} from 'app/services/notify.service';
import {UserInfoModelList} from 'app/models/user/user-info-model-list';
import {PaginationModel} from 'app/models/common';

@Component({
  selector: 'user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.css']
})
export class UserGridComponent implements OnInit {
  @Input() userInfoModelList: UserInfoModelList = new UserInfoModelList;
  @Input() paginationModel: PaginationModel = new PaginationModel;
  @ViewChild('deleteUserModal') deleteUserModal: ModalComponent;
  @Output() onUserListChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() onUserSelectedForEdit: EventEmitter<number> = new EventEmitter<number>();

  selectedUser: UserInfoModel = new UserInfoModel;

  constructor(private router: Router, private adminService: AdminService, private notifyService: NotifyService) {
  }

  ngOnInit() {
  }

  showDeleteUserModal(model: UserInfoModel) {
    this.selectedUser = model;
    this.deleteUserModal.open().then();
  }

  showEditUserModal(id: number) {
    this.onUserSelectedForEdit.emit(id);
  }

  deleteUser() {
    this.adminService.deleteUser(this.selectedUser.id).subscribe((data) => {
      if (data.success) {
        this.notifyService.success({text: data.message || 'Error'});
        this.onUserListChanged.emit();
        this.deleteUserModal.dismiss().then();
      } else {
        this.notifyService.error({text: data.message || 'Error'});
      }
    });
  }

  getLastPageNumber(): number {
    let lastPage = this.paginationModel.offset + this.paginationModel.pageSize;
    if (lastPage > this.userInfoModelList.totalUsers) {
      lastPage = this.userInfoModelList.totalUsers;
    }
    return lastPage;
  }
}
