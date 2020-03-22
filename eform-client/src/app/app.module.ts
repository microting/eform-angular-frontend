import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {TranslateModule} from '@ngx-translate/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import {DragulaModule} from 'ng2-dragula';
import {ToastrModule} from 'ngx-toastr';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
// import { faTrashAlt,  faTable, faFileUpload, faReceipt, faFilePdf, faPen,
//          faEye, faEyeSlash, faUndo, faClipboardList, faLockOpen} from '@fortawesome/free-solid-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';

import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {providers} from 'src/app/app.declarations';
import {AppRoutingModule} from 'src/app/app.routing';
import {translateConfig} from 'src/app/common/helpers';
import {PluginsModule} from 'src/app/plugins/plugins.module';
import {
  AppComponent,
  FooterComponent,
  HeaderComponent,
  NavigationComponent,
  SimpleLayoutComponent,
  FullLayoutComponent,
} from './components';
//import {assertLessThan} from '@angular/core/src/render3/assert';
// import {importedIcons} from 'src/app/common/const';
import {NgxChartsModule} from '@microting/ngx-charts';
@NgModule({
  declarations: [
    // Layouts
    SimpleLayoutComponent,
    FullLayoutComponent,
    // Components
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent
  ],
  imports: [
    // Libs
    AppRoutingModule,
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    TranslateModule.forRoot(translateConfig),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {preventDuplicates: true}
    ),
    DragulaModule.forRoot(),
    GalleryModule,
    LightboxModule,
    GallerizeModule,
    FontAwesomeModule,
    NgxChartsModule,
    // Modules
    PluginsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [providers],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Font Awesome
    // library.add(faTrashAlt,  faTable, faFileUpload, faReceipt, faFilePdf, faPen, faEye, faEyeSlash, faUndo, faClipboardList, faLockOpen);
    library.add(fas);

    // library.add(...importedIcons);
  }
}
