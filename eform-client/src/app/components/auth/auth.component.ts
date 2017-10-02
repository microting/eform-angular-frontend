import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthResponseModel, LoginRequestModel} from 'app/models/auth';
import {AuthService} from 'app/services/accounts/auth.service';
import {SettingsService} from 'app/services';
import {NotifyService} from 'app/services/notify.service';


@Component({
  selector: 'eform-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  formLogin: FormGroup;
  formRestore: FormGroup;
  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;

  showLoginForm: boolean = true;
  error: string;

  constructor(private router: Router,
              private authService: AuthService,
              private settingsService: SettingsService,
              private fb: FormBuilder,
              private notifyService: NotifyService) { }

  submitLoginForm(): void {
    this.authService.login(new LoginRequestModel(this.formLogin.getRawValue()))
      .subscribe((result: AuthResponseModel) => {
          localStorage.setItem('currentAuth', JSON.stringify(result));
          this.router.navigate(['/']).then();
        },
        (error) => {
          this.error = error;
        },
      );
  }

  submitRestoreForm(): void {
    this.authService.sendEmailRecoveryLink(this.formRestore.getRawValue()).subscribe((result) => {
        if (result && result.success) {
          this.formRestore.patchValue({email: ''});
          this.notifyService.success({text: 'Successfully, check your email for instructions'});
        }
      },
        (error) => {
          this.error = error;
        },
      );
  }

  ngOnInit() {
    this.settingsService.connectionStringExist().subscribe((result) => {
      if (result && result.success === false) {
        this.router.navigate(['/settings/connection-string']).then();
      }
    });
    this.formLogin = this.fb.group({
      username: [
        '',
        Validators.required,
      ],
      password: [
        '',
        Validators.required,
      ],
    });
    this.formRestore = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email]
      ]
    });
    this.username = this.formLogin.get('username');
    this.password = this.formLogin.get('password');
    this.email = this.formRestore.get('email');
  }

  toggleLoginForm(toggle: boolean) {
    this.showLoginForm = toggle;
  }
}
