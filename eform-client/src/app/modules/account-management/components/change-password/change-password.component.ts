import {Component, OnInit} from '@angular/core';
import {ChangePasswordModel} from 'app/models/user';
import {AuthService} from 'app/services/accounts/auth.service';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel;
  spinnerStatus = false;

  constructor(private authService: AuthService, private notifyService: NotifyService) {
  }

  ngOnInit(): void {
  }

  updateUserPassword() {
    this.spinnerStatus = true;
    this.authService.changePassword(this.changePasswordModel).subscribe((data) => {
      this.spinnerStatus = false;
      if (data.success) {
        this.notifyService.success({text: data.message || 'Error'});
      } else {
        this.notifyService.error({text: data.message || 'Error'});
      }
    }, () => {this.spinnerStatus = false; });
  }
}
