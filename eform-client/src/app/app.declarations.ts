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
import {GALLERY_CONFIG} from 'ng-gallery';
import {AppMenuStateService, AuthStateService} from 'src/app/common/store';
import {BaseService} from 'src/app/common/services/base.service';
import {DateInterceptor} from 'src/app/common/interceptors/date.interceptor';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {EformDateFnsDateAdapter} from 'src/app/common/modules/eform-date-adapter/eform-mat-datefns-date-adapter';
import {BehaviorSubject} from 'rxjs';
import {EFORM_MAT_DATEFNS_LOCALES} from 'src/app/common/modules/eform-date-adapter/eform-mat-datefns-locales';
import {APP_INITIALIZER, ErrorHandler} from '@angular/core';
import * as Sentry from '@sentry/angular-ivy';
import {Router} from '@angular/router';
import {provideEnvironmentNgxMask} from "ngx-mask";
import {MatPaginatorIntl} from '@angular/material/paginator';
import {
  CustomMatPaginatorIntl
} from './common/modules/eform-shared/components/eform-pagination/mat_paginator_intl';
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
  {provide: MAT_DATE_LOCALE, useValue: new BehaviorSubject(null)},
  {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: false,
    }),
  }, {
    provide: Sentry.TraceService,
    deps: [Router],
  },
  {
    provide: APP_INITIALIZER,
    useFactory: () => () => {},
    deps: [Sentry.TraceService],
    multi: true,
  },
  AuthStateService,
  AppMenuStateService,
  // Helpers
  EventBrokerService,
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy,
  },
  BaseService,
  ApiBaseService,
  {
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntl,
  },
  provideEnvironmentNgxMask(),
];
