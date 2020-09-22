import {DatePipe, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {AdminGuard, AuthGuard, CanDeactivateGuard, PermissionGuard} from 'src/app/common/guards';
import {ClaimsGuard} from 'src/app/common/guards/claims.guard';
import {EventBrokerService} from 'src/app/common/helpers';
import {
  EntitySearchService,
  EntitySelectService,
  SitesService,
  SiteTagsService,
  UnitsService,
  WorkersService
} from 'src/app/common/services/advanced';
import {AppMenuService, AppSettingsService} from 'src/app/common/services/settings';
import {AuthService, GoogleAuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {CasePostsService, CasesService, TemplateFilesService} from 'src/app/common/services/cases';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {EformReportService, EFormService, EformTagService} from 'src/app/common/services/eform';
import {SecurityGroupEformsPermissionsService, SecurityGroupsService} from 'src/app/common/services/security';
import {AdminService} from 'src/app/common/services/users';
import {FoldersService} from './common/services/advanced/folders.service';
import {PluginPermissionsService, PluginsManagementService} from './common/services/plugins-management';
import {EmailRecipientsService, EmailRecipientsTagsService} from './common/services/email-recipients';
import {LoaderService} from './common/services/loeader.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {LoaderInterceptor} from 'src/app/common/interceptors/loader-interceptor.service';
import {UserClaimsInterceptor} from 'src/app/common/interceptors/user-claims.interceptor';
import {HttpErrorInterceptor, JwtInterceptor} from 'src/app/common/interceptors';
import {GALLERY_CONFIG} from '@ngx-gallery/core';
// Guards

export let providers = [
  // Guards
  AuthGuard,
  AdminGuard,
  CanDeactivateGuard,
  ClaimsGuard,
  PermissionGuard,
  // Libs services
  ToastrService,
  CookieService,
  // Services
  AuthService,
  GoogleAuthService,
  LocaleService,
  UserSettingsService,
  AppSettingsService,
  PluginsManagementService,
  AppMenuService,
  DeviceUserService,
  UnitsService,
  SitesService,
  SiteTagsService,
  WorkersService,
  FoldersService,
  AdminService,
  EntitySearchService,
  EntitySelectService,
  EFormService,
  EformTagService,
  EformReportService,
  EmailRecipientsService,
  EmailRecipientsTagsService,
  CasesService,
  CasePostsService,
  TemplateFilesService,
  SecurityGroupsService,
  SecurityGroupEformsPermissionsService,
  PluginPermissionsService,
  LoaderService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UserClaimsInterceptor, multi: true },
  {
    provide: GALLERY_CONFIG,
    useValue: {
      counterPosition: 'bottom'
    }
  },
  // Helpers
  EventBrokerService,
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }
];
