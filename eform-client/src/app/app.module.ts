import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {GalleryModule} from '@ngx-gallery/core';
// import {GallerizeModule} from '@ngx-gallery/gallerize';
import {TranslateModule} from '@ngx-translate/core';
//import {LightboxModule} from '@ngx-gallery/lightbox';
import {DragulaModule} from 'ng2-dragula';
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
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
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
import {GalleryModule} from 'ng-gallery';
import {LightboxModule} from 'ng-gallery/lightbox';
import { StoreModule } from '@ngrx/store';
import * as appMenuReducer from 'src/app/state/app-menu/app-menu.reducer';
import * as authReducer from 'src/app/state/auth/auth.recuder';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import * as appMenuEffects from 'src/app/state/app-menu/app-menu.effects';
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
      authV2: authReducer.reducer,
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
    GalleryModule,
    LightboxModule,
    // GallerizeModule,
    NgxChartsModule,
    //AkitaNgDevtools,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
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
  }
}
