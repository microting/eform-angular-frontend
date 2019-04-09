import {DatePipe, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {AdminGuard, AuthGuard, CanDeactivateGuard} from 'src/app/common/guards';
import {ClaimsGuard} from 'src/app/common/guards/claims.guard';
import {EventBrokerService} from 'src/app/common/helpers';
import {
  EntitySearchService,
  EntitySelectService,
  SitesService,
  UnitsService,
  WorkersService
} from 'src/app/common/services/advanced';
import {AppMenuService, AppSettingsService} from 'src/app/common/services/settings/app-settings';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {CasesService, ImageService} from 'src/app/common/services/cases';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {EformReportService, EFormService, EformTagService} from 'src/app/common/services/eform';
import {SecurityGroupEformsPermissionsService, SecurityGroupsService} from 'src/app/common/services/security';
import {PluginsSettingsService} from 'src/app/common/services/settings/plugins-settings';
import {AdminService} from 'src/app/common/services/users';
import {FoldersService} from './common/services/advanced/folders.service';
// Guards

export let providers = [
  // Guards
  AuthGuard,
  AdminGuard,
  CanDeactivateGuard,
  ClaimsGuard,
  // Libs services
  ToastrService,
  CookieService,
  // Services
  AuthService,
  LocaleService,
  UserSettingsService,
  AppSettingsService,
  PluginsSettingsService,
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
  CasesService,
  ImageService,
  SecurityGroupsService,
  SecurityGroupEformsPermissionsService,
  // Helpers
  EventBrokerService,
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }
];
