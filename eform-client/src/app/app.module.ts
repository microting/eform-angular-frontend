import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryModule } from '@ngx-gallery/core';
import { GallerizeModule } from '@ngx-gallery/gallerize';
import { TranslateModule } from '@ngx-translate/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { DragulaModule } from 'ng2-dragula';
import { ToastrModule } from 'ngx-toastr';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { providers } from 'src/app/app.declarations';
import { AppRoutingModule } from 'src/app/app.routing';
import { translateConfig } from 'src/app/common/helpers';
import { PluginsModule } from 'src/app/plugins/plugins.module';
import {
  AppComponent,
  FooterComponent,
  FullLayoutComponent,
  HeaderComponent,
  NavigationComponent,
  SimpleLayoutComponent,
  SpinnerComponent,
} from './components';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from 'src/environments/environment';
import {MatNativeDateModule} from '@angular/material/core';

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
  ],
  imports: [
    // Libs
    AppRoutingModule,
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    TranslateModule.forRoot(translateConfig),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    DragulaModule.forRoot(),
    GalleryModule,
    LightboxModule,
    GallerizeModule,
    FontAwesomeModule,
    NgxChartsModule,
    // Modules
    PluginsModule,
    MatNativeDateModule,
    EformSharedModule,
    AkitaNgDevtools,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [providers],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }
}
