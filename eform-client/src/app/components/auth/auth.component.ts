import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthResponseModel, LoginRequestModel} from 'app/models/auth';
import {AuthService} from 'app/services/accounts/auth.service';
import {SettingsService} from 'app/services';


@Component({
  selector: 'eform-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  error: string;

  constructor(private router: Router,
              private authService: AuthService,
              private settingsService: SettingsService,
              private fb: FormBuilder) { }

  submitForm(): void {
    this.authService.login(new LoginRequestModel(this.form.getRawValue()))
      .subscribe((result: AuthResponseModel) => {
          localStorage.setItem('currentAuth', JSON.stringify(result));
          this.router.navigate(['/']).then();
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
    this.form = this.fb.group({
      username: [
        '',
        Validators.required,
      ],
      password: [
        '',
        Validators.required,
      ],
    });
    this.username = this.form.get('username');
    this.password = this.form.get('password');
  }
}
