import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {MatPaginatorIntl} from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  private subscription = new Subscription();
  OF_LABEL = 'of';

  constructor(private translate: TranslateService) {
    super();

    const langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.getAndInitTranslations();
    });
    this.subscription.add(langChangeSubscription);

    this.getAndInitTranslations();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAndInitTranslations() {
    const translationSubscription = this.translate.get([
      'PAGINATOR.ITEMS_PER_PAGE',
      'PAGINATOR.NEXT_PAGE',
      'PAGINATOR.PREVIOUS_PAGE',
      'PAGINATOR.OF_LABEL',
    ]).subscribe(translation => {
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
    if (length === 0 || pageSize === 0) {
      return `0 ${this.OF_LABEL} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${
      this.OF_LABEL
    } ${length}`;
  };
}
