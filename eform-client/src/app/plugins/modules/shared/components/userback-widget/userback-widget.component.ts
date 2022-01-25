import {
  Component,
  OnInit
} from '@angular/core';
import {AuthQuery, AuthStateService} from 'src/app/common/store';

@Component({
  selector: 'app-userback-widget',
  templateUrl: './userback-widget.component.html',
  styleUrls: ['./userback-widget.component.scss'],
})
export class UserbackWidgetComponent implements OnInit {
  private scriptElement: HTMLScriptElement;
  private isShowing: boolean = false;

  constructor(
    private authStateService: AuthStateService,) {
  }

  ngOnInit(): void {
    this.authStateService.isAuthAsync.subscribe(isAuth => {
      if (isAuth && !this.isShowing) {
        this.show();
      } else if(!isAuth && this.isShowing) {
        this.hide();
      }
    })
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
