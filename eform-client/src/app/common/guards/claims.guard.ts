import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { UserClaimsEnum } from 'src/app/common/const';
import { AuthStateService } from 'src/app/common/store';

@Injectable()
export class ClaimsGuard implements CanActivate {
  constructor(private authStateService: AuthStateService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const claim = UserClaimsEnum[route.data['requiredClaim']] as string;
    return !claim || this.authStateService.checkClaim(claim);
    // return userClaims.hasOwnProperty(claim) && userClaims[claim] === 'True';
  }
}
