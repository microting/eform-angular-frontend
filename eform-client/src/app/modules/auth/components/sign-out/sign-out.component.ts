import { AfterViewChecked, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/common/store';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'sign-out',
    template: '',
    standalone: false
})
export class SignOutComponent implements OnInit, AfterViewChecked {
  private authStateService = inject(AuthStateService);
  private router = inject(Router);


  ngOnInit() {}

  signOut() {
    this.authStateService.logout();
    console.debug(`Let's kick the user out sign-out.component`);
    // this.cookieService.delete('.AspNetCore.Identity.Application');
    this.router.navigate(['/auth']).then();
  }

  ngAfterViewChecked(): void {
    this.signOut();
  }
}
