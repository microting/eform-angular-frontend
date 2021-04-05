import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UserInfoModel } from 'src/app/common/models/user';

@Component({
  selector: 'app-remove-user-modal',
  templateUrl: './remove-user-modal.component.html',
  styleUrls: ['./remove-user-modal.component.scss'],
})
export class RemoveUserModalComponent implements OnInit {
  @Input() selectedUser: UserInfoModel = new UserInfoModel();
  @Output() onUserDeleted: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;

  constructor() {}

  ngOnInit() {}

  show() {
    this.frame.show();
  }

  deleteUser() {
    this.onUserDeleted.emit();
    this.frame.hide();
  }
}
