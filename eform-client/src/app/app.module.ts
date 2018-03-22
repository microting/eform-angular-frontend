import {HelpersModule} from './modules/helpers/helpers.module';
import {AppRoutingModule} from './app.routing';
import {AdvancedModule} from 'app/modules/advanced/advanced.module';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './components/app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {FullLayoutComponent} from './layouts/fulllayout/fulllayout.component';
import {SettingsModule} from './modules/settings/settings.module';
import {DndModule} from 'ng2-dnd';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AccountManagementModule} from 'app/modules/account-management/account-management.module';
import {AuthComponent} from 'app/components/auth/auth.component';
import {SimpleLayoutComponent} from 'app/layouts/simple-layout/simple-layout.component';
import {SimpleSitesModule} from 'app/modules/simple-sites/simple-sites.module';
import {EFormService} from 'app/services/eform/eform.service';
import {
  AdminService, EntitySearchService, EntitySelectService, SettingsService, SitesService, UnitsService,
  WorkersService
} from 'app/services';
import {SimpleSitesService} from 'app/services/simple-sites.service';
import {NotifyService} from 'app/services/notify.service';
import {CasesService} from 'app/services/cases/cases.service';
import {AuthService} from 'app/services/accounts/auth.service';
import {AuthGuard} from 'app/guards/auth.guard';
import {ImageService} from './services/files';
import {RestorePasswordComponent} from 'app/components/auth/restore-password.component';
import {EqualValidatorDirective} from 'app/components/directives/equal-validator.directive';
import {NgxGalleryModule} from 'ngx-gallery';
import {EformTagService} from 'app/services/eform/eform-tag.service';

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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
