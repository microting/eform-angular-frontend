import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {TranslateModule} from '@ngx-translate/core';
import { LightboxModule } from  '@ngx-gallery/lightbox';
import {DragulaModule} from 'ng2-dragula';
import {ToastrModule} from 'ngx-toastr';

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



// const routes = [{
//   path: '',
//   component: FullLayoutComponent,
//   children: [
//     {path: '', component: BareboneComponent},
//     {path: 'application-settings', component: SettingsComponent},
//     {path: 'account-management/settings', component: ProfileSettingsComponent},
//     {path: 'account-management/change-password', component: ChangePasswordComponent},
//     {path: 'account-management/users', component: UsersPageComponent},
//     {path: 'simplesites', component: DeviceUsersPageComponent},
//     {path: 'dbsetup', component: DatabaseSetupComponent}
//     ]},
//   {
//     path: '',
//     component: SimpleLayoutComponent,
//     children: [
//       {path: 'auth', component: AuthComponent}]
//   }];


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
    ToastrModule.forRoot(),
    DragulaModule.forRoot(),
    GalleryModule.forRoot(),
    LightboxModule.forRoot(),
    GallerizeModule,
    // Modules
    PluginsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [providers],
  bootstrap: [AppComponent]
})
export class AppModule {
}
