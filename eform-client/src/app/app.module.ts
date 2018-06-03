import {PreloadResolverConfig} from 'app/configs';
import {AppRoutingModule} from './app.routing';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxGalleryModule} from 'ngx-gallery';
import {DndModule} from 'ng2-dnd';

import {AccountManagementModule, SimpleSitesModule, SettingsModule, AdvancedModule, HelpersModule} from 'app/modules';
import {PluginsModule} from 'app/plugins/plugins.module';
import {AppComponent, AuthComponent, RestorePasswordComponent, HeaderComponent,
  NavigationComponent, FooterComponent} from 'app/components';
import {FullLayoutComponent, SimpleLayoutComponent} from 'app/layouts';
import {
  AdminService, EntitySearchService, EntitySelectService, SettingsService,
  SitesService, UnitsService, WorkersService, CasesService, AuthService, NotifyService,
  ImageService, SimpleSitesService, EFormService, EformTagService
} from 'app/services';
import {AuthGuard} from 'app/guards';
import {EqualValidatorDirective} from 'app/components/directives/equal-validator.directive';



// import {
//   AdminService,
//   AuthService,
//   EntitySearchService,
//   SettingsService,
//   SitesService,
//   UnitsService,
//   EFormService,
//   CasesService,
//   SimpleSitesService,
//   WorkersService
// } from 'app/services';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RestorePasswordComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    EqualValidatorDirective
  ],
  imports: [
    PluginsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SimpleSitesModule,
    AdvancedModule,
    HttpModule,
    SettingsModule,
    NgxGalleryModule,
    HelpersModule,
    AccountManagementModule,
    BrowserAnimationsModule,
    CommonModule,
    DndModule.forRoot()
  ],
  providers: [
    NotifyService,
    AuthGuard,
    AuthService,
    SitesService,
    CasesService,
    AdminService,
    NotifyService,
    UnitsService,
    SitesService,
    WorkersService,
    UnitsService,
    SimpleSitesService,
    EntitySearchService,
    EntitySelectService,
    SettingsService,
    EFormService,
    ImageService,
    EformTagService,
    PreloadResolverConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
