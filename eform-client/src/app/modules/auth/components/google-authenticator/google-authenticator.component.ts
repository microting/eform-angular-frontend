import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {EventBrokerService} from 'src/app/common/helpers';
import {AuthResponseModel, GoogleAuthenticatorModel, LoginRequestModel} from 'src/app/common/models/auth';
import {AuthService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-google-authenticator',
  templateUrl: './google-authenticator.component.html'
})
export class GoogleAuthenticatorComponent implements OnInit{
  googleAuthenticatorModel: GoogleAuthenticatorModel;
  loginRequestModel: LoginRequestModel;
  formGoogleAuth: FormGroup;
  code: AbstractControl;
  spinnerStatus = false;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private toastrService: ToastrService) {
    this.route.params.subscribe(params => {
      const parsedModel = JSON.parse(atob(params['cypher']));
      this.loginRequestModel = parsedModel.loginData;
      this.googleAuthenticatorModel = parsedModel.googleAuthData;
    });
  }

  ngOnInit() {
    this.formGoogleAuth = this.fb.group({
      code: [
        '',
        [Validators.required]
      ]
    });
    this.code = this.formGoogleAuth.get('code');
  }

  submitGoogleAuthForm() {
    this.spinnerStatus = true;
    this.loginRequestModel.code = this.code.value;
    this.authService.login(this.loginRequestModel)
      .subscribe((result: AuthResponseModel) => {
          localStorage.setItem('currentAuth', JSON.stringify(result));
          this.spinnerStatus = false;
          this.router.navigate(['/']).then();
        },
        (error) => {
          this.spinnerStatus = false;
          this.toastrService.error(error.error.error);
        },
      );
  }
}
