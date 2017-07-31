import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {AdvEntityGroupEditModel, AdvEntityItemModel} from 'app/models/advanced';
import {AdminService, EntitySearchService} from 'app/services';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NotifyService} from 'app/services/notify.service';
import {UserInfoModel, UserRegisterModel} from 'app/models/user';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnChanges {
  @Input() selectedId: number;
  @Output() onUserListChanged = new EventEmitter<void>();
  @ViewChild('editUserModal') editUserModal: ModalComponent;
  @ViewChild('createUserModal') createUserModal: ModalComponent;

  selectedUserModel: UserRegisterModel = new UserRegisterModel;
  newUserModel: UserRegisterModel = new UserRegisterModel;

  constructor(private adminService: AdminService, private notifyService: NotifyService) {
  }

  ngOnChanges(changes) {
    if (changes.selectedId) {
      this.getUserInfo();
    }
  }

  createUser() {
    this.adminService.createUser(this.newUserModel).subscribe((data) => {
      if (data.success) {
        this.newUserModel = new UserRegisterModel;
        this.notifyService.success({text: data.message || 'Error'});
        this.onUserListChanged.emit();
        this.createUserModal.dismiss().then();
      } else {
        this.notifyService.error({text: data.message || 'Error'});
      }
    });
  }

  updateUser() {
    this.adminService.updateUser(this.selectedUserModel).subscribe((data) => {
      if (data.success) {
        this.notifyService.success({text: data.message || 'Error'});
        this.onUserListChanged.emit();
        this.editUserModal.dismiss().then();
      } else {
        this.notifyService.error({text: data.message || 'Error'});
      }
    });
  }

  getUserInfo() {
    if (this.selectedId) {
      this.adminService.getUser(this.selectedId).subscribe((data) => {
        if (data && data.model) {
          this.selectedUserModel = data.model;
        }
      });
    } else {
      this.selectedUserModel = Object.assign({}, new UserRegisterModel());
    }
  }

  openEditUserModal(model: UserRegisterModel) {
    this.selectedUserModel = Object.assign({}, model);
    this.editUserModal.open().then();
  }
}
