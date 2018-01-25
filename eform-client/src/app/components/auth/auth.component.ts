import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthResponseModel, LoginRequestModel} from 'app/models/auth';
import {AuthService} from 'app/services/accounts/auth.service';
import {SettingsService} from 'app/services';
import {NotifyService} from 'app/services/notify.service';
import {LoginPageSettingsModel} from 'app/models/settings/login-page-settings.model';


@Component({
  selector: 'eform-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  formLogin: FormGroup;
  formRestore: FormGroup;
  formReset: FormGroup;

  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  secretKey: AbstractControl;

  loginPageSettings: LoginPageSettingsModel = new LoginPageSettingsModel;
  loginImage: any;

  showLoginForm: boolean = true;
  showAdminResetForm = false;
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


  submitResetAdminForm() {
    debugger;
    const secretKey = this.formReset.getRawValue().secretKey;
    this.authService.resetAdminPassword(secretKey).subscribe((result) => {
      if (result && result.success) {
        this.notifyService.success({text: result.message});
        this.secretKey.reset();
        this.toggleLoginForm(true);
      } else {
        this.notifyService.error({text: result.message});
      }
    });
  }

  ngOnInit() {
    this.settingsService.connectionStringExist().subscribe((result) => {
      if (result && result.success === false) {
        this.router.navigate(['/settings/connection-string']).then();
      }
    });
    this.getSettings();
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
    this.formReset = this.fb.group({
      secretKey: [
        '',
        [Validators.required]
      ]
    });
    this.username = this.formLogin.get('username');
    this.password = this.formLogin.get('password');
    this.email = this.formRestore.get('email');
    this.secretKey = this.formReset.get('secretKey')
  }

  getSettings() {
    this.settingsService.getLoginPageSettings().subscribe((data) => {
      if (data && data.success) {
        this.loginPageSettings = data.model;
        if (this.loginPageSettings.imageLink && this.loginPageSettings.imageLinkVisible) {
          this.loginImage = 'api/images/login-page-images?fileName=' + this.loginPageSettings.imageLink;
        } else if (!this.loginPageSettings.imageLink) {
          this.loginImage = '../../../assets/images/eform-phone.jpg';
        }
      }
    });
  }

  toggleLoginForm(toggle: boolean) {
    this.showLoginForm = toggle;
    this.showAdminResetForm = false;
  }
}
