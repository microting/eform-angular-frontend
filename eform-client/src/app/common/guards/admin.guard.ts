import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {UserInfoModel} from 'src/app/common/models';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    if (!localStorage.getItem('currentAuth')) {
      console.log('Let\'s kick the user out admin.guard');
      this.router.navigate(['/auth']).then();
      return false;
    } else {
      const auth: UserInfoModel = JSON.parse(localStorage.getItem('currentAuth'));
      if (auth && auth.role && auth.role === 'admin') {
        return true;
      }
    }
  }
}
