import {Component, DestroyRef, OnInit, inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {Store} from '@ngrx/store';
import {selectAuthIsAuth} from 'src/app/state/auth/auth.selector';
import {takeDelegatedAssertion} from '../../../delegated-assertion';
import {readAssertionState, takeDelegatedState} from '../../../delegated-state';
import {take} from 'rxjs';

/**
 * Landing route for a partner advisor arriving from my.microting.com.
 *
 * The portal redirects to `/auth/delegated#assertion=<jwt>`. The assertion is
 * credential-equivalent, so it travels in the URL FRAGMENT only. main.ts lifts it out of the
 * URL before Sentry initialises (see delegated-assertion.ts); this component reads the
 * in-memory value. A `?assertion=` query parameter is ignored. If a session already exists the
 * route refuses rather than replacing it.
 *
 * The flow is tenant-initiated, so this route is NOT reachable on its own terms: it only
 * accepts an assertion echoing the `state` that /auth/delegated/start left on this origin
 * before the portal was ever contacted. An assertion arriving at a browser that holds no
 * state — the link an attacker mails to a victim — is refused without being posted. That is
 * the login-CSRF defence; delegated-state.ts explains why it holds.
 *
 * A refused assertion is spent: no automatic retry; the advisor must click through again.
 */
@Component({
  selector: 'app-delegated',
  templateUrl: './delegated.component.html',
  imports: [RouterLink, TranslatePipe],
})
export class DelegatedComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private destroyRef = inject(DestroyRef);

  /** Translation key of the message to show, or null while signing in. */
  errorKey: string | null = null;

  ngOnInit(): void {
    const assertion = takeDelegatedAssertion();
    // Taken, and so cleared, unconditionally and before any branch below: a state is good
    // for exactly one attempt, and no refusal path may leave a usable one behind for a
    // second one to spend.
    const expectedState = takeDelegatedState();
    let alreadySignedIn = false;
    this.store.select(selectAuthIsAuth).pipe(take(1)).subscribe((isAuth) => (alreadySignedIn = isAuth));
    if (alreadySignedIn) {
      // Never silently swap a live session (login CSRF): the assertion is dropped unused.
      this.errorKey = 'Delegated sign-in session exists';
      return;
    }
    if (!assertion) {
      this.errorKey = 'Delegated sign-in missing assertion';
      return;
    }
    // LOGIN CSRF. expectedState is null when this browser never started a sign-in here, so
    // an assertion mailed to a victim fails on its first condition and is never posted. The
    // message is the ordinary refusal: it says nothing about which condition failed.
    if (!expectedState || readAssertionState(assertion) !== expectedState) {
      this.errorKey = 'Delegated sign-in refused';
      return;
    }
    const sub = this.authService.loginDelegated(assertion).subscribe({
      next: (response) => {
        if (response) {
          this.authStateService.completeLogin(response);
        } else {
          this.errorKey = 'Delegated sign-in refused';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorKey = DelegatedComponent.errorKeyFor(error);
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /** The backend answers every refusal with the raw literal `DelegatedSignInRefused`. */
  private static errorKeyFor(error: HttpErrorResponse): string {
    if (error?.status === 401 || error?.error?.message === 'DelegatedSignInRefused') {
      return 'Delegated sign-in refused';
    }
    return 'Delegated sign-in failed';
  }
}
