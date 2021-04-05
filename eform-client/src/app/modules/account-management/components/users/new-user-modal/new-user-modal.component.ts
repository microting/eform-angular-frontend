import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Paged } from 'src/app/common/models/common';
import { SecurityGroupModel } from 'src/app/common/models/security';
import { UserRegisterModel } from 'src/app/common/models/user';
import { AdminService } from 'src/app/common/services/users';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss'],
})
export class NewUserModalComponent implements OnInit {
  @Input()
  availableGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();
  @Output() onUserCreated: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  newUserModel: UserRegisterModel = new UserRegisterModel();

  constructor(private adminService: AdminService) {}

  ngOnInit() {}

  show() {
    this.frame.show();
  }

  createUser() {
    this.adminService.createUser(this.newUserModel).subscribe((data) => {
      if (data && data.success) {
        this.newUserModel = new UserRegisterModel();
        this.onUserCreated.emit();
        this.frame.hide();
      }
    });
  }
}
