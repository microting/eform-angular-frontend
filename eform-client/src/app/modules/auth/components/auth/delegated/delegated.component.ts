import {Component, DestroyRef, OnInit, inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {Store} from '@ngrx/store';
import {selectAuthIsAuth} from 'src/app/state/auth/auth.selector';
import {takeDelegatedAssertion} from '../../../delegated-assertion';
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
