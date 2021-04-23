import { Component, HostBinding, OnInit } from '@angular/core';
import { ChangePasswordModel } from 'src/app/common/models/user';
import { AuthService } from 'src/app/common/services';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  updateUserPassword() {
    this.authService.changePassword(this.changePasswordModel).subscribe(
      (data) => {},
      () => {}
    );
  }
}
