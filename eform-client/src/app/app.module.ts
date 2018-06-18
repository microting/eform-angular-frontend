import {HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {PreloadResolverConfig} from 'app/configs';
import {translateConfig} from 'app/configs/locale.helper';
import {CollapseModule, TooltipModule} from 'ngx-bootstrap';
import {AppRoutingModule} from './app.routing';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxGalleryModule} from 'ngx-gallery';
import {DndModule} from 'ng2-dnd';

import {AccountManagementModule, SimpleSitesModule, ApplicationSettingsModule, AdvancedModule, HelpersModule} from 'app/modules';
import {PluginsModule} from 'app/plugins/plugins.module';
import {
  AppComponent, AuthComponent, RestorePasswordComponent, HeaderComponent,
  NavigationComponent, FooterComponent, SignOutComponent
} from 'app/components';
import {FullLayoutComponent, SimpleLayoutComponent} from 'app/layouts';
import {
  AdminService, EntitySearchService, EntitySelectService, AppSettingsService,
  SitesService, UnitsService, WorkersService, CasesService, AuthService, NotifyService,
  ImageService, SimpleSitesService, EFormService, EformTagService, LocaleService, UserSettingsService
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
    SignOutComponent,
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
    HttpClientModule,
    HttpModule,
    ApplicationSettingsModule,
    NgxGalleryModule,
    HelpersModule,
    AccountManagementModule,
    BrowserAnimationsModule,
    CommonModule,
    TooltipModule.forRoot(),
    DndModule.forRoot(),
    TranslateModule.forRoot(translateConfig),
    CollapseModule.forRoot()
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
    AppSettingsService,
    EFormService,
    ImageService,
    EformTagService,
    LocaleService,
    UserSettingsService,
    PreloadResolverConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
