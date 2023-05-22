import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {TranslateModule} from '@ngx-translate/core';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {DragulaModule} from 'ng2-dragula';
import {NgxMaskModule} from 'ngx-mask';
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
import {SharedPnModule} from './plugins/modules/shared/shared-pn.module';
// angular material modules
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatCardModule} from '@angular/material/card';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
    TranslateModule.forRoot(translateConfig),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({preventDuplicates: true}),
    DragulaModule.forRoot(),
    NgxMaskModule.forRoot(),
    GalleryModule,
    LightboxModule,
    GallerizeModule,
    NgxChartsModule,
    AkitaNgDevtools,
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
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [providers],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
  }
}
