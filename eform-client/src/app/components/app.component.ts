import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AuthService, TitleService, UserSettingsService} from 'src/app/common/services';
import { Router, RouterOutlet } from '@angular/router';
import {Store} from '@ngrx/store';
import {take, zip, debounceTime} from 'rxjs';
import {
  selectAuthIsAuth,
  AuthSyncStorageService,
  updateUserInfo,
} from 'src/app/state';
import {AuthStateService} from 'src/app/common/store';
import {TranslateService} from '@ngx-translate/core';
import { SpinnerComponent } from './eform-spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomOverlayContainer } from 'src/app/common/services/custom-overlay-container.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [SpinnerComponent, RouterOutlet]
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authStore = inject(Store);
  private userSettings = inject(UserSettingsService);
  authStateService = inject(AuthStateService);
  private service = inject(AuthService);
  private translateService = inject(TranslateService);
  private ngTitle = inject(Title);
  private titleService = inject(TitleService);
  private authSyncStorageService = inject(AuthSyncStorageService);
  private dialog = inject(MatDialog);
  private overlayContainer = inject(CustomOverlayContainer);

  public selectIsAuth$ = this.authStore.select(selectAuthIsAuth);

  constructor() {
    // Automatically move overlay container into dialogs for Angular 21 popover compatibility
    // This ensures dropdowns (mtx-select, ng-select) appear above modal content
    this.dialog.afterOpened.subscribe(dialogRef => {
      // Use setTimeout to ensure dialog element is in DOM
      setTimeout(() => {
        const dialogElement = document.querySelector('.mat-mdc-dialog-container');
        if (dialogElement) {
          this.overlayContainer.setContainerParent(dialogElement as HTMLElement);
        }
      }, 0);

      // Restore overlay container when dialog closes
      dialogRef.afterClosed().subscribe(() => {
        this.overlayContainer.restoreContainerParent();
      });
    });
  }

  ngOnInit(): void {
    this.authSyncStorageService.init();
    this.selectIsAuth$.pipe(debounceTime(1000), take(1)).subscribe((isAuth) => {
      if (isAuth) {
        zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims())
          .pipe(take(1))
          .subscribe(([userSettings, userClaims]) => {
            if (userClaims === null) {
              this.authStateService.logout();
            } else {
              console.debug('AppComponent - ngOnInit - zip - userSettings', userSettings);
              console.debug('AppComponent - ngOnInit - zip - userClaims', userClaims);
              this.authStore.dispatch(updateUserInfo({userSettings: userSettings, userClaims: userClaims}))
              this.authStateService.setLocale();
              this.translateService.use(userSettings.model.locale);
            }
          });
      } else {
        if (this.router.url.includes('reset-admin-password') ||
          this.router.url.includes('restore-password-confirmation') ||
          this.router.url.includes('restore-password')) {} else {
          this.authStateService.logout();
        }
      }
    });
    this.subChangeTitle();
  }

  subChangeTitle() {
    console.debug('AppComponent - subChangeTitle');
    const defaultTitle = 'eForm Backend';
    this.titleService.title.subscribe(title => {
      if (title && title !== defaultTitle) {
        this.ngTitle.setTitle(`${title} - ${defaultTitle}`);
      } else {
        this.ngTitle.setTitle(defaultTitle);
      }
    });
  }

  ngOnDestroy(): void {
  }
}
