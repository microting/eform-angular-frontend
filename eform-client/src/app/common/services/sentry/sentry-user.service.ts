import {Injectable, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import * as Sentry from '@sentry/angular';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {AuthState} from 'src/app/state/auth/auth.recuder';
import {selectAuth} from 'src/app/state/auth/auth.selector';

/** The Sentry user for an auth state, or null when nobody is signed in. */
function toSentryUser(auth: AuthState | undefined): Sentry.User | null {
  const user = auth?.currentUser;
  if (!auth?.token?.accessToken || !user?.id) {
    return null;
  }
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  // userName is the e-mail address the user signs in with. `username` carries the display
  // name because the feedback form prefills its name field from it.
  return {id: user.id, email: user.userName, username: fullName || user.userName};
}

/**
 * Keeps the Sentry user in step with the auth store. One store subscription covers every
 * way the user changes: login, token refresh, a session restored from local storage on
 * page load or from another tab, and logout.
 */
@Injectable({providedIn: 'root'})
export class SentryUserService {
  private store = inject(Store);

  init(): void {
    this.store.select(selectAuth)
      .pipe(
        map(toSentryUser),
        // mirrors the fields toSentryUser fills in
        distinctUntilChanged((a, b) => a?.id === b?.id && a?.email === b?.email && a?.username === b?.username),
      )
      .subscribe(user => Sentry.setUser(user));
  }
}
