import { Injectable, OnDestroy, inject } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Store} from '@ngrx/store';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  private translate = inject(TranslateService);

  private subscription = new Subscription();
  OF_LABEL = 'of';
  PAGE = 'Page';

  constructor() {
    super();

    const langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.getAndInitTranslations();
    });
    this.subscription.add(langChangeSubscription);

    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    const translationSubscription = this.translate.get([
      'PAGINATOR.PAGE',
      'PAGINATOR.ITEMS_PER_PAGE',
      'PAGINATOR.NEXT_PAGE',
      'PAGINATOR.PREVIOUS_PAGE',
      'PAGINATOR.OF_LABEL',
    ]).subscribe(translation => {
      this.PAGE = translation['PAGINATOR.PAGE'];
      this.itemsPerPageLabel = translation['PAGINATOR.ITEMS_PER_PAGE'];
      this.nextPageLabel = translation['PAGINATOR.NEXT_PAGE'];
      this.previousPageLabel = translation['PAGINATOR.PREVIOUS_PAGE'];
      this.OF_LABEL = translation['PAGINATOR.OF_LABEL'];
      this.changes.next();
    });
    this.subscription.add(translationSubscription);
  }

  getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ) => {
    const amountPages = Math.ceil(length / pageSize);
    if (length === 0 || pageSize === 0) {
      return `${this.PAGE} 1 ${this.OF_LABEL} 1`;
    }
    return `${this.PAGE} ${page + 1} ${
      this.OF_LABEL
    } ${amountPages}`;
  };

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
