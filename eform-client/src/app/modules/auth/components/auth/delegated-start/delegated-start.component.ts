import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {
  delegatedAuthorizeUrl,
  generateDelegatedState,
  storeDelegatedState,
  tenantCustomerNo,
} from '../../../delegated-state';

/**
 * The tenant's entry point for a delegated sign-in, and the reason the flow is
 * TENANT-initiated rather than portal-initiated.
 *
 * The portal's "Åbn kundens system" navigates straight here, carrying nothing: no assertion,
 * no token, no steerable parameter. This route generates a `state`, keeps it in
 * sessionStorage on THIS origin, and bounces the browser to the portal's bridge page with
 * only its copy. The portal authenticates the advisor, mints the assertion with that `state`
 * echoed inside, and redirects back to `/auth/delegated`, where the two are compared before
 * anything is posted. See delegated-state.ts for why that comparison closes login CSRF.
 *
 * Nothing about the destination comes from the URL. The portal host is a constant and the
 * customerNo is read off this tenant's own hostname, both of which an attacker cannot
 * choose. A `?customerNo=`, `?issuer=` or `?redirect_uri=` on this route is ignored
 * entirely — reading any of them would turn this page into the open redirect the portal
 * side deliberately does not have.
 */
@Component({
  selector: 'app-delegated-start',
  templateUrl: './delegated-start.component.html',
  imports: [RouterLink, TranslatePipe],
})
export class DelegatedStartComponent implements OnInit {
  /** Translation key of the message to show, or null while the browser is on its way out. */
  errorKey: string | null = null;

  ngOnInit(): void {
    const customerNo = tenantCustomerNo(this.tenantHostname());
    const state = customerNo === null ? null : generateDelegatedState();

    // One generic message for every reason: not a customer tenant's hostname, no CSPRNG, or
    // site data blocked so the state could not be kept. Each of them means this browser
    // cannot prove on the way back that it asked, so none of them may start the round trip.
    if (customerNo === null || state === null || !storeDelegatedState(state)) {
      this.errorKey = 'Delegated sign-in unavailable';
      return;
    }

    this.assignLocation(delegatedAuthorizeUrl(customerNo, state));
  }

  /** Seam for tests. This tenant's own, server-controlled hostname. */
  protected tenantHostname(): string {
    return window.location.hostname;
  }

  /** Seam for tests. A full-page navigation: the portal is another origin, so not the Router. */
  protected assignLocation(url: string): void {
    window.location.assign(url);
  }
}
