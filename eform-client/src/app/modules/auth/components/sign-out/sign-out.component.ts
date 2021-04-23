import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'sign-out',
  template: '',
})
export class SignOutComponent implements OnInit, AfterViewChecked {
  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit() {}

  signOut() {
    this.authStateService.logout();
    console.log('Let\'s kick the user out sign-out.component');
    // this.cookieService.delete('.AspNetCore.Identity.Application');
    this.router.navigate(['/auth']).then();
  }

  ngAfterViewChecked(): void {
    this.signOut();
  }
}
