import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from 'src/app/common/store';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authStateService: AuthStateService
  ) {}
  canActivate(): boolean {
    if (!this.authStateService.isAuth) {
      console.debug(`Let's kick the user out admin.guard`);
      this.router.navigate(['/auth']).then();
      return false;
    } else {
      return this.authStateService.isAdmin;
    }
  }
}
