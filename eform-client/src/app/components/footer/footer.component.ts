import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectCurrentUserFullName,
  selectCurrentUserName,
  selectCurrentUserAvatarUrl,
  leftAppMenus, selectCurrentUserClaims, rightAppMenus, selectAuthIsAdmin
} from 'src/app/state';

import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {snakeToCamel} from "src/app/common/helpers";
import {TranslatePipe} from '@ngx-translate/core';
import {SentryFeedbackService} from 'src/app/common/services';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    MatMenuTrigger,
    MatMenu,
    MatIcon,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgForOf,
    TranslatePipe
  ]
})
export class FooterComponent implements OnInit {
  private store = inject(Store);
  private authStore = inject(Store);
  private destroyRef = inject(DestroyRef);
  private sentryFeedbackService = inject(SentryFeedbackService);
  private selectCurrentUserClaims$ = this.authStore.select(selectCurrentUserClaims);

  fullName = '';
  userName = '';
  avatarUrl = '';

  public allAppMenus$ = this.store.select(rightAppMenus);
  // "Report a bug" is admin-only for now, and only exists where Sentry is running.
  public showReportBug$: Observable<boolean> = this.store.select(selectAuthIsAdmin)
    .pipe(map(isAdmin => isAdmin && this.sentryFeedbackService.isEnabled));

  ngOnInit() {
    this.store.select(selectCurrentUserFullName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(name => this.fullName = name);

    this.store.select(selectCurrentUserName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.userName = user);

    this.store.select(selectCurrentUserAvatarUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(url => this.avatarUrl = url);
  }

  checkGuards(guards: string[]): Observable<boolean> {
    if (guards.length === 0) {
      return new Observable<boolean>(x => x.next(true));
    }
    return this.selectCurrentUserClaims$.pipe(map(x => {
      for (const guard of guards) {
        if (x[snakeToCamel(guard)]) {
          return true;
        }
      }
      return false;
    }));
  }

  reportBug() {
    void this.sentryFeedbackService.openForm();
  }

  logout() {
    // add logout logic here
  }
}
