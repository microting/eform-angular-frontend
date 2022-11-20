import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GoogleAuthenticatorModel,
  LoginRequestModel,
} from 'src/app/common/models/auth';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-google-authenticator',
  templateUrl: './google-authenticator.component.html',
})
export class GoogleAuthenticatorComponent implements OnInit {
  googleAuthenticatorModel: GoogleAuthenticatorModel;
  loginRequestModel: LoginRequestModel;
  formGoogleAuth: UntypedFormGroup;
  code: AbstractControl;

  constructor(
    private authStateService: AuthStateService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {
    this.route.params.subscribe((params) => {
      const parsedModel = JSON.parse(atob(params['cypher']));
      this.loginRequestModel = parsedModel.loginData;
      this.googleAuthenticatorModel = parsedModel.googleAuthData;
    });
  }

  ngOnInit() {
    this.formGoogleAuth = this.fb.group({
      code: ['', [Validators.required]],
    });
    this.code = this.formGoogleAuth.get('code');
  }

  submitGoogleAuthForm() {
    this.loginRequestModel.code = this.code.value;
    this.authStateService.login(this.loginRequestModel);
  }
}
