import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!localStorage.getItem('currentAuth')) {
      console.log('Let\'s kick the user out auth.guard');
      this.router.navigate(['/auth']).then();
      return false;
    }
    debugger;
    if (localStorage.getItem('loginRedirectUrl') && (state.url === '/' || state.url === '/auth')) {
      const loginRedirectUrl = localStorage.getItem('loginRedirectUrl');
      this.router.navigate([`/${loginRedirectUrl}`]).then();
      return false;
    }
    return true;
  }
}
