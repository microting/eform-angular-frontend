import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthResponseModel, PasswordRestoreModel} from 'app/models/auth';
import {AuthService} from 'app/services/accounts/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {NotifyService} from 'app/services/notify.service';


@Component({
  selector: 'restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent implements OnInit {
  passwordRestoreModel: PasswordRestoreModel = new PasswordRestoreModel;
  formConfirmRestore: FormGroup;
  password: AbstractControl;
  private routeSubscription: Subscription;
  confirmPassword: AbstractControl;
  userId: AbstractControl;
  code: AbstractControl;
  error: string;

  constructor(private router: Router,
              private authService: AuthService,
              private fb: FormBuilder, private activatedRoute: ActivatedRoute, private notifyService: NotifyService) { }

  submitPasswordRestoreForm(): void {
    debugger;

    this.passwordRestoreModel.password = this.password.value;
    this.passwordRestoreModel.confirmPassword = this.confirmPassword.value;
    this.authService.restorePassword(this.passwordRestoreModel)
      .subscribe((result) => {
      if (result && result.success) {
        this.notifyService.success({text: 'Password successfully set'});
        this.router.navigate(['/login']).then();
      } else {
        this.notifyService.success({text: 'Error while setting password'});
      }
        },
        (error) => {
          this.error = error;
        },
      );
  }

  ngOnInit() {
    debugger;
    this.formConfirmRestore = this.fb.group({
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      confirmPassword: [
        '',
        Validators.required
      ],
      code : [
        '',
        Validators.required,
      ],
      userId: [
        '',
        Validators.required,
      ]
    });
    this.confirmPassword = this.formConfirmRestore.get('confirmPassword');
    this.password = this.formConfirmRestore.get('password');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.passwordRestoreModel.userId = params['userId'];
      this.passwordRestoreModel.code = params['code'];
    });
  }
}
