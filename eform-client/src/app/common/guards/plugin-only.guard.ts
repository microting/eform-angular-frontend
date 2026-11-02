import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
import { selectAuthToken, selectLoginRedirectUrl } from 'src/app/state';

/** Where a plugin-only user lands when their security group's redirect is missing or points at the main app. */
export const PLUGIN_ONLY_FALLBACK_URL = '/account-management/settings';

/** The role claim names the host writes into the JWT (ClaimTypes.Role, unmapped) or a mapped short name. */
const ROLE_CLAIMS = ['http://schemas.microsoft.com/ws/2008/06/identity/claims/role', 'role'];

/** A role that is neither admin nor user: a plugin-only account (e.g. kanban signups). */
export function isPluginOnlyRole(role: string | null | undefined): boolean {
  return isPluginOnlyRoles(role ? [role] : []);
}

/** Same rule as the backend (MenuService.IsPluginOnly): at least one role and none is admin or user. */
export function isPluginOnlyRoles(roles: string[]): boolean {
  const r = roles.filter((x) => !!x).map((x) => x.toLowerCase());
  return r.length > 0 && !r.includes('admin') && !r.includes('user');
}

/** Every role claim in the access token's payload (a string or an array), or null when it cannot be read. */
export function rolesFromAccessToken(accessToken: string | null | undefined): string[] | null {
  const payload = accessToken?.split('.')[1];
  if (!payload) {
    return null;
  }
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));
    return ROLE_CLAIMS.flatMap((name) => {
      const value = claims[name];
      return Array.isArray(value) ? value.map(String) : value != null ? [String(value)] : [];
    });
  } catch {
    return null;
  }
}

/** Plugin-only from all of the token's roles; the stored `role` is only the first one, so it is the fallback. */
export function isPluginOnlyToken(token: { accessToken?: string; role?: string } | null | undefined): boolean {
  return isPluginOnlyRoles(rolesFromAccessToken(token?.accessToken) ?? (token?.role ? [token.role] : []));
}

/** The landing page for a plugin-only user: their redirect when it is a plugin or account page, else the fallback
 * (a main-app redirect, or /auth, would bounce back here or to the login page in a loop). */
export function pluginOnlyLandingUrl(redirect: string | null | undefined): string {
  const path = (redirect ?? '').replace(/^\/+/, '');
  return /^(plugins|account-management)(\/|$)/.test(path) ? `/${path}` : PLUGIN_ONLY_FALLBACK_URL;
}

/** Main-application pages: plugin-only users go to their landing page (their security group's redirect link). */
export const NotPluginOnlyGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return combineLatest([store.select(selectAuthToken), store.select(selectLoginRedirectUrl)]).pipe(
    take(1),
    map(([token, redirect]) =>
      isPluginOnlyToken(token) ? router.parseUrl(pluginOnlyLandingUrl(redirect)) : true),
  );
};
