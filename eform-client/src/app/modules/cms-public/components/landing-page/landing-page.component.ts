import {Component, OnInit, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {CmsPublicLandingModel} from 'src/app/common/models';
import {loadCmsLanding, selectCmsLandingPage, selectIsMenuSticky} from 'src/app/state/cms';

@Component({
  standalone: false,
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  private store = inject(Store);

  landingPage$: Observable<CmsPublicLandingModel | null> = this.store.select(selectCmsLandingPage);
  isMenuSticky$: Observable<boolean> = this.store.select(selectIsMenuSticky);

  ngOnInit(): void {
    this.store.dispatch(loadCmsLanding());
  }
}
