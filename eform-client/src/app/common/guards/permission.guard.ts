import { Injectable } from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {PluginClaimsHelper} from '../helpers';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor() { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const requiredPermission = route.data['requiredPermission'];

      return PluginClaimsHelper.check(requiredPermission);
  }
}
