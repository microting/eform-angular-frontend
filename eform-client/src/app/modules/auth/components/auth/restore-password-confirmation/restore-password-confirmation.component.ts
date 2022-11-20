import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PasswordRestoreModel } from 'src/app/common/models/auth';
import { AppSettingsService, AuthService } from 'src/app/common/services';

@Component({
  selector: 'app-restore-password-confirmation',
  templateUrl: './restore-password-confirmation.component.html',
})
export class RestorePasswordConfirmationComponent implements OnInit {
  submitRestoreModel: PasswordRestoreModel = new PasswordRestoreModel();

  constructor(
    private router: Router,
    private authService: AuthService,
    private settingsService: AppSettingsService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.submitRestoreModel.userId = params['userId'];
      this.submitRestoreModel.code = params['code'];
    });
  }

  submitRestoreConfirmationForm(): void {
    this.authService
      .restorePassword(this.submitRestoreModel)
      .subscribe((result) => {
        if (result && result.success) {
          this.router.navigate(['']);
          this.toastrService.success('Password set successfully');
        }
      });
  }
}
