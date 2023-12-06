import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {TranslateModule} from '@ngx-translate/core';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {DragulaModule} from 'ng2-dragula';
// TODO fix ngx-mask
//import {NgxMaskModule} from 'ngx-mask';
import {ToastrModule} from 'ngx-toastr';
import {providers} from 'src/app/app.declarations';
import {AppRoutingModule} from 'src/app/app.routing';
import {translateConfig} from 'src/app/common/helpers';
import {PluginsModule} from 'src/app/plugins/plugins.module';
import {
  AppComponent,
  FooterComponent,
  FullLayoutComponent,
  HeaderComponent,
  NavigationComponent,
  SimpleLayoutComponent,
  SpinnerComponent,
  ConnectionSetupComponent,
} from './components';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {environment} from 'src/environments/environment';
// angular material modules
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  EformDateFnsDateModule,
  EformMatDateFnsDateModule
} from 'src/app/common/modules/eform-date-adapter/eform-mat-datefns-date-adapter.module';
import { StoreModule } from '@ngrx/store';
import * as appMenuReducer from 'src/app/state/app-menu/app-menu.reducer';
import * as authReducer from 'src/app/state/auth/auth.recuder';
import * as eformReducer from 'src/app/state/eform/eform.reducer';
import * as deviceUsersReducer from 'src/app/state/device-user/device-user.reducer';
import * as appSettingsReducer from 'src/app/state/application-settings/application-settings.reducer';
import * as emailRecipientsReducer from 'src/app/state/email-recipients/email-recipients.reducer';
import * as securityReducer from 'src/app/state/security/security.reducer';
import * as entitySearchReducer from 'src/app/state/entity-search/entity-search.reducer';
import * as entitySelectReducer from 'src/app/state/entity-select/entity-select.reducer';
import * as casesReducer from 'src/app/state/cases/cases.reducer';
import * as usersReducer from 'src/app/state/users/users.reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {AppMenuEffects} from 'src/app/state/app-menu/app-menu.effects';

@NgModule({
  declarations: [
    // Layouts
    SimpleLayoutComponent,
    FullLayoutComponent,
    // Components
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    SpinnerComponent,
    ConnectionSetupComponent,
  ],
  imports: [
    // Libs
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({
      appMenus: appMenuReducer.reducer,
      auth: authReducer.reducer,
      eforms: eformReducer.reducer,
      deviceUsers: deviceUsersReducer.reducer,
      appSettings: appSettingsReducer.reducer,
      emailRecipients: emailRecipientsReducer.reducer,
      security: securityReducer.reducer,
      entitySearch: entitySearchReducer.reducer,
      entitySelect: entitySelectReducer.reducer,
      cases: casesReducer.reducer,
      users: usersReducer.reducer,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot(AppMenuEffects),
    TranslateModule.forRoot(translateConfig),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      autoDismiss: true,
      timeOut: 3000,
      preventDuplicates: true,
      positionClass: 'toast-bottom-right',
    }),
    DragulaModule.forRoot(),
    // TODO fix ngx-mask
    // NgxMaskModule.forRoot(),
    GalleryModule,
    LightboxModule,
    GallerizeModule,
    NgxChartsModule,
    SharedPnModule,
    MatSidenavModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatChipsModule,
    MatExpansionModule,
    MtxSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    // Modules
    PluginsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    EformSharedModule,
    MatProgressSpinnerModule,
    // EformDateFnsDateModule,
    EformMatDateFnsDateModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [providers],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // eslint-disable-next-line
    console.log('AppModule - constructor');
  }
}
