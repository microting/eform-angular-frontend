import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {
  AdminGuard,
  AuthGuard,
  CanDeactivateGuard,
  PermissionGuard,
} from 'src/app/common/guards';
import {ClaimsGuard} from 'src/app/common/guards/claims.guard';
import {EventBrokerService} from 'src/app/common/helpers';
import {
  AdminService,
  ApiBaseService,
  AppMenuService,
  AppSettingsService,
  CasePostsService,
  CasesService,
  DeviceUserService,
  EformDocxReportService,
  EformReportService,
  EFormService,
  EformTagService,
  EmailRecipientsService,
  EmailRecipientsTagsService,
  EntitySearchService,
  EntitySelectService,
  FoldersService,
  GoogleAuthService,
  LoaderService,
  LocaleService,
  NavigationMenuService,
  PluginPermissionsService,
  PluginsManagementService,
  SecurityGroupEformsPermissionsService,
  SecurityGroupsService,
  SitesService,
  TemplateFilesService,
  UnitsService,
  WorkersService,
  TitleService,
} from 'src/app/common/services';
import {AuthService} from 'src/app/common/services/auth/auth.service';
import {UserSettingsService} from 'src/app/common/services/auth/user-settings.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {
  HttpErrorInterceptor,
  JwtInterceptor,
  LoaderInterceptor,
  UserClaimsInterceptor,
} from 'src/app/common/interceptors';
import {GALLERY_CONFIG} from '@ngx-gallery/core';
import {AppMenuStateService, AuthStateService} from 'src/app/common/store';
import {persistProviders} from 'src/app/common/store/persist.config';
import {BaseService} from 'src/app/common/services/base.service';
import {DateInterceptor} from 'src/app/common/interceptors/date.interceptor';
import {MAT_DATE_FNS_FORMATS, DateFnsAdapter} from '@angular/material-date-fns-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {EformDateFnsDateAdapter} from 'src/app/common/modules/eform-date-adapter/eform-mat-datefns-date-adapter';
import {BehaviorSubject} from 'rxjs';
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
  WorkersService,
  FoldersService,
  AdminService,
  EntitySearchService,
  EntitySelectService,
  EFormService,
  EformTagService,
  EformReportService,
  EformDocxReportService,
  EmailRecipientsService,
  EmailRecipientsTagsService,
  CasesService,
  CasePostsService,
  TemplateFilesService,
  SecurityGroupsService,
  SecurityGroupEformsPermissionsService,
  PluginPermissionsService,
  NavigationMenuService,
  LoaderService,
  TitleService,
  EformDateFnsDateAdapter,
  {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: UserClaimsInterceptor, multi: true},
  {
    provide: GALLERY_CONFIG,
    useValue: {
      counterPosition: 'bottom',
    },
  },
  // {provide: DateAdapter<any>, useClass: EformDateFnsDateAdapter, deps: [MAT_DATE_LOCALE],},
  {provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS},
  {provide: MAT_DATE_LOCALE, useValue: new BehaviorSubject(null)},
  AuthStateService,
  AppMenuStateService,
  // Helpers
  EventBrokerService,
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy,
  },
  ...persistProviders,
  BaseService,
  ApiBaseService,
];
