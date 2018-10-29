import { Injectable } from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {UserClaimsEnum} from 'src/app/common/enums';
import {AuthService} from 'src/app/common/services';

@Injectable()
export class ClaimsGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    debugger;
      const claim = UserClaimsEnum[route.data['requiredClaim']] as string;
      const userClaims = this.authService.userClaims;
      return userClaims[claim];
  }
}
