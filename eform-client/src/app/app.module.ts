import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GalleryModule} from 'ng-gallery';
import {TranslateModule} from '@ngx-translate/core';
import {LightboxModule} from 'ng-gallery/lightbox';
import {DragulaModule} from 'ng2-dragula';
// TODO fix ngx-mask
//import {NgxMaskModule} from 'ngx-mask';
import {ToastrModule} from 'ngx-toastr';
import {providers} from './app.declarations';
import {AppRoutingModule} from './app.routing';
import {translateConfig} from './common/helpers';
import {PluginsModule} from './plugins/plugins.module';
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
import {EformSharedModule} from './common/modules/eform-shared/eform-shared.module';
import {environment} from 'src/environments/environment';
// angular material modules
import {SharedPnModule} from './plugins/modules/shared/shared-pn.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  EformMatDateFnsDateModule
} from './common/modules/eform-date-adapter/eform-mat-datefns-date-adapter.module';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {
  AppMenuEffects,
  appMenuReducer,
  appSettingsReducer,
  authReducer,
  casesReducer,
  deviceUsersReducer,
  eformReducer,
  emailRecipientsReducer,
  entitySearchReducer,
  entitySelectReducer,
  pluginsReducer,
  securityReducer,
  usersReducer,
} from './state';
import {NgxMaskDirective, NgxMaskPipe} from "ngx-mask";

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

    NgxMaskDirective, NgxMaskPipe,
    // Libs
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({
      appMenus: appMenuReducer,
      appSettings: appSettingsReducer,
      auth: authReducer,
      cases: casesReducer,
      deviceUsers: deviceUsersReducer,
      eforms: eformReducer,
      emailRecipients: emailRecipientsReducer,
      entitySearch: entitySearchReducer,
      entitySelect: entitySelectReducer,
      plugins: pluginsReducer,
      security: securityReducer,
      users: usersReducer,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot(AppMenuEffects),
    AppRoutingModule,
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
    NgxChartsModule,
    SharedPnModule,
    MatSidenavModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatExpansionModule,
    MtxSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    // Modules
    PluginsModule,
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
    console.debug('AppModule - constructor');
  }
}
