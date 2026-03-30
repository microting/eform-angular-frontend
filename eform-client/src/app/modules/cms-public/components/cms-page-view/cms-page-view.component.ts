import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, of, switchMap} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {CmsPublicLandingModel} from 'src/app/common/models';
import {CmsService} from 'src/app/common/services/cms/cms.service';
import {selectIsMenuSticky} from 'src/app/state/cms';

@Component({
  standalone: false,
  selector: 'app-cms-page-view',
  templateUrl: './cms-page-view.component.html',
  styleUrls: ['./cms-page-view.component.scss'],
})
export class CmsPageViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cmsService = inject(CmsService);
  private store = inject(Store);

  page$!: Observable<CmsPublicLandingModel | null>;
  isMenuSticky$: Observable<boolean> = this.store.select(selectIsMenuSticky);

  ngOnInit(): void {
    this.page$ = this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug') ?? '';
        return this.cmsService.getPublicPage(slug).pipe(
          map(result => result.success ? result.model : null),
          catchError(() => of(null))
        );
      })
    );
  }
}
