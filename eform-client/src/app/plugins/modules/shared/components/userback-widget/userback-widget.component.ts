import {
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import { AuthStateService} from 'src/app/common/store';
import {AppSettingsService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-userback-widget',
  templateUrl: './userback-widget.component.html',
  styleUrls: ['./userback-widget.component.scss'],
})
export class UserbackWidgetComponent implements OnInit, OnDestroy {
  private scriptElement: HTMLScriptElement;
  private isShowing: boolean = false;

  isAuthSub$: Subscription;
  getUserbackWidgetIsEnabledSub$: Subscription;

  constructor(
    private settingsService: AppSettingsService,
    private authStateService: AuthStateService,) {
    this.isAuthSub$ = this.authStateService.isAuthAsync.subscribe(isAuth => {
      this.getUserbackWidgetIsEnabledSub$ = this.settingsService.getUserbackWidgetIsEnabled()
      .subscribe((isEnableWidget) => {
        if (isEnableWidget && isEnableWidget.success) {
          if(isEnableWidget.model) {
            if (isAuth && !this.isShowing) {
              this.show();
            } else if (!isAuth && this.isShowing) {
              this.hide();
            }
          }
          if(!isEnableWidget.model && this.isShowing){
            this.hide();
          }
        }
      });
    })
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  hide(): void {
    // @ts-ignore
    window.Userback.destroy();
    this.isShowing = false;
  }

  show(): void {
    // @ts-ignore
    window.Userback = {...window, Userback: window.Userback || {}};
    // @ts-ignore
    window.Userback.access_token = '33542|62605|dEaGb7GN0RoGEOMwEEWGh1pnh';
    this.scriptElement = document.createElement('script');
    this.scriptElement.async = true;
    this.scriptElement.src = 'https://static.userback.io/widget/v1.js';
    (document.head || document.body).appendChild(this.scriptElement);
    this.isShowing = true;
  }
}
