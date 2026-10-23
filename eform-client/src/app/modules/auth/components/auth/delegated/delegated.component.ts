import {Component, DestroyRef, OnInit, inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';

/**
 * Landing route for a partner advisor arriving from my.microting.com.
 *
 * The portal redirects to `/auth/delegated#assertion=<jwt>`. The assertion is
 * credential-equivalent, so it travels in the URL FRAGMENT only: a fragment is never sent to
 * the server, never appears in Referer and stays out of access/proxy logs. It is read once and
 * wiped from the address bar before any HTTP call. A `?assertion=` query parameter is ignored.
 *
 * A refused assertion is spent: no automatic retry; the advisor must click through again.
 */
@Component({
  selector: 'app-delegated',
  templateUrl: './delegated.component.html',
  imports: [RouterLink, TranslatePipe],
})
export class DelegatedComponent implements OnInit {
  private document = inject(DOCUMENT);
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private destroyRef = inject(DestroyRef);

  /** Translation key of the message to show, or null while signing in. */
  errorKey: string | null = null;

  ngOnInit(): void {
    const assertion = this.takeAssertionFromFragment();
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

  private takeAssertionFromFragment(): string | null {
    const win = this.document.defaultView;
    if (!win) {
      return null;
    }
    const hash = win.location.hash;
    const assertion = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash).get('assertion');
    if (hash) {
      // replaceState drops the fragment entirely (no stray '#', no extra history entry).
      win.history.replaceState(win.history.state, '', win.location.pathname + win.location.search);
    }
    return assertion;
  }
}
