import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStateService } from 'src/app/common/store';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private authStateService: AuthStateService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredPermission = route.data['requiredPermission'];
    return !requiredPermission || this.authStateService.checkClaim(requiredPermission);
  }
}
