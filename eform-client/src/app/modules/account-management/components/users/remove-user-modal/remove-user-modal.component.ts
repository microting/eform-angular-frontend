import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UserInfoModel} from 'src/app/common/models/user';
import {AdminService} from 'src/app/common/services/users';

@Component({
  selector: 'app-remove-user-modal',
  templateUrl: './remove-user-modal.component.html',
  styleUrls: ['./remove-user-modal.component.scss']
})
export class RemoveUserModalComponent implements OnInit {
  @Input() selectedUser: UserInfoModel = new UserInfoModel;
  @Output() onUserDeleted: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  deleteUser() {
    this.spinnerStatus = true;
    this.adminService.deleteUser(this.selectedUser.id).subscribe((data) => {
      if (data.success) {
        this.onUserDeleted.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }
}
