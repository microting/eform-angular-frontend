import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {UserInfoModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-remove-user-modal',
    templateUrl: './remove-user-modal.component.html',
    styleUrls: ['./remove-user-modal.component.scss'],
    standalone: false
})
export class RemoveUserModalComponent implements OnInit {
  userDeleted: EventEmitter<UserInfoModel> = new EventEmitter<UserInfoModel>();

  constructor(
    public dialogRef: MatDialogRef<RemoveUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedUser: UserInfoModel = new UserInfoModel()) {
  }

  ngOnInit() {
  }

  hide() {
    this.dialogRef.close();
  }

  deleteUser() {
    this.userDeleted.emit(this.selectedUser);
  }
}
