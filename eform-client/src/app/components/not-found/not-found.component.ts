import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {EformNewSubheaderComponent} from '../../common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';

/**
 * Shown for a URL that matches no route (#8103), instead of silently
 * redirecting to My eForms. The URL stays in the address bar, so a wrong menu
 * link or bookmark can be read off the page.
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [EformNewSubheaderComponent, TranslatePipe],
})
export class NotFoundComponent {
  private router = inject(Router);

  get requestedUrl(): string {
    return this.router.url;
  }

  goToStartPage() {
    this.router.navigateByUrl('/').then();
  }
}
