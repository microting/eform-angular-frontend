import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStateService } from 'src/app/common/store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authStateService: AuthStateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authStateService.isAuth) {
      console.debug(`Let's kick the user out auth.guard`);
      this.router.navigate(['/auth']).then();
      return false;
    }
    if (
      this.authStateService.loginRedirectUrl &&
      (state.url === '/' || state.url === '/auth')
    ) {
      this.router
        .navigate([`/${this.authStateService.loginRedirectUrl}`])
        .then();
      return false;
    }
    return true;
  }
}
