import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {UserInfoModel} from 'app/models/user';

@Component({
  selector: 'user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.css']
})
export class UserGridComponent implements OnInit {
  @Input() userInfoModelList: Array<UserInfoModel> = [];
  @ViewChild('deleteUserModal') deleteUserModal: ModalComponent;
  @Output() onUserListChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() onUserSelectedForEdit: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  showDeleteUserModal() {
    this.deleteUserModal.open().then();
  }

  showEditUserModal(id: number) {
    this.onUserSelectedForEdit.emit(id);
  }

  deleteUser() {

  }
}
