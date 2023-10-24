import {
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {Subscription} from 'rxjs';
import UserbackWidgetLoader, {UserbackWidget} from '@userback/widget';
import {AppSettingsStateService, AppSettingsQuery} from 'src/app/modules/application-settings/components/store';
import {UserbackWidgetSettingModel} from 'src/app/common/models';
import {selectCurrentUserFullName, selectCurrentUserName} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-userback-widget',
  templateUrl: './userback-widget.component.html',
  styleUrls: ['./userback-widget.component.scss'],
})
export class UserbackWidgetComponent implements OnInit, OnDestroy {
  private isShowing: boolean = false;
  private loadWidget: boolean = false;
  private userbackToken: string;
  private widget: UserbackWidget;
  private selectCurrentUserFullName$ = this.authStore.select(selectCurrentUserFullName);
  private selectCurrentUserName$ = this.authStore.select(selectCurrentUserName);

  isAuthSub$: Subscription;
  getUserbackWidgetIsEnabledSub$: Subscription;

  constructor(
    private authStore: Store,
    private authStateService: AuthStateService,
    private appSettingsQuery: AppSettingsQuery,
    private appSettingsStateService: AppSettingsStateService,
  ) {
  }

  ngOnInit(): void {
    // TODO: Fix this
    // this.isAuthSub$ = this.authStateService.isAuthAsync.subscribe((isAuth?: boolean) => this.onIsAuthAsync(isAuth));
  }

  onIsAuthAsync(isAuth?: boolean) {
    if (isAuth) {
      if (isAuth && !this.getUserbackWidgetIsEnabledSub$) {
        this.appSettingsStateService.getOtherSettings();
        this.getUserbackWidgetIsEnabledSub$ = this.appSettingsQuery.selectOthersSettings$
          .subscribe((WidgetSettings) => WidgetSettings ? this.onSelectOthersSettings(WidgetSettings, isAuth) : void 0);
      }
    }
  }

  onSelectOthersSettings(WidgetSettings: UserbackWidgetSettingModel, isAuth: boolean) {
    if (WidgetSettings.isUserbackWidgetEnabled) {
      this.userbackToken = WidgetSettings.userbackToken;
      if (isAuth && !this.isShowing && !this.loadWidget) {
        this.show();
      } else if (!isAuth && this.isShowing) {
        this.hide();
      }
    }
    if (!WidgetSettings.isUserbackWidgetEnabled && this.isShowing) {
      this.hide();
    }
  }


  hide(): void {
    if (this.widget) {
      this.widget.destroy();
      this.isShowing = false;
    }
  }

  show(): void {
    this.loadWidget = true;
    let email = '';
    let fullName = '';
    this.selectCurrentUserFullName$.subscribe((x) => {
      fullName = x;
    });
    this.selectCurrentUserName$.subscribe((x) => {
      email = x;
    });
    UserbackWidgetLoader(this.userbackToken, {
      on_load: () => {
        // todo on_load don't work if javascript api not enabled. Detail https://support.userback.io/en/articles/5209252-javascript-api
        this.isShowing = true;
        this.loadWidget = false;
      },
      email: email,
      name: fullName,
    }).then(x => {
      // todo Promise don't work (not return widget) if javascript api not enabled. Detail https://support.userback.io/en/articles/5209252-javascript-api
      this.widget = x;
    });
  }

  ngOnDestroy(): void {
    this.hide();
    if (this.isAuthSub$) {
      this.isAuthSub$.unsubscribe();
    }
    if (this.getUserbackWidgetIsEnabledSub$) {
      this.getUserbackWidgetIsEnabledSub$.unsubscribe();
    }
  }
}
