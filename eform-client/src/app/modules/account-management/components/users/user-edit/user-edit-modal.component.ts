import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SecurityGroupModel } from 'src/app/common/models/security';
import { UserRegisterModel } from 'src/app/common/models/user';
import { AdminService } from 'src/app/common/services/users';
import { Paged } from 'src/app/common/models';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
})
export class UserEditModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Input()
  availableGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();
  @Output() onUserUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedUserModel: UserRegisterModel = new UserRegisterModel();

  constructor(private adminService: AdminService) {}

  ngOnInit() {}

  show(selectedId: number) {
    this.getUserInfo(selectedId);
    this.frame.show();
  }

  getUserInfo(selectedId: number) {
    this.adminService.getUser(selectedId).subscribe((data) => {
      if (data && data.model) {
        this.selectedUserModel = data.model;
      }
    });
  }

  updateUser() {
    this.adminService.updateUser(this.selectedUserModel).subscribe((data) => {
      if (data && data.success) {
        this.onUserUpdated.emit();
        this.frame.hide();
      }
    });
  }

  onUserRoleUpdated(e: string) {
    this.selectedUserModel.role = e;
    this.selectedUserModel.groupId = null;
  }
}
