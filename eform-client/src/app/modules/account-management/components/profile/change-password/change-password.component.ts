import {Component, HostBinding, OnInit} from '@angular/core';
import {ChangePasswordModel} from 'src/app/common/models/user';
import {AuthService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel;
  spinnerStatus = false;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  updateUserPassword() {
    this.spinnerStatus = true;
    this.authService.changePassword(this.changePasswordModel).subscribe((data) => {
      this.spinnerStatus = false;
    }, () => {this.spinnerStatus = false; });
  }

}
