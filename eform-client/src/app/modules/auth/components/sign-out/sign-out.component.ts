import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from 'src/app/common/services/auth';


@Component({
  selector: 'sign-out',
  template: ''
})
export class SignOutComponent implements OnInit, AfterViewChecked {

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {

  }


  signOut() {
    localStorage.removeItem('currentAuth');
    console.log('Let\'s kick the user out sign-out.component');
    // this.cookieService.delete('.AspNetCore.Identity.Application');
    this.router.navigate(['/auth']).then();
  }

  ngAfterViewChecked(): void {
    this.signOut();
  }
}
