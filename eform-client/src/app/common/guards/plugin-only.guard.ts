import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
import { selectAuthToken, selectLoginRedirectUrl } from 'src/app/state';

/** A role that is neither admin nor user: a plugin-only account (e.g. kanban signups). */
export function isPluginOnlyRole(role: string | null | undefined): boolean {
  const r = (role ?? '').toLowerCase();
  return r !== '' && r !== 'admin' && r !== 'user';
}

/** Main-application pages: plugin-only users go to their landing page (their security group's redirect link). */
export const NotPluginOnlyGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return combineLatest([store.select(selectAuthToken), store.select(selectLoginRedirectUrl)]).pipe(
    take(1),
    map(([token, redirect]) => isPluginOnlyRole(token?.role) ? router.createUrlTree([`/${redirect || 'auth'}`]) : true),
  );
};
