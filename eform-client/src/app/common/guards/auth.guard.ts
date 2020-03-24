import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (!localStorage.getItem('currentAuth')) {
      console.log('Let\'s kick the user out auth.guard');
      this.router.navigate(['/auth']).then();
      return false;
    }
    return true;
  }
}
